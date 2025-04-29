'use client'
import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CategoryType } from '@/types/category'
import { Save } from 'lucide-react'
import Form from 'next/form'
import { useState } from 'react'
import { coursesActions } from '../actions/courses'
import { useForm } from '@/hooks/use-form'
import ErrorMessage from '@/components/shared/error-message'
import CourseImageUpload from './course=image-upload'
import { CoursesType } from '@/types/courses'


interface CourseFormProps {
    categories: CategoryType[]
    course?: CoursesType | null
}


const CourseForm = ({ categories, course }: CourseFormProps) => {

    const [basePrice, setBasePrice] = useState(course ? course.basePrice.toString() : '')
    const [salePrice, setSalePrice] = useState(course ? course.price.toString() : '')

    // image state
    const [courseImages, setCourseImages] = useState<File[]>([])
    const [mainImageIndex, setMainImageIndex] = useState(course?.mainImageIndex || 0)

    // Delete Images
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

    const { errors, formAction, isPending, clearErrors } = useForm(coursesActions, '/admin/courses')

    const calculateDiscount = () => {
        // Parse base price and sale price as numbers
        const basePriceNum = parseFloat(basePrice) || 0
        const salePriceNum = parseFloat(salePrice) || 0



        // Calculate discount percentage
        if (basePriceNum === 0 || salePriceNum === 0) return '0%'
        if (basePriceNum <= salePriceNum) return '0%'


        const discount = ((basePriceNum - salePriceNum) / basePriceNum) * 100
        return `${discount.toFixed(2)}%`
    }

    const handleImagesChange = (images: File[], mainIndex: number, deleteIds: string[] = []) => {
        setCourseImages(images)
        setMainImageIndex(mainIndex)
        setDeletedImageIds(deleteIds)
    }

    const handleSubmit = async (formData: FormData) => {

        if (course) {
            formData.append('course-id', course.id)
        }
        //Add files to formData
        if (courseImages.length > 0) {
            courseImages.forEach((file) => {
                formData.append('images', file)
            })
        }
        formData.append('main-image-index', mainImageIndex.toString())

        if (deletedImageIds.length > 0) {
            formData.append('deleted-image-ids', JSON.stringify(deletedImageIds))
        }
        // Submit forrm
        return formAction(formData)
    }

    return (
        <Card className='max-w-4xl mx-auto'>
            <CardHeader>
                <CardTitle className='text-lg sm:text-xl'>
                    Course Information
                </CardTitle>
                <CardDescription>Enter the details new Course</CardDescription>
            </CardHeader>
            <Form action={handleSubmit} onChange={clearErrors} className='space-y-4'>
                <CardContent className='space-y-6'>
                    {/* Basic Information */}
                    <div className='space-y-4'>
                        <h3 className='font-medium'>Basic Information</h3>
                        {/* Course Title */}
                        <div className='space-y-2'>
                            <InputForm
                                label='Course Title'
                                id='title'
                                placeholder='Enter Course Title'
                                required
                                defaultValue={course?.title}
                            ></InputForm>
                            {/* Error MSG */}
                            {errors.title && <ErrorMessage error={errors.title[0]} />}
                        </div>

                        {/* Course Description */}
                        <div className='space-y-2'>
                            <Label htmlFor='description'>
                                Description <span className='text-red-500'>*</span>
                            </Label>
                            <Textarea
                                id='description'
                                name='description'
                                placeholder='Descibe your Course'
                                className='min-h-20'
                                defaultValue={course?.description}
                            >
                            </Textarea>

                            {/* Error MSG */}
                            {errors.description && <ErrorMessage error={errors.description[0]} />}

                        </div>

                        {/* Category */}
                        <div className='space-y-2'>
                            <Label>Category</Label>
                            <Select name='category-id' defaultValue={course?.categoryId}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select Category' />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories
                                        .filter((category) => category.status === 'Active')
                                        .map((category, index) => (
                                            <SelectItem
                                                key={index}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            {/* Error MSG */}
                            {errors.categoryId && <ErrorMessage error={errors.categoryId[0]} />}
                        </div>



                        {/* Pricing Information */}
                        <div className='space-y-4'>
                            <h3 className='font-medium'>Pricing Information</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {/* Cost */}
                                <div className='flex flex-col gap-2'>
                                    <InputForm
                                        label='Cost Price'
                                        id='cost'
                                        type='number'
                                        min='0'
                                        step='0.01'
                                        placeholder='0.00'
                                        defaultValue={course?.cost}>
                                    </InputForm>
                                    {/* Error MSG */}
                                    {errors.cost && <ErrorMessage error={errors.cost[0]} />}
                                </div>
                                {/* Base Price */}
                                <div className='flex flex-col gap-2'>
                                    <InputForm
                                        label='Base Price'
                                        id='base-price'
                                        type='number'
                                        min='0'
                                        step='0.01'
                                        placeholder='0.00'
                                        required
                                        defaultValue={course?.basePrice || basePrice}
                                        // value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}>
                                    </InputForm>
                                    {/* Error MSG */}
                                    {errors.basePrice && <ErrorMessage error={errors.basePrice[0]} />}
                                </div>
                                {/* Sale Price */}
                                <div className='flex flex-col gap-2'>
                                    <InputForm
                                        label='Sale Price'
                                        id='price'
                                        type='number'
                                        min='0'
                                        step='0.01'
                                        placeholder='0.00'
                                        required
                                        defaultValue={course?.price || basePrice}
                                        // value={salePrice}
                                        onChange={(e) => setSalePrice(e.target.value)}>
                                    </InputForm>
                                    {/* Error MSG */}
                                    {errors.price && <ErrorMessage error={errors.price[0]} />}
                                </div>
                                {/* Discount Display */}
                                <div className='flex flex-col gap-2'>
                                    <Label>Discount</Label>
                                    <div className='h-9 px-3 rounded-md border border-input bg-gray-50 flex items-center'>
                                        {calculateDiscount()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seats Information */}
                        <div className='space-y-4'>
                            <h3 className='font-medium'>Pricing Information</h3>

                            <div className='flex flex-col gap-2'>
                                <InputForm
                                    label='Seat Quantity'
                                    id='seat'
                                    type='number'
                                    min='0'
                                    step='1'
                                    placeholder='0'
                                    required
                                    defaultValue={course?.seats}
                                >
                                </InputForm>
                                {/* Error MSG */}
                                {errors.seat && <ErrorMessage error={errors.seat[0]} />}
                            </div>
                        </div>
                    </div>
                    {/* Image */}
                    <CourseImageUpload onImagesChange={handleImagesChange} existingImages={course?.images}></CourseImageUpload>
                </CardContent>
                <CardFooter>
                    <SubmitBtn
                        name={course ? 'Update Course' : 'Save Course'}
                        icon={Save} pending={isPending}
                        className='w-full'>
                    </SubmitBtn>
                </CardFooter>
            </Form>
        </Card>
    )
}
export default CourseForm