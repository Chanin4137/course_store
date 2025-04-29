'use client'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useTransition } from 'react'
import { addToCartAction } from '../actions/carts'
import { initialFormState } from '@/types/action'
import { toast } from 'sonner'

interface AddtoCartButtonProps {
    courseID: string
    seats: number
    className?: string
    children?: React.ReactNode
}



const AddtoCartButton = ({ courseID, seats, className, children }: AddtoCartButtonProps) => {
    const [isPending, startTransition] = useTransition()

    const handleAddtoCart = () => {
        startTransition(async () => {
            const formData = new FormData()
            formData.append('courseId', courseID)
            formData.append('count', '1')

            const result = await addToCartAction(initialFormState, formData)
            if (result && result.message)
                toast.error(result.message)
        })
    }
    return (
        <Button
            className={className}
            onClick={handleAddtoCart}
            disabled={isPending || seats <= 0}>
            <ShoppingCart size={16}></ShoppingCart>
            {children || 'เพิ่มคอร์สลงตะกร้า'}
        </Button>
    )
}
export default AddtoCartButton