'use client'

import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from '@/hooks/use-form'
import { Plus } from 'lucide-react'
import Form from 'next/form'
import { categoryAction } from '@/features/categories/action/categories'
import ErrorMessage from '@/components/shared/error-message'

function CategoryForm() {

    const { errors, formAction, isPending, clearErrors } = useForm(categoryAction)

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                    <Plus size={18}></Plus>
                    <span>Add new category</span>
                </CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                    Create new Course categories
                </CardDescription>
            </CardHeader>
            <Form action={formAction} onChange={clearErrors} className='space-y-4'>
                <CardContent>
                    <div className='space-y-2'>
                        <InputForm label='Category name' id='category-name' placeholder='Enter Course category' required></InputForm>
                        {/* Error msg */}
                        {errors.name && <ErrorMessage error={errors.name[0]}></ErrorMessage>}
                    </div>
                </CardContent>
                <CardFooter className=''>
                    <SubmitBtn name='Add Category' icon={Plus} className='w-full' pending={isPending}>
                    </SubmitBtn>
                </CardFooter>
            </Form>
        </Card>
    )
}
export default CategoryForm