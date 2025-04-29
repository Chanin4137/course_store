import { getCategories } from '@/features/categories/db/categories'
import CourseForm from '@/features/courses/components/course-form'

const NewCoursePage = async () => {
    const categories = await getCategories()
    return (
        <div className='p-4 sm:p-6 space-y-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl md:text-3l font-bold'>Add New Course</h1>
                <p className='text-muted-foreground text-sm'>Create new Course</p>
            </div>
            <div>
                <CourseForm categories={categories}></CourseForm>
            </div>
        </div>
    )
}
export default NewCoursePage