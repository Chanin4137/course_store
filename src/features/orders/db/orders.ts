import { authCheck } from '@/features/auths/db/auths'
import { canCreateOrder } from '../permissions/orders'
import { redirect } from 'next/navigation'
import { checkoutSchema } from '../schemas/orders'
import { db } from '@/lib/db'
import { generateOrderNumber } from '@/lib/generateOrderNumber'
import { clearCart } from '@/features/carts/db/cart'
import { getUserOrdersTag, revalidateOrderCache } from './cache'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { formatDate } from '@/lib/formatDate'

interface CheckoutInput {
    address: string
    phone: string
    note?: string
    useProfileData?: string
}

export const createOrder = async (input: CheckoutInput) => {
    const user = await authCheck()

    if (!user || !canCreateOrder(user)) {
        redirect('/auth/signin')
    }

    try {

        // check use profile data ?
        const useProfileData = input.useProfileData === 'on'

        // if use profile data is true, then have all data

        if (useProfileData && user.address && user.tel) {
            input.address = user.address
            input.phone = user.tel
        }

        // check data

        const { success, data, error } = checkoutSchema.safeParse(input)

        if (!success) {
            return {
                message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                error: error.flatten().fieldErrors
            }
        }

        // get cart data
        const cart = await db.cart.findFirst({
            where: { orderedById: user.id },
            include: {
                courses: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (!cart || cart.courses.length === 0) {
            return {
                message: "ไม่มีสินค้าในตะกร้า",
            };
        }

        //ค่าส่ง(ไม่จำเป็น)
        const shippingFee = 0

        // create order number
        const orderNumber = generateOrderNumber()

        // total price 

        const totalAmount = cart.cartTotal + shippingFee

        const newOrder = await db.$transaction(async (prisma) => {
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    totalAmount,
                    status: 'Pending',
                    address: data.address,
                    phone: data.phone,
                    note: data.note,
                    shippingFee,
                    customerId: user.id,
                }
            })

            for (const item of cart.courses) {
                //check avaliable seat
                const course = await prisma.courses.findFirst({
                    where: { id: item.coursesId },
                    include: { images: true }
                })

                if (!course || course.seats < item.count) {
                    throw new Error(`คอร์ส ${course?.title} ไม่มีที่นั่งว่าง`)
                }

                const mainImage = course.images.find((image) => image.isMain)

                // create order item
                await prisma.orderItem.create({
                    data: {
                        quantity: item.count,
                        price: course.price,
                        totalPrice: item.price,
                        courseTitle: course.title,
                        courseImage: mainImage?.url || null,
                        orderId: order.id,
                        courseId: item.coursesId,
                    }
                })

                // update course seat
                await prisma.courses.update({
                    where: { id: item.coursesId },
                    data: {
                        seats: course.seats - item.count,
                        enrolled: course.enrolled + item.count,
                    }
                })

                return order
            }
        })

        await clearCart()

        // After the operation that assigns newOrder
        if (!newOrder) {
            throw new Error("Order creation failed: newOrder is undefined.");
        }

        revalidateOrderCache(newOrder.id, user.id)

        return {
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber,
        }
    } catch (error) {
        console.error('Error creating order:', error)

        if (error instanceof Error) {
            return {
                message: error.message,
            }
        }
        return {
            message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง',
        }
    }
}

export const getUserOrders = async (userId: string) => {
    'use cache'

    if (!userId) {
        redirect('/auth/signin')
    }

    cacheLife('minutes')
    cacheTag(getUserOrdersTag(userId))

    try {
        const orders = await db.order.findMany({
            where: { customerId: userId },
            include: {
                items: {
                    include: {
                        course: {
                            include: {
                                images: true,
                                category: true,
                            }
                        }
                    }
                }
            }
        })

        const orderDetails = orders.map((order) => {
            const items = order.items.map((item) => {
                const mainImage = item.course.images.find((image) => image.isMain)

                return {
                    ...item,
                    course: {
                        ...item.course,
                        mainImage,
                        lowSeat: 5,
                        sku: item.course.id.substring(0, 8).toUpperCase(),
                    }
                }
            })
            return {
                ...order,
                items,
                createdAtFormatted: formatDate(order.createdAt),
            }
        })

        return orderDetails
    } catch (error) {
        console.error('Error getting user orders:', error)
        return []

    }
}