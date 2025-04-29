import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export const getUserGlobalTag = () => {
    return getGlobalTag('users')
}

export const getUserIdTag = (id: string) => {
    return getIdTag('users', id)
}

export const revalidateUserCache = async (id: string) => {
    revalidateTag(getUserGlobalTag())
    revalidateTag(await getUserIdTag(id))
}