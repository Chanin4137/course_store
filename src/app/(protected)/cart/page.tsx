import { authCheck } from '@/features/auths/db/auths'
import CartItems from '@/features/carts/components/cart-items'
import CartSummary from '@/features/carts/components/cart-summary'
import EmptyCart from '@/features/carts/components/empty-cart'
import { getUserCartWithCourses } from '@/features/carts/db/cart'

const CartPage = async () => {

    const user = await authCheck()

    const cart = user ? await getUserCartWithCourses(user.id) : null
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-6'></h1>
            {!cart || cart.items.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div className='lg:col-span-2'>
                        <CartItems cart={cart} />
                    </div>
                    <div className='lg:col-span-1'>
                        <CartSummary cart={cart}></CartSummary>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CartPage