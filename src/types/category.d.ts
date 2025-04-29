import { Category, CourseImage } from '@prisma/client'

export interface CategoryWithCourses extends Category {
    category: CategoryType
    lowSeat: number
    sku: string
    mainImage: CourseImage | null
    mainImageUrl: number
    courseImage: CourseImage[]
}

export type CategoryType = Omit<Category, 'createdAt', 'updatedAt'>

