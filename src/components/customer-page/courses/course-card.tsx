import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import AddtoCartButton from '@/features/carts/components/add-to-cart-button'
import { formatPrice } from '@/lib/formatPrice'
import { cn } from '@/lib/utils'
import { CoursesType } from '@/types/courses'
// import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CourseCardProps {
    course: CoursesType
}

const CourseCard = ({ course }: CourseCardProps) => {
    const discount = course.basePrice > course.price ? (
        (course.basePrice - course.price) / course.basePrice) * 100 : 0
    return (
        <Card className='group overflow-hidden transition-all duration-300 border-border/40 hover:border-primary/50 hover:shadow-md'>
            <Link href={`/courses/${course.id}`}>
                <div className='relative pt-[100%] overflow-hidden bg-muted/30'>

                    {/* if course have discount */}
                    {discount > 0 && (
                        <Badge className='absolute top-2 left-2 z-10 px-2 py-1'>
                            -{Math.round(discount)}%
                        </Badge>
                    )}

                    {/* Course Image */}
                    <div className='absolute inset-0 size-full transition-transform ducation-500 group-hover:scale-105'>
                        <Image
                            alt={course.title}
                            src={course.mainImage?.url || '/images/no-product-image.webp'}
                            fill
                            className='object-cover'
                        ></Image>
                    </div>

                    {/* Course Status */}
                    {course.seats <= 0 && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/50 z-10'>
                            <Badge variant='destructive' className='text-sm px-3 py-1'>
                                คอร์สเต็มแล้ว
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className='p-4'>
                <div className='space-y-2'>
                    <Link href={`/courses/${course.id}`}>
                        <h3 className='font-medium line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors duration-200'>
                            {course.title}
                        </h3>
                    </Link>
                    <div className='flex justify-between items-baseline'>
                        <div className='flex flex-col'>
                            <span className='font-medium text-lg'>
                                {formatPrice(course.price)}
                            </span>
                            {course.basePrice > course.price && (
                                <span className='text-sm line-through text-muted-foreground'>
                                    {formatPrice(course.basePrice)}
                                </span>
                            )}
                        </div>
                        {course.seats > 0 ? (
                            <Badge variant='outline'
                                className={cn(
                                    'transition-colors',
                                    course.seats <= course.lowSeat
                                        ? 'text-amber-500 border-amber-500'
                                        : 'text-green-600 border-green-600'
                                )}
                            >
                                {course.seats <= course.lowSeat ? 'ที่นั่งเหลือน้อย' : 'ที่นั่งว่าง'}
                            </Badge>
                        ) : (
                            <Badge
                                variant='outline'
                                className='text-destructive border-destructive'>
                                คอร์สเต็มแล้ว
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className='p-3 gap-2'>
                {/* <Button
                    className='w-full gap-1'
                    size='sm'
                    disabled={course.seats <= 0}>
                    <ShoppingCart size={16}></ShoppingCart>
                    <span>เพิ่มคอร์สลงตะกร้า</span>
                </Button> */}
                <AddtoCartButton
                    courseID={course.id}
                    seats={course.seats}
                    className='w-full gap-1'
                >
                    <span>เพิ่มคอร์สลงตะกร้า</span>
                </AddtoCartButton>
            </CardFooter>
        </Card >
    )
}
export default CourseCard