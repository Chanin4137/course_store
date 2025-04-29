import { getGlobalTag, getIdTag } from '@/lib/dataCache'
import { revalidateTag } from 'next/cache'

export const getOrderGlobalTag = () => {
    return getGlobalTag('orders')
}

export const getOrderIdTag = (id: string) => {
    return getIdTag('orders', id)
}

export const getUserOrdersTag = (userId: string) => {
    return `user:${userId}:orders` as const
}


export const revalidateOrderCache = async (orderId: string, userId: string) => {
    revalidateTag(getOrderGlobalTag())
    revalidateTag(await getOrderIdTag(orderId))
    revalidateTag(getUserOrdersTag(userId))
}