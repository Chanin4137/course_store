import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'
import { CoursesType } from '@/types/courses'
import { RefreshCcw } from 'lucide-react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { restoreCourseAction } from '../actions/courses'

interface RestoreCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: CoursesType | null
}

export const RestoreCourseModal = ({ open, onOpenChange, course }: RestoreCourseModalProps) => {
    const { state, formAction, isPending } = useForm(restoreCourseAction)
    const router = useRouter()

    // Create a stable handler for closing the modal
    const handleClose = useCallback(() => {
        onOpenChange(false)
    }, [onOpenChange])

    useEffect(() => {
        if (state.success) {
            router.refresh() // Refresh the page data
            handleClose()
        }
    }, [state, handleClose, router])

    // Safer render approach that doesn't depend on course data for basic modal functionality
    return (
        <Modal
            open={open}
            onOpenChange={handleClose}
            title='Restore Course'
            description={course ? `Are you sure you want to restore ${course.title} course?` : 'No course selected'}
        >
            {course ? (
                <Form action={formAction}>
                    <input type='hidden' name='courseId' value={course.id}></input>
                    <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <SubmitBtn
                            name='Restore'
                            icon={RefreshCcw}
                            className='bg-green-600 hover:bg-green-600/80'
                            pending={isPending}>
                        </SubmitBtn>
                    </div>
                </Form>
            ) : (
                <div className='flex justify-end pt-6'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </div>
            )}
        </Modal>
    )
}


export default RestoreCourseModal