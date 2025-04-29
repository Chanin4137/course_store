import { Cart } from '@prisma/client'
import { CoursesType } from './courses'

export interface CartItem {
    id: string
    count: number
    price: number
    course: CoursesType
}

export interface CartType extends Cart {
    items: CartItem[]
    itemCount: number
}