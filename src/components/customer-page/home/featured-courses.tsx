import { Button } from '@/components/ui/button'
import { getFeaturedCourses } from '@/features/courses/db/course'
import { ArrowRight, Sparkle } from 'lucide-react'
import Link from 'next/link'
import CourseCard from '../courses/course-card'

const FeaturedCourses = async () => {
    const courses = await getFeaturedCourses()
    return (
        <section className='container mx-auto px-4 py-12'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
                <div>
                    <div className='inline-flex items-center px-4 py-1.5 mb-2 border border-primary/60 rounded-full'>
                        <Sparkle size={14} className='mr-2 text-primary'></Sparkle>
                        <span>คอร์สแนะนำ</span>
                    </div>

                    <h2 className='text-2xl md:text-3xl font-bold'>
                        คอร์สขายดีประจำสัปดาห์
                    </h2>
                </div>
                <Button variant='ghost' className='group' asChild>
                    <Link href='/courses' className='flex items-center gap-2'>
                        <span>ดูคอร์สทั้งหมด</span>
                        <ArrowRight size={16} className='transition-transform group-hover:translate-x-1' />
                    </Link>
                </Button>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                {courses.map((course, index) => (
                    <CourseCard key={index} course={course}></CourseCard>
                ))}
            </div>
        </section>
    )
}
export default FeaturedCourses