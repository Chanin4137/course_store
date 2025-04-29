import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'
import { CategoryType } from '@/types/category'
import { RefreshCcw } from 'lucide-react'
import Form from 'next/form'
import { restoreCategoryAction } from '@/features/categories/action/categories'
import { useEffect } from 'react'


interface RestorecategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: CategoryType | null
}

const RestoreCategoryModal = ({
    open,
    onOpenChange,
    category
}: RestorecategoryModalProps) => {

    const { state, formAction, isPending } = useForm(restoreCategoryAction)

    useEffect(() => {
        if (state.success) {
            onOpenChange(false)
        }
    }, [state, onOpenChange])

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title='Restore Category'
            description='Are you sure you want to restore this Category?'
        >
            {/* Modal contents for deletion */}
            <Form action={formAction}>
                <input name='category-id' type='hidden' value={category?.id}></input>
                <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6'>
                    <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancle
                    </Button>
                    <SubmitBtn name='restore' type='submit' icon={RefreshCcw} className='bg-green-600 hover:bg-green-600/80 ' pending={isPending}>

                    </SubmitBtn>
                </div>
            </Form>
        </Modal>
    )
}

export default RestoreCategoryModal