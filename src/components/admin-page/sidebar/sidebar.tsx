'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/provider/sidebarProvider'
import { UserType } from '@/types/user'
import { AvatarImage } from '@radix-ui/react-avatar'
import { LayoutDashboard, LogOut, X, Book, LibraryBig} from 'lucide-react'
import Link from 'next/link'
import SidebarLink from './sidebar-link'
import { usePathname } from 'next/navigation'
import { useSignout } from '@/hooks/use-signout'

interface SidebarAdminProps {
    user: UserType
}
const SidebarAdmin = ({ user }: SidebarAdminProps) => {
    const sidebarLinks = [
        {
            label: 'Dashboard',
            href: '/admin',
            icon: <LayoutDashboard size={20}></LayoutDashboard>
        },
        {
            label: 'Categories',
            href: '/admin/categories',
            icon: <LibraryBig size={20}></LibraryBig>
        },
        {
            label: 'Courses',
            href: '/admin/courses',
            icon: <Book size={20}></Book>
        },
    ]

    const { isSidebarOpen, toggleSidebar } = useSidebar()
    const pathname = usePathname()
    const { isPending, handleSignout } = useSignout()
    return (
        <div>
            {/* Mobile */}
            {isSidebarOpen && (
                <div className='fixed inset-0 bg-foreground/70 z-40 md:hidden' onClick={toggleSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={cn('fixed top-0 left-0 z-40 h-svh bg-card w-64 border-r flex flex-col transition-all duration-200',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                {/* Header */}
                <div className='flex items-center justify-between h-16 px-4 border-b'>
                    {/* Logo */}
                    <Link href='/admin' className='flex items-center gap-2'>
                        <div className='bg-primary rounded-md p-1'>
                            <div className='size-6 text-primary-foreground font-bold flex items-center justify-center'>A</div>
                        </div>
                        <span className='text-xl font-bold'>Admin</span>
                    </Link>
                    {/* Toggle sidebar */}
                    <Button variant='ghost' size='icon' className='md:hidden' onClick={toggleSidebar}>
                        <X size={20}></X>
                    </Button>
                </div>

                {/* Main Content Area */}
                <div className='flex-1 flex flex-col h-[calc(100vw)-128px] overflow-hidden'>
                    <ScrollArea className='flex-1'>
                        <div className='p-4'>
                            {/* Profile Box */}
                            <div className='flex items-center gap-3 bg-muted/50 p-3 rounded-lg mb-6'>
                                <Avatar className='size-10'>
                                    <AvatarImage src={user.picture || undefined} alt={user.name || 'User'}></AvatarImage>
                                    <AvatarFallback className='bg-primary text-primary-foreground'>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className='space-y-1.5'>
                                    <p className='text-sm font-medium leading-none'>{user.name || 'User'}</p>
                                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                                </div>
                            </div>
                            {/* Menu */}
                            <nav className='space-y-1.5'>
                                {sidebarLinks.map((link, index) => (
                                    <SidebarLink key={index}
                                        label={link.label}
                                        href={link.href}
                                        icon={link.icon}
                                        isActive={pathname === link.href}
                                        onClose={toggleSidebar}
                                    ></SidebarLink>
                                ))}

                            </nav>
                        </div>
                    </ScrollArea>
                </div>
                {/* Signout Btn */}
                <div className='border-t p-4 '>
                    <Button variant='ghost'
                        className='w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer'
                        onClick={handleSignout}
                        disabled={isPending}
                    >
                        <LogOut size={20}></LogOut>
                        <span>
                            Logout
                        </span>
                    </Button>
                </div>
            </aside>
        </div>
    )


}
export default SidebarAdmin