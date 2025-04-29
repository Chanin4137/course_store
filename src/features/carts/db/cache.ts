import { getUserIdTag } from '@/features/users/db/cache'
import { revalidateTag } from 'next/cache'

export const getCartTag = (userID: string) => {
    return `cart:${userID}` as const
}

export const revalidateCartCache = async (userID: string) => {
    revalidateTag(getCartTag(userID))
    revalidateTag(await getUserIdTag(userID))
}