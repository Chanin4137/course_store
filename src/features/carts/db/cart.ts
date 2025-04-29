import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { redirect } from 'next/navigation'
import { getCartTag, revalidateCartCache } from './cache'
import { db } from '@/lib/db'
import { authCheck } from '@/features/auths/db/auths'
import { canUpdateUserCart } from '../permissions/carts'

interface AddtoCartInput {
    courseId: string
    count: number
}

interface UpdateCartInput {
    cartItemId: string
    newCount: number
}

// cart user 
export const getUserCartWithCourses = async (userID: string | null) => {
    'use cache'

    if (!userID) {
        redirect('auth/signin')
    }

    cacheLife('hours')
    cacheTag(getCartTag(userID))
    try {
        const cart = await db.cart.findFirst({
            where: {
                orderedById: userID,
            },
            include: {
                courses: {
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

        if (!cart) return null

        const cartWithDetails = {
            ...cart,
            items: cart.courses.map((item) => {
                const mainImage = item.course.images.find((image) => image.isMain)

                return {
                    id: item.id,
                    count: item.count,
                    price: item.price,
                    course: {
                        ...item.course,
                        mainImage: mainImage || null,
                        lowSeat: 5,
                        sku: item.course.id.substring(0, 8).toUpperCase(),
                    }
                }
            }),
            itemCount: cart.courses.reduce((sum, item) => sum + item.count, 0),
        }

        return cartWithDetails

    } catch (error) {
        console.error('Error fetching user cart:', error)
        return null

    }
}

// number of items in cart
export const getCartItemCount = async (userID: string | null) => {
    'use cache'

    if (!userID) {
        return 0
    }

    cacheLife('hours')
    cacheTag(getCartTag(userID))

    try {
        const cart = await db.cart.findFirst({
            where: {
                orderedById: userID,
            },
            include: {
                courses: true,
            }
        })

        if (!cart) return 0

        return cart.courses.reduce((sum, item) => sum + item.count, 0)
    } catch (error) {
        console.error('Error fetching cart item count:', error)
        return 0
    }
}

// cal total price of cart

const recalculateCarttotal = async (cartId: string) => {
    const cartItems = await db.cartItem.findMany({
        where: { cartId },
    })

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0)

    await db.cart.update({
        where: { id: cartId },
        data: { cartTotal },
    })
}

// add course to cart

export const addToCart = async (input: AddtoCartInput) => {
    const user = await authCheck()
    if (!user || !canUpdateUserCart(user)) {
        redirect('/auth/signin')
    }

    try {
        // fetch course data
        const course = await db.courses.findUnique({
            where: {
                id: input.courseId,
                status: 'Active',
            }
        })

        if (!course) {
            return {
                message: 'ไม่พบคอร์สนี้ในระบบ'
            }
        }

        if (course.seats < input.count) {
            return {
                message: 'คอร์สนี้มีที่นั่งไม่เพียงพอ'
            }
        }

        let cart = await db.cart.findFirst({
            where: {
                orderedById: user.id,
            }
        })

        // if cart not found, create a new cart
        if (!cart) {
            cart = await db.cart.create({
                data: {
                    cartTotal: 0,
                    orderedById: user.id,
                }
            })
        }

        // check if course already exists in cart
        const existingCourse = await db.cartItem.findFirst({
            where: {
                cartId: cart.id,
                coursesId: course.id,
            }
        })

        // if course already exists, update the count
        if (existingCourse) {
            await db.cartItem.update({
                where: {
                    id: existingCourse.id,
                },
                data: {
                    count: existingCourse.count + input.count,
                    price: (existingCourse.count + input.count) * course.price,
                }
            })
        } else {
            // if course does not exist, create a new course on cart
            await db.cartItem.create({
                data: {
                    count: input.count,
                    price: course.price * input.count,
                    cartId: cart.id,
                    coursesId: course.id,
                }
            })
        }

        // cal total price of cart
        await recalculateCarttotal(cart.id)

        //update cache
        revalidateCartCache(user.id)
    } catch (error) {
        console.error('Error adding course to cart:', error)
        return {
            message: 'เกิดข้อผิดพลาดในการเพิ่มคอร์สลงในตะกร้า'
        }
    }
}

// update course in cart
export const updateCartItem = async (input: UpdateCartInput) => {
    const user = await authCheck()
    if (!user || !canUpdateUserCart(user)) {
        redirect('/auth/signin')
    }

    try {
        if (input.newCount < 1) {
            return {
                message: 'จำนวนต้องมีอย่างน้อย 1'
            }
        }

        // fetch course data in cart
        const cartItem = await db.cartItem.findUnique({
            where: {
                id: input.cartItemId
            },
            include: {
                course: true,
                cart: true,
            },
        })

        // check if course exists in cart
        if (!cartItem || cartItem.cart.orderedById !== user.id) {
            return {
                message: 'ไม่พบคอร์สในตะกร้า'
            }
        }

        if (cartItem.course.seats < input.newCount) {
            return {
                message: 'คอร์สนี้มีที่นั่งไม่เพียงพอ'
            }
        }

        // update course count in cart
        await db.cartItem.update({
            where: { id: input.cartItemId },
            data: {
                count: input.newCount,
                price: cartItem.course.price * input.newCount,
            }

        })

        // recalculate cart total price
        await recalculateCarttotal(cartItem.cartId)

        //update cache

        revalidateCartCache(user.id)

    } catch (error) {
        console.error('Error updating cart item:', error)
        return {
            message: 'เกิดข้อผิดพลาดในการอัพเดตคอร์สในตะกร้า'
        }
    }
}

// remove course from cart
export const removeFromCart = async (cartItemId: string) => {
    const user = await authCheck()
    if (!user || !canUpdateUserCart(user)) {
        redirect('/auth/signin')
    }

    try {
        // get cart
        const cartItem = await db.cartItem.findUnique({
            where: {
                id: cartItemId
            },
            include: {
                cart: true,
            }
        })

        //check course exists in cart

        if (!cartItem || cartItem.cart.orderedById !== user.id) {
            return {
                message: 'ไม่พบคอร์สในตะกร้า'
            }
        }

        await db.cartItem.delete({
            where: {
                id: cartItemId
            }
        })

        // recalculate cart total price
        await recalculateCarttotal(cartItem.cartId)

        //update cache

        revalidateCartCache(user.id)
    } catch (error) {
        console.error('Error removing course from cart:', error)
        return {
            message: 'เกิดข้อผิดพลาดในการลบคอร์สจากตะกร้า'
        }
    }
}

// clear cart
export const clearCart = async () => {
    const user = await authCheck()
    if (!user || !canUpdateUserCart(user)) {
        redirect('/auth/signin')
    }
    try {
        // find user cart
        const cart = await db.cart.findFirst({
            where: {
                orderedById: user.id,
            }
        })

        if (!cart) {
            return {
                message: 'ตะกร้าของคุณว่างเปล่า'
            }
        }

        // delete all items in cart
        await db.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        await db.cart.update({
            where: { id: cart.id },
            data: { cartTotal: 0 },
        })

    } catch (error) {
        console.error('Error clearing cart:', error)
        return {
            message: 'เกิดข้อผิดพลาดในการลบคอร์สจากตะกร้า'
        }
    }
}