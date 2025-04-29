import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'
import { CoursesType } from '@/types/courses'
import { Trash2 } from 'lucide-react'
import Form from 'next/form'
import { useEffect, useCallback } from 'react'
import { deleteCourseAction } from '../actions/courses'

interface DeleteCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: CoursesType | null
}

export const DeleteCourseModal = ({ open, onOpenChange, course }: DeleteCourseModalProps) => {
    const { state, formAction, isPending } = useForm(deleteCourseAction)
    
    // Create a stable handler for closing the modal
    const handleClose = useCallback(() => {
        onOpenChange(false)
    }, [onOpenChange])
    
    useEffect(() => {
        if (state.success) {
            handleClose()
        }
    }, [state, handleClose])

    // Safer render approach that doesn't depend on course data for basic modal functionality
    return (
        <Modal
            open={open}
            onOpenChange={handleClose}
            title='Delete Course'
            description={course ? `Are you sure you want to Delete ${course.title} course?` : 'No course selected'}
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
                            name='delete'
                            icon={Trash2}
                            className='bg-destructive hover:bg-destructive/80'
                            pending={isPending}>
                            Delete
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