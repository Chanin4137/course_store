import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const Hero = () => {
    return (
        <div className='relative w-full overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute inset-0 bg-gradient-to-br from-muted-foreground via-muted to bg-blue-600 opacity-25'></div>

            <div className='container mx-auto relative px-4 py-16 md:py-24 lg:py-32'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
                    {/* Left Content */}
                    <div className='max-w-xl'>
                        <div className='inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-primary/60'>
                            <Sparkles size={14} className='mr-2'></Sparkles>
                            <span>ยินดีต้อนรับสู่เว็บไซต์ Scheint course store</span>
                        </div>

                        <h1 className='text-4xl md:text-6xl font-bold'>รวมคอร์ส
                            <span className='block mt-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>ได้รับการรับรองจาก ...</span>
                        </h1>

                        <p className='mt-6 text-lg text-muted-foreground'>
                            คอร์สเรียนที่ได้รับการรับรองจากหน่วยงานต่างๆ ที่มีชื่อเสียงในประเทศไทยและต่างประเทศ
                        </p>

                        <div className='mt-8 flex flex-col sm:flex-row gap-4'>
                            <Button size='lg' className='group shadow-lg shadow-primary/20' asChild>
                                <Link href='/courses'>
                                    <ShoppingBag size={20}></ShoppingBag>
                                    <span>ลงทะเบียนเลย!</span>
                                    <ArrowRight size={16} className='opacity-70 transition-transform group-hover:translate-x-1'></ArrowRight>
                                </Link>
                            </Button>

                            <Button
                                variant='outline'
                                size='lg'
                                className='border-primary/30 hover:bg-primary/5 transition-colors'
                                asChild
                            >
                                <Link href='/about'>เกี่ยวกับเรา</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className='hidden md:block relative'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='size-[400px] lg:size-[500px] rounded-full border-2 border-primary/20'></div>
                            <div className='absolute size-[320px] lg:size-[400px] rounded-full border-2 border-primary/20'></div>
                        </div>

                        <div className='relative z-10 flex items-center justify-center'>
                            <div className='relative size-[400px]'>
                                <Image
                                    alt='Education'
                                    src='/images/banner1.jpg'
                                    fill
                                    className='object-contain rounded-lg scale-110 hover:scale-105 hover:shadow-primary hover:shadow-md transition-all duration-700'
                                    priority></Image>

                                {/* Decorative Floating Elements */}
                                <div className='absolute -top-5 -right-10 p-3 bg-card rounded-lg shadow-lg border border-border/50 animate-float'>
                                    <div className='flex items-center gap-2'>
                                        <span className='size-3 rounded-full bg-green-500'></span>
                                        <span className='text-xs font-medium'>รับรองโดย</span>
                                    </div>
                                </div>

                                <div className='absolute -bottom-5 -left-10 p-3 bg-card rounded-lg shadow-lg border border-border/50 animate-float delay-500'>
                                    <div className='flex items-center gap-2'>
                                        <span className='size-3 rounded-full bg-blue-500'></span>
                                        <span className='text-xs font-medium'>คุณภาพสูง</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Hero