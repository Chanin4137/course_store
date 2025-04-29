import FeaturedCourses from '@/components/customer-page/home/featured-courses'
import Hero from '@/components/customer-page/home/hero'


const HomePage = async () => {

  return (
    <div className='flex flex-col gap-6 md:gap-12'>
      <Hero></Hero>
      <FeaturedCourses></FeaturedCourses>
    </div>

  )
}
export default HomePage