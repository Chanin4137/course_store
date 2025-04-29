import Modal from '@/components/shared/modal'
import SubmitBtn from '@/components/shared/submit-btn'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'
import { CoursesType } from '@/types/courses'
import { Trash2 } from 'lucide-react'
import Form from 'next/form'
import { useEffect } from 'react'
import { deleteCourseAction } from '../actions/courses'

interface DeleteCourseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: CoursesType | null
}

export const DeleteCourseModal = ({ open, onOpenChange, course }: DeleteCourseModalProps) => {
    const { state, formAction, isPending } = useForm(deleteCourseAction)

    useEffect(() => {
        if (state.success) {
            onOpenChange(false)
        }
    }, [state, onOpenChange])

    // Safer render approach that doesn't depend on course data for basic modal functionality
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
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
                            onClick={() => onOpenChange(false)} disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <SubmitBtn
                            name='Delete'
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
                        onClick={() => onOpenChange(false)} disabled={isPending}
                    >
                        Close
                    </Button>
                </div>
            )}
        </Modal>
    )
}