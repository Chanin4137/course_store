import { UserType } from '@/types/user';

export const canCreateCourse = (user: UserType) => {
    return user.role === 'Admin'
}

export const canUpdateCourse = (user: UserType) => {
    return user.role === 'Admin'
}