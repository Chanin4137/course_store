import { getGlobalTag, getIdTag } from '@/lib/dataCache'
import { revalidateTag } from 'next/cache'

// Returns a tag representing a globally cached "courses" data.
export const getCoursesGlobalTag = () => {
    return getGlobalTag('courses')
}

// Returns a tag representing a specific course by id.
// This function is asynchronous because it may perform asynchronous operations
// (e.g., fetching data or calculating the tag), so it returns a Promise.
export const getCourseIdTag = async (id: string) => {
    return getIdTag('courses', id)
}

// Revalidates the cache for courses.
// - First, revalidates the global courses tag
// - Then, revalidates the specific course tag that requires waiting (via await)
//   for the asynchronous getCourseIdTag to resolve before proceeding.
export const revalidateCourseCache = async (id: string) => {
    revalidateTag(getCoursesGlobalTag())
    revalidateTag(await getCourseIdTag(id))
}