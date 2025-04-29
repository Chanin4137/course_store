import { db } from '@/lib/db'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import { getCategoryGlobalTag, revalidateCategoryCache } from './cache'
import { categorySchema } from '@/features/categories/schemas/categories'
import { authCheck } from '@/features/auths/db/auths'
import { canCreateCategory, canUpdateCategory } from '@/features/categories/permissions/categories'
import { redirect } from 'next/navigation'
import { CategoryStatus } from '@prisma/client'

interface CreateCategoryInput {
    name: string
}

interface UpdateCategoryInput {
    id: string,
    name: string
}
export const getCategories = async () => {
    'use cache'
    cacheLife('days')
    cacheTag(getCategoryGlobalTag())

    try {
        const categories = await db.category.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                id: true,
                name: true,
                status: true
            }
        })

        return categories
    } catch (error) {
        console.error('Error feching categories data:', error)
        return []
    }
}

export const createCategory = async (input: CreateCategoryInput) => {
    try {
        const { success, data, error } = categorySchema.safeParse(input)

        const user = await authCheck()
        if (!user || !canCreateCategory) {
            redirect('/')
        }

        if (!success) {
            return {
                message: 'Please enter valid data',
                error: error.flatten().fieldErrors
            }
        }

        //Check Categories 

        const category = await db.category.findFirst({
            where: {
                name: data.name
            }
        })

        if (category) {
            return {
                message: 'Category is already exists'
            }
        }

        //Create new category

        const newCategory = await db.category.create({
            data: {
                name: data.name
            }
        })

        //revalidate Cache for make new Cache

        revalidateCategoryCache(newCategory.id)

    } catch (error) {
        console.error('Error creating new category: ', error)
        return {
            message: 'Somthing went wrong. Please try again later'
        }
    }
}

export const updateCategory = async (input: UpdateCategoryInput) => {

    const user = await authCheck()
    if (!user || !canUpdateCategory(user)) {
        redirect('/')
    }

    try {
        const { success, data, error } = categorySchema.safeParse(input)

        if (!success) {
            return {
                message: 'Please enter valid data',
                error: error.flatten().fieldErrors
            }
        }

        //Check Categories 

        const existscategory = await db.category.findUnique({
            where: {
                id: input.id
            }
        })

        if (!existscategory) {
            return {
                message: 'Category not found.',
            }
        }

        //Check Categories name 

        const duplicateCategory = await db.category.findFirst({
            where: {
                name: data.name,
                id: {
                    not: input.id
                }
            }
        })

        if (duplicateCategory) {
            return {
                message: 'Category with this name already exists.',
            }
        }

        //Update category

        const updatedCategory = await db.category.update({
            where: {
                id: input.id
            },
            data: {
                name: data.name
            }
        })

        revalidateCategoryCache(updatedCategory.id)

    } catch (error) {
        console.error('Error updating category: ', error)
        return {
            message: 'Somthing went wrong. Please try again later'
        }
    }
}

export const changeCategoryStatus = async (id: string, status: CategoryStatus) => {
    const user = await authCheck()
    if (!user || !canUpdateCategory(user)) {
        redirect('/')
    }

    try {
        //check exists category
        const existscategory = await db.category.findUnique({
            where: {
                id: id
            }
        })
        if (!existscategory) {
            return {
                message: 'Category not found.',
            }
        }

        //check status
        if (existscategory.status === status) {
            return {
                message: `Category is already ${status.toLowerCase()}`,
            }
        }

        //Update category status

        const updateCategory = await db.category.update({
            where: { id },
            data: { status }
        })

        revalidateCategoryCache(updateCategory.id)

    } catch (error) {
        console.error('Error changing category status: ', error)
        return {
            message: 'Somthing went wrong. Please try again later'
        }

    }
}


export const removeCategory = async (id: string) => {
    return await changeCategoryStatus(id, 'Inactive')
}

export const restoreCategory = async (id: string) => {
    return await changeCategoryStatus(id, 'Active')
}   