'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/formatPrice'
import { CartType } from '@/types/cart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { removeFromCartAction, updateCartItemAction } from '../actions/carts'
import { initialFormState } from '@/types/action'

interface CartItemsProps {
    cart: CartType
}

interface CartOptimistic {
    type: 'update' | 'remove'
    itemId: string
    newCount?: number
}

const CartItems = ({ cart }: CartItemsProps) => {
    const [opCart, updateOpCart] = useOptimistic(
        cart,
        (state, { type, itemId, newCount }: CartOptimistic) => {
            if (type === 'update' && newCount !== undefined) {
                // update item count
                const updatedItems = state.items.map((item) => {
                    // calcuilate new price form item count change
                    if (item.id === itemId) {
                        const newPrice = newCount * item.course.price
                        return {
                            ...item,
                            count: newCount,
                            price: newPrice,
                        }
                    }
                    return item // return sam item if not match item need to upedate
                })

                //calculate new total price
                const newTotal = updatedItems.reduce(
                    (sum, item) => sum + item.count, 0,
                )

                const newItemCount = updatedItems.reduce(
                    (sum, item) => sum + item.count, 0,
                )
                // return cart with updated items
                return {
                    ...state,
                    items: updatedItems,
                    cartTotal: newTotal,
                    itemCount: newItemCount,
                }
            }

            if (type === 'remove') {
                // remove item optimistic
                const updatedItems = state.items.filter((item) => item.id !== itemId)

                //calculate new total price
                const newTotal = updatedItems.reduce(
                    (sum, item) => sum + item.price, 0,
                )

                // calculate new item count after remove
                const newItemCount = updatedItems.reduce(
                    (sum, item) => sum + item.count, 0,
                )
                // return cart with updated items after remove

                return {
                    ...state,
                    items: updatedItems,
                    cartTotal: newTotal,
                    itemCount: newItemCount,
                }
            }

            //return state if not match any case
            return state
        },
    )

    //eslint-disable-next-line@typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition()

    //update item
    const handleUpdateQty = async (itemId: string, newCount: number) => {
        startTransition(() => {
            updateOpCart({ type: 'update', itemId, newCount })
        })
        // send update request to server
        const formData = new FormData()
        formData.append('cart-item-id', itemId)
        formData.append('count', newCount.toString())
        await updateCartItemAction(initialFormState, formData)
    }
    //update item
    const handleRemoveItem = async (itemId: string) => {
        startTransition(() => {
            updateOpCart({ type: 'remove', itemId })
        })

        // send update request to server
        const formData = new FormData()
        formData.append('cart-item-id', itemId)
        await removeFromCartAction(initialFormState, formData)
    }
    return (
        <Card className='p-4'>
            <h2 className='text-xl font-medium mb-4'>รายการในตะกร้า ({opCart.itemCount})</h2>
            <div className='space-y-4'>
                {opCart.items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
                        {/* Product Image */}
                        <div className="relative size-24 border border-primary rounded-md overflow-hidden">
                            <Link href={`/courses/${item.course.id}`}>
                                <Image
                                    alt={item.course.title}
                                    src={
                                        item.course.mainImage?.url || '/images/no-product-image.webp'}
                                    fill
                                    className='object-cover'></Image>
                            </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                                <Link href={`/courses/${item.course.id}`}
                                    className='text-lg font-medium hover:text-primary transition-colors'
                                >
                                    {item.course.title}
                                </Link>
                                <p className="font-semibold">{formatPrice(item.price)}</p>
                            </div>


                            <div className='text-sm text-muted-foreground'>
                                ประเภท: {item.course.category.name}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                ราคา: {formatPrice(item.course.price)}
                            </div>

                            {/* Quantity Controls */}
                            <div className='flex items-center justify-between mt-2'>
                                <div className='flex itemscenter'>
                                    <Button
                                        variant='outline'
                                        className='size-8'
                                        disabled={item.count <= 1}
                                        onClick={() =>
                                            handleUpdateQty(item.id, Math.max(item.count - 1))}>

                                        <Minus size={14}></Minus>
                                    </Button>
                                    <span className='w-10 text-center'>{item.count}</span>
                                    <Button
                                        variant='outline'
                                        className='size-8'
                                        disabled={item.count >= item.course.seats}
                                        onClick={() => handleUpdateQty(item.id, item.count + 1)}>
                                        <Plus size={14}></Plus>
                                    </Button>
                                </div>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='text-destructive/90 hover:text-destructive'
                                    onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 size={18}></Trash2>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default CartItems