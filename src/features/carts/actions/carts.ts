'use server'

import { InitialFormState } from '@/types/action'
import { addToCart, clearCart, removeFromCart, updateCartItem } from '../db/cart'

export const addToCartAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const data = {
        courseId: formData.get('courseId') as string,
        count: parseInt(formData.get('count') as string) || 1,
    }

    const result = await addToCart(data)
    if (result && result.message) {
        return {
            success: false,
            message: result.message,
        }
    }
}

export const updateCartItemAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const data = {
        cartItemId: formData.get('cart-item-id') as string,
        newCount: parseInt(formData.get('count') as string),
    }

    const result = await updateCartItem(data)

    if (result && result.message) {
        return {
            success: false,
            message: result.message,
        }
    }
}

export const removeFromCartAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const cartItemId = formData.get('cart-item-id') as string

    const result = await removeFromCart(cartItemId)

    if (result && result.message) {
        return {
            success: false,
            message: result.message,
        }
    }
}

export const clearCartAction = async () => {
    const result = await clearCart()

    return result && result.message
        ? {
            success: false,
            message: result.message,
        }
        : {
            success: true,
            message: 'เคลียร์ตะกร้าเรียบร้อยแล้ว'
        }
}