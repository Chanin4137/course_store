import InputForm from '@/components/shared/input-form'
import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { useForm } from '@/hooks/use-form'
import { CategoryType } from '@/types/category'
import { Save } from 'lucide-react'
import Form from 'next/form'
import { categoryAction } from '@/features/categories/action/categories'
import ErrorMessage from '@/components/shared/error-message'
import { useEffect } from 'react'


interface EditCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: CategoryType | null
}
const EditCategoryModal = ({ open, onOpenChange, category }: EditCategoryModalProps) => {

    const { state, errors, formAction, isPending, clearErrors } = useForm(categoryAction)
    useEffect(() => {
        if (state.success) onOpenChange(false)
    }, [state, onOpenChange])

    useEffect(() => {
        if (open) clearErrors()
    }, [open, clearErrors])



    return (
        <Modal open={open} onOpenChange={onOpenChange} title='Update Course Category' description='Update information'>
            <Form action={formAction} onChange={clearErrors} className='space-y-4 '>
                <input type="hidden" name='category-id' value={category?.id} />

                <div className='space-y-2'>
                    <InputForm
                        label='Category name'
                        id='category-name'
                        placeholder='Enter Course category'
                        required defaultValue={category.name}></InputForm>

                    {/* Error MSG */}
                    {errors.name && <ErrorMessage error={errors.name[0]}></ErrorMessage>}
                </div>

                <SubmitBtn name='Update Category' className='w-full' icon={Save} pending={isPending}></SubmitBtn>
            </Form>
        </Modal >
    )
}
export default EditCategoryModal