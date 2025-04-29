import { User } from '@prisma/client'

export type UserType = Omit<User, 'pictureId' | 'password' | 'createdAt' | 'updatedAt'>