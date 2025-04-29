import CourseList from '@/features/courses/components/course-list'
import { getCourses } from '@/features/courses/db/course'


const CoursesPage = async () => {
    const course = await getCourses()

    return (
        <div className='p-4 sm:p-6 space-y-6'>
            {/* Courses Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl sm:text-3xl font-bold'>Courses Management</h1>
                    <p className='text-muted-foreground text-sm'>Manage Your Courses and details</p>
                </div>
            </div>

            {/* Main Content */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                {/* Course list */}
                <div className='lg:col-span-3 '>
                    <CourseList courses={course}></CourseList>
                </div>
            </div>
        </div>
    )
}
export default CoursesPage