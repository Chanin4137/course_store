import { getCategories } from '@/features/categories/db/categories'
import CourseForm from '@/features/courses/components/course-form'
import { getCourseById } from '@/features/courses/db/course'

interface EditCoursePageProps {
    params: Promise<{ id: string }>
}

const EditCoursePage = async ({ params }: EditCoursePageProps) => {
    const { id } = await params
    const [course, categories] = await Promise.all([
        getCourseById(id),
        getCategories()
    ])
    // const course = await getCourseById(id)
    // const categories = await getCategories()
    return (
        <div className='p-4 sm:p-6 space-y-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl sm:text-3xl font-bold'>
                    Edit Course
                </h1>
                <p className='text-muted-foreground text-sm'>
                    Update course information
                </p>
            </div>
            <CourseForm categories={categories} course={course}></CourseForm>
        </div >
    )
}
export default EditCoursePage