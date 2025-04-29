'use server'

import { InitialFormState } from '@/types/action'
import { changeCourseStatus, createCourse, updateCourse } from '../db/course'
import { uploadToImageKit } from '@/lib/imageKit'


export const coursesActions = async (_prevState: InitialFormState, formData: FormData) => {
    const rawData = {
        id: formData.get('course-id') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        cost: formData.get('cost') as string,
        basePrice: formData.get('base-price') as string,
        price: formData.get('price') as string,
        seat: formData.get('seat') as string,
        categoryId: formData.get('category-id') as string,
        mainImageIndex: formData.get('main-image-index') as string,
        deletedImageIds: formData.get('deleted-image-ids') as string,
    }

    const processedData = {
        ...rawData,
        cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
        basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
        price: rawData.price ? parseFloat(rawData.price) : 0,
        seat: rawData.seat ? parseInt(rawData.seat) : 0,
        mainImageIndex: rawData.mainImageIndex ? parseInt(rawData.mainImageIndex) : 0,
        deletedImagesIds: rawData.deletedImageIds ? JSON.parse(rawData.deletedImageIds) : [],
    }

    const uploadedImages = []
    const imageFiles = formData.getAll('images') as unknown as File[];

    for (const imageFile of imageFiles) {
        const uploadResult = await uploadToImageKit(imageFile, 'courses');
        if (uploadResult && !uploadResult.message) {
            if (uploadResult.fileId) {
                uploadedImages.push({
                    url: uploadResult.url,
                    fileId: uploadResult.fileId,
                });
            }
        }
    }

    const result = processedData.id ?
        await updateCourse({
            ...processedData,
            images: uploadedImages,
        })
        :
        await createCourse({
            ...processedData,
            images: uploadedImages,
            mainImageIndex: processedData.mainImageIndex,
        })
    return result && result.message ? {
        success: false,
        message: result.message,
        errors: result.error,
    } : {
        success: true,
        message: processedData.id
            ? 'Course updated successfully'
            : 'Course created successfully',
    }
}

export const deleteCourseAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const id = formData.get('courseId') as string;
    if (!id) { // check id exists
        return { success: false, message: 'Course ID is required' };
    }
    const result = await changeCourseStatus(id, 'Inactive');

    return result && result.message ? {
        success: false,
        message: result.message,
    } : {
        success: true,
        message: 'Course deleted successfully',
    }
}

export const restoreCourseAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const id = formData.get('courseId') as string;
    if (!id) { // check id exists
        return { success: false, message: 'Course ID is required' };
    }
    const result = await changeCourseStatus(id, 'Active');

    return result && result.message ? {
        success: false,
        message: result.message,
    } : {
        success: true,
        message: 'Course restored successfully',
    }
}