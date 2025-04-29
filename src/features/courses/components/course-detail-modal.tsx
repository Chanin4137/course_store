import Modal from '@/components/shared/modal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CoursesType } from '@/types/courses'
import { Clock, DollarSign, FileText, ImageIcon, Package, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import dayjs from '@/lib/dayjs'
import { formatPrice } from '@/lib/formatPrice'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface CourseDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: CoursesType | null
}
const CourseDetailModal = ({ open, onOpenChange, course }: CourseDetailModalProps) => {

    if (!course) return null

    const formattedDate = dayjs(course.createdAt).fromNow()
    const courseColor = (() => {
        switch (true) {
            case course.seats <= 0:
                return 'text-red-500'
            case course.seats <= course.lowSeat:
                return 'text-amber-500'
            default:
                return 'text-green-600'
        }
    })

    const courseStatus = (() => {
        switch (true) {
            case course.seats <= 0:
                return 'No Available Seats'
            case course.seats <= course.lowSeat:
                return 'Low Seat'
            default:
                return 'Available Seats'
        }
    })()

    const discount = course.basePrice > course.price ? (
        ((course.basePrice - course.price) / course.basePrice) * 100).toFixed(2)
        : '0'

    // Cal Profit
    const profitPerUnit = course.cost > 0 ? course.price - course.cost : 0
    const profitMargin = course.cost > 0 ? ((profitPerUnit / course.cost) * 100).toFixed(2) : 'N/A'
    return (

        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={course.title}
            description={course.description}
            className='sm:max-w-3xl'
        >
            <div>
                <Tabs>
                    <TabsList className='grid grid-cols-3 mb-4 w-full'>
                        <TabsTrigger value='overview'>Overview</TabsTrigger>
                        <TabsTrigger value='details'>Details</TabsTrigger>
                        <TabsTrigger value='images'>Images ({course.images?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview'>
                        <ScrollArea className='max-h-[500px] overflow-y-auto'>
                            <Card className='overflow-hidden'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4'>
                                    <div className='relative aspect-square rounded-md overflow-hidden group'>
                                        <Image
                                            alt={course.title}
                                            src={course.mainImage?.url || '/images/no-product-image.webp'}
                                            fill
                                            className='object-cover transition-transform group-hover:scale-105'>
                                        </Image>
                                    </div>

                                    {/* Course Info */}
                                    <div className='p-4 flex flex-col'>
                                        <div className='mb-2 flex items-center justify-between'>
                                            <Badge
                                                variant={course.status === 'Active' ? 'default' : 'destructive'}
                                            >
                                                {course.status}
                                            </Badge>
                                            {/* <Badge
                                            variant='outline'
                                            className='flex items-center gap-1'
                                        >
                                            <Tag size={12}></Tag>
                                            <span>{course.category.name}</span>
                                        </Badge> */}
                                        </div>
                                        <h2 className='text-xl font-bold line-clamp-2 mb-1'>
                                            {course.title}
                                        </h2>

                                        <div className='flex items-center gap-1 text-xs text-muted-foreground mb-2'>
                                            <Clock size={12} />
                                            <span>Added {formattedDate}</span>
                                        </div>

                                        <div className='flex items-center gap-2 mb-3'>
                                            <div className='flex items-center gap-1'>
                                                <Package size={14} />
                                                <span className={`text-sm font-medium ${courseColor}`}>{courseStatus}</span>
                                            </div>
                                            <span className='text-sm text-muted-foreground'>({course.seats} seats left)</span>
                                        </div>

                                        <div className='mt-auto'>
                                            <div className='flex flex-warp items-baseline gap-2 mb-1'>
                                                <span>{formatPrice(course.price)}</span>

                                                {course.basePrice > course.price && (
                                                    <div className='flex items-center gap-1'>
                                                        <span className='text-sm line-through text-muted-foreground'>
                                                            {formatPrice(course.basePrice)}
                                                        </span>
                                                        <Badge variant='secondary' className='text-xs'>
                                                            {discount}% OFF
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {course.cost > 0 && (
                                                <div className='flex gap-2 text-xs text-muted-foreground'>
                                                    <span>Cost: {formatPrice(course.cost)}</span>
                                                    <span>.</span>
                                                    <span>Profit: {formatPrice(profitPerUnit)} ({profitMargin}%)</span>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </ScrollArea>

                        {/* Statistics Card */}
                        <Card className='mt-4'>
                            <CardContent className='p-4'>
                                <h3 className='text-sm font-semibold mb-2'>Enroll statistics</h3>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div className='flex flex-col items-center justify-center bg-muted/50 rounded-md p-2'>
                                        <ShoppingBag size={20} className='text-primary mb-1'></ShoppingBag>
                                        <span className='font-bold'>{course.enrolled}</span>
                                        <span className='teext-xs text-muted-foreground'>Enrolls</span>
                                    </div>
                                    <div className='flex flex-col items-center justify-center bg-muted/50 rounded-md p-2'>
                                        <DollarSign size={20} className='text-emerald-500 mb-1'></DollarSign>
                                        <span className='font-bold'>
                                            {formatPrice(course.enrolled * course.price)}
                                        </span>
                                        <span className='text-xs text-muted-foreground'>
                                            Income
                                        </span>
                                    </div>
                                    <div className='flex flex-col items-center justify-center bg-muted/50 rounded-md p-2'>
                                        <FileText size={20} className='text-blue-500 mb-1'></FileText>
                                        <span className='font-bold'>
                                            {course.cost > 0 ? formatPrice(
                                                course.enrolled * (course.price - course.cost),
                                            )
                                                : 'N/A'}
                                        </span>
                                        <span className='text-xs text-muted-foreground'>
                                            Profit
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* details tab */}
                    <TabsContent value='details'>
                        <ScrollArea className='max-h-[500px] overflow-y-auto'>
                            <Card className='break-all'>
                                <CardContent className='space-y-4'>
                                    <div className="flex flex-col gap-2">
                                        <h3 className='text-sm font-semibold'>Course Detail</h3>
                                        <p className='text-sm text-muted-foreground'>
                                            {course.description}
                                        </p>
                                    </div>

                                    <Separator></Separator>

                                    <div>
                                        <h3 className='text-sm font-semibold mb-2'>
                                            Specific information
                                        </h3>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <h2 className='text-muted-foreground'>SKU</h2>
                                                <p className='font-medium'>{course.sku}</p>
                                            </div>

                                            <div>
                                                <h2 className='text-muted-foreground'>Category</h2>
                                                <p className='font-medium'>{course.category.name}</p>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Status</h2>
                                                <Badge variant={
                                                    course.status === 'Active' ? 'default' : 'destructive'
                                                } >
                                                    {course.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Seats</h2>
                                                <p className={`font-medium ${courseColor}`}>
                                                    {course.seats} seats available
                                                </p>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Base price</h2>
                                                <p className='font-medium'>
                                                    {formatPrice(course.basePrice)}
                                                </p>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Sale price</h2>
                                                <p className='font-medium'>
                                                    {formatPrice(course.price)}
                                                </p>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Discount</h2>
                                                <p className='font-medium'>
                                                    {discount}%
                                                </p>
                                            </div>
                                            <div>
                                                <h2 className='text-muted-foreground'>Created at</h2>
                                                <p className='font-medium'>
                                                    {dayjs(course.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator></Separator>

                                    <div>
                                        <h3 className='text-sm font-semibold mb-2'>
                                            Sales information
                                        </h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Total sales</TableHead>
                                                    <TableHead>Income</TableHead>
                                                    <TableHead>Total cost</TableHead>
                                                    <TableHead>Profit</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>{course.enrolled} seats</TableCell>
                                                    <TableCell>{formatPrice(course.enrolled * course.price)}</TableCell>
                                                    <TableCell>{formatPrice(course.enrolled * course.cost)}</TableCell>
                                                    <TableCell>{formatPrice(course.enrolled * (course.price - course.cost))}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value='images'>
                        <ScrollArea className='max-h-[500px] overflow-y-auto'>
                            <Card>
                                <CardContent>
                                    <h3 className='text-sm font-semibold mb-3'>All images ({course.images?.length || 0} photos)</h3>
                                    {course.images && course.images.length > 0 ? (
                                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                                            {course.images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className='relative aspect-square border rounded-md overflow-hidden cursor-pointer group'>
                                                    <Image
                                                        alt={`Course image ${index + 1}`}
                                                        src={image.url}
                                                        fill
                                                        className='object-cover group-hover:scale-105 transition-transform duration-300'></Image>
                                                    {image.isMain && (
                                                        <Badge className='absolute top-1 left-1 text-[10px] z-10'>
                                                            หลัก
                                                        </Badge>
                                                    )}
                                                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center py-10 bg-muted/50 rounded-md'>
                                            <ImageIcon size={40} className='text-muted-foreground mb-2 opacity-40'></ImageIcon>
                                            <p className='text-sm text-muted-foreground'>There are no images for this Course.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </Modal >
    )
}
export default CourseDetailModal