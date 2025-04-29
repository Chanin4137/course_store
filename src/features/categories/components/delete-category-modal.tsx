import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'

import { Trash2 } from 'lucide-react'
import Form from 'next/form'
import { deleteCategoryAction } from '@/features/categories/action/categories'
import { useEffect } from 'react'
import { CategoryType } from '@/types/category'

interface DeleteCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: CategoryType | null
}

const DeleteCategoryModal = ({
    open,
    onOpenChange,
    category
}: DeleteCourseModalProps) => {

    const { state, formAction, isPending } = useForm(deleteCategoryAction)

    useEffect(() => {
        if (state.success) {
            onOpenChange(false)
        }
    }, [state, onOpenChange])

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title='Delete Category'
            description='Are you sure you want to delete this category?'
        >
            {/* Modal contents for deletion */}
            <Form action={formAction}>
                <input name='category-id' type='hidden' value={category?.id}></input>
                <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6'>
                    <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancle
                    </Button>
                    <SubmitBtn name='delete' type='submit' icon={Trash2} className='bg-destructive hover:bg-destructive/80 ' pending={isPending}>

                    </SubmitBtn>
                </div>
            </Form>
        </Modal>
    )
}

export default DeleteCategoryModal