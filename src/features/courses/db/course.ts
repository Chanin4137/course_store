import { db } from '@/lib/db';
import {
    unstable_cacheLife as cacheLife,
    unstable_cacheTag as cacheTag
} from 'next/cache';
import { getCourseIdTag, getCoursesGlobalTag, revalidateCourseCache } from './cache';
import { createCourseSchema } from '../schemas/courses';
import { revalidateCategoryCache } from '@/features/categories/db/cache';
import { authCheck } from '@/features/auths/db/auths';
import { canCreateCourse, canUpdateCourse } from '../permissions/courses';
import { redirect } from 'next/navigation';
import * as fs from 'fs';
import { CourseStatus } from '@prisma/client';

interface CreateCourseInput {
    title: string;
    description: string;
    cost?: number;
    basePrice: number;
    price: number;
    seat: number;
    categoryId: string;
    mainImageIndex: number;
    images: Array<{ url?: string; fileId: string }>;
}

export const getCourses = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag(getCoursesGlobalTag())
    try {
        const courses = await db.courses.findMany({
            include: {
                category: {
                    select: {
                        name: true,
                        id: true,
                        status: true,
                    },
                },
                images: true // use "CourseImage" as defined in schema.prisma
            },
        })

        return courses.map((course) => {
            const mainImage = course.images.find(img => img.isMain) || null
            return {
                ...course,
                category: course.category.name,
                lowSeat: 5,
                sku: course.id.substring(0, 8).toUpperCase(),
                mainImage, // main image extracted from CourseImage array
                images: course.images,
            }
        })
    } catch (error) {
        console.error("Error fetching courses:", error);
        return []
    }
}

export const getCourseById = async (id: string) => {
    'use cache'

    cacheLife('hours')
    cacheTag(await getCourseIdTag(id))
    try {

        // 
        const course = await db.courses.findUnique({
            where: {
                id,
            },
            include: {
                category: {
                    select: {
                        name: true,
                        id: true,
                        status: true,
                    },
                },
                images: true // use "CourseImage" as defined in schema.prisma
            },
        })

        if (!course) {
            return null
        }

        //find main image
        const mainImage = course.images.find(img => img.isMain)
        const mainImageIndex = mainImage ? course.images.indexOf(mainImage) : 0

        return {
            ...course,
            lowSeat: 5,
            sku: course.id.substring(0, 8).toUpperCase(),
            mainImage: mainImage || null, // main image extracted from CourseImage array
            mainImageIndex,
            images: course.images,
        }
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        return null

    }
}

export const getFeaturedCourses = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag(getCoursesGlobalTag())

    try {
        const courses = await db.courses.findMany({
            where: {
                status: 'Active',
            },
            orderBy: [{ enrolled: 'desc' }, { createdAt: 'desc' }],
            take: 8,
            include: {
                category: {
                    select: {
                        name: true,
                        id: true,
                        status: true,
                    },
                },
                images: true // use "CourseImage" as defined in schema.prisma
            },
        })

        return courses.map((course) => {
            const mainImage = course.images.find((image) => image.isMain)

            return {
                ...course,
                lowSeat: 5,
                sku: course.id.substring(0, 8).toUpperCase(),
                mainImage,
                images: course.images,
            }
        })
    } catch (error) {
        console.error("Error fetching featured courses:", error);
        return []

    }
}

export const createCourse = async (input: CreateCourseInput) => {
    const user = await authCheck()
    if (!user || !canCreateCourse(user)) {
        redirect('/')
    }

    try {
        const { success, data, error } = createCourseSchema.safeParse(input)

        if (!success) {
            return {
                message: 'Please enter valid Course Information',
                error: error.flatten().fieldErrors,
            }
        }

        // Check if the category exists
        const category = await db.category.findUnique({
            where: {
                id: data.categoryId,
                status: 'Active'
            },
        })
        if (!category) {
            return {
                message: 'Category not found or inactive',
            }
        }


        // Create the course
        const newCourse = await db.$transaction(async (prisma) => {
            // Create new product
            const Course = await db.courses.create({
                data: {
                    title: data.title,
                    description: data.description,
                    cost: data.cost,
                    basePrice: data.basePrice,
                    price: data.price,
                    seats: data.seat,
                    categoryId: input.categoryId,
                },
            })

            // Create Course Images using the relation "CourseImage"
            if (input.images && input.images.length > 0) {
                await Promise.all(
                    input.images.map((image, index) => {
                        return prisma.courseImage.create({
                            data: {
                                url: image.url || '',
                                fileId: image.fileId || '',
                                isMain: index === input.mainImageIndex,
                                courseId: Course.id,
                            }
                        })
                    })
                )
            }
            return Course // return the created course to use for cache revalidation
        })


        // Revalidate the cache after creating the course
        revalidateCategoryCache(newCourse.id)
    } catch (error) {
        console.error("Error creating course:", error);
        return {
            message: 'Something went wrong. Please try again later.',
        }

    }
}

export const updateCourse = async (input: CreateCourseInput & {
    id: string
    deletedImagesIds: string[]
}) => {
    const user = await authCheck()
    if (!user || !canUpdateCourse(user)) {
        redirect('/')
    }

    try {
        const { success, data, error } = createCourseSchema.safeParse(input)
        if (!success) {
            return {
                message: 'Please enter valid Course Information',
                error: error.flatten().fieldErrors,
            }
        }
        // Check if the course exists
        const existingCourse = await db.courses.findUnique({
            where: { id: input.id },
            include: {
                images: true,
            },
        })

        if (!existingCourse) {
            return {
                message: 'Course not found',
            }
        }
        // Check if the category exists
        const category = await db.category.findUnique({
            where: {
                id: input.categoryId,
                status: 'Active'
            },
        })
        if (!category) {
            return {
                message: 'Category not found or inactive',
            }
        }

        // Delete image from local storage
        if (input.deletedImagesIds && input.deletedImagesIds.length > 0) {
            for (const deletedImagesId of input.deletedImagesIds) {
                const deletedImage = existingCourse.images.find(image => image.id === deletedImagesId);
                if (deletedImage) {
                    const filePath = `./public/uploads/courses/${deletedImage.fileId}`;
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath); // Delete the file from local storage
                        }
                    } catch (err) {
                        console.error(`Error deleting file ${filePath}:`, err);
                    }
                }
            }
        }

        const updatedCourse = await db.$transaction(async (prisma) => {
            const course = await prisma.courses.update({
                where: { id: input.id },
                data: {
                    title: data.title,
                    description: data.description,
                    cost: data.cost,
                    basePrice: data.basePrice,
                    price: data.price,
                    seats: data.seat,
                    categoryId: input.categoryId,
                },
            })

            if (input.deletedImagesIds && input.deletedImagesIds.length > 0) {
                await prisma.courseImage.deleteMany({
                    where: {
                        id: { in: input.deletedImagesIds },
                        courseId: course.id
                    },
                })
            }

            // set isMain to false for all images
            await prisma.courseImage.updateMany({
                where: {
                    courseId: course.id,
                },
                data: {
                    isMain: false,
                },
            })

            // add new images
            if (input.images && input.images.length > 0) {
                await Promise.all(
                    input.images.map((image) => {
                        return prisma.courseImage.create({
                            data: {
                                url: image.url || '',
                                fileId: image.fileId || '',
                                isMain: false,
                                courseId: course.id,
                            }
                        })
                    })
                )
            }

            //Search for the main image and set it to true
            const allImages = await prisma.courseImage.findMany({
                where: {
                    courseId: course.id,
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })

            if (allImages.length > 0) {
                //Check if mainImageIndex is not out of bounds
                //Use Math.min find lowest value
                const valiIndex = Math.min(input.mainImageIndex, allImages.length - 1)
                if (valiIndex >= 0) {
                    // set the main image to true
                    await db.courseImage.update({
                        where: {
                            id: allImages[valiIndex].id,
                        },
                        data: {
                            isMain: true,
                        },
                    })
                }
            }
            return course // return the updated course to use for cache revalidation
        })

        revalidateCourseCache(updatedCourse.id)
    } catch (error) {
        console.error("Error updating course:", error);
        return {
            message: 'Something went wrong. Please try again later.',
        }

    }
}

export const changeCourseStatus = async (
    id: string,
    status: CourseStatus
) => {
    const user = await authCheck()
    if (!user || !canUpdateCourse(user)) {
        redirect('/')
    }

    try {
        const existingProduct = await db.courses.findUnique({
            where: { id },
        })
        if (!existingProduct) {
            return {
                message: 'Course not found',
            }
        }

        // Check if the course is already in the desired status
        if (existingProduct.status === status) {
            return {
                message: `Course is already ${status.toLowerCase()}`,
            }
        }
        //update course status
        const updatedCourse = await db.courses.update({
            where: { id },
            data: {
                status,
            },
        })
        // Revalidate the cache after updating the course status
        revalidateCourseCache(updatedCourse.id)
    } catch (error) {
        console.error("Error changing course status:", error);
        return {
            message: 'Something went wrong. Please try again later.',
        }

    }
}

