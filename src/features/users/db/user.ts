import { db } from '@/lib/db'
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'
import { getUserIdTag } from './cache'

export const getUserById = async (id: string) => {
    'use cache'

    cacheLife('hours')
    cacheTag(await getUserIdTag(id))
    try {
        const user = await db.user.findUnique({
            where: { id, status: 'Active' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                address: true,
                picture: true,
                tel: true
            }
        })


        return user
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
}