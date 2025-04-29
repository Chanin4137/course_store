import { Order, OrderItem } from '@prisma/client'
import { CoursesType } from './courses'
import { UserType } from './user'

export interface OrderWithItems extends Order {
    items: (OrderItem & {
        course: CoursesType
    })[]
    customer: UserType
}