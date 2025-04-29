import { UserType } from '@/types/user'
import MobileMenu from './mobile-menu'
import CartIcon from './cart-icon'
import { DesktopNavLinks } from './navlink'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DesktopUserMenu from './desktop-user-menu'
import { getCartItemCount } from '@/features/carts/db/cart'

interface NavbarProps {
  user: UserType | null
}

const Navbar = async ({ user }: NavbarProps) => {
  const itemCount = user ? await getCartItemCount(user.id) : 0
  return (
    <nav className='flex items-center gap-3'>
      {/* Mobile Screen */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user}></MobileMenu>

      {/* Desktop Screen */}
      <div className='hidden md:flex md:items-center'>
        <DesktopNavLinks></DesktopNavLinks>
        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount}></DesktopUserMenu>
        ) : (
          <Button size='sm' asChild>
            <Link href='/auth/signin'>
              เข้าสู่ระบบ
            </Link>
          </Button>
        )}

      </div>
    </nav>
  )
}
export default Navbar