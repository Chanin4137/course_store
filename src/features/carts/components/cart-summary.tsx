'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/formatPrice'
import { CartType } from '@/types/cart'
import { ShoppingBag } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'
import { clearCartAction } from '../actions/carts'
import { toast } from 'sonner'
import Link from 'next/link'

interface CartSummaryProps {
  cart: CartType
}

const CartSummary = ({ cart }: CartSummaryProps) => {

  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, action: 'clear') => {
      if (action === 'clear') {
        return {
          ...state,
          items: [],
          cartTotal: 0,
          itemCount: 0,
        }
      }
      return state
    }
  )

  const [isPending, startTransition] = useTransition()

  const handleClearCart = async () => {
    startTransition(async () => {
      updateOpCart('clear')
    })

    const result = await clearCartAction()
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }
  return (
    <Card className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>สรุปการลงทะเบียน</h2>

      <div className='space-y-6'>
        <div className='flex justify-between'>
          <span>ยอดรวม</span>
          <span>{formatPrice(opCart.cartTotal)}</span>
        </div>

        <Separator></Separator>

        <div className='flex justify-between font-semibold text-lg'>
          <span>รวมทั้งหมด</span>
          <span>{formatPrice(opCart.cartTotal)}</span>
        </div>

        <div className='pt-4 space-y-2'>
          <Button size='lg' className='w-full' asChild>
            <Link href='/checkout'>
              <ShoppingBag size={18}></ShoppingBag>
              <span>ชำระเงิน</span>
            </Link>
          </Button>
          <Button
            variant='outline'
            className='w-full'
            disabled={opCart.items.length === 0 || isPending}
            onClick={handleClearCart}>
            ล้างตะกร้า
          </Button>
        </div>
      </div>
    </Card>
  )
}
export default CartSummary