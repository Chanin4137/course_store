import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from '@/components/ui/sheet'
import { UserType } from '@/types/user'
import { AuthButtons, SignoutButton, UserAvatar } from './user-component'
import { MobileNavLinks } from './navlink'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'

interface MobileMenuProps {
    user: UserType | null
}

const MobileMenu = ({ user }: MobileMenuProps) => {
    return (
        <Sheet>
            <SheetTrigger className='md:hidden' asChild>
                <Button variant='ghost' size='icon'>
                    <Menu size={20}>
                    </Menu>
                </Button>
            </SheetTrigger>

            <SheetContent side='left' className='flex flex-col w-full md:max-w-sm'>
                <SheetHeader>
                    <SheetTitle className='text-primary text-xl'>
                        {user ? 'โปรไฟล์ของฉัน' : 'ยินดีต้อนรับ'}
                    </SheetTitle>
                </SheetHeader>

                <div className='flex-1 flex flex-col gap-6'>

                    {/* User Profile && Auth button */}
                    {user ? <UserAvatar user={user}></UserAvatar> : <AuthButtons></AuthButtons>}
                    <Separator></Separator>
                    {/* Nav Link */}
                    <div className='px-4'>
                        <ScrollArea className='h-48 sm:h-60 w-full'>
                            <MobileNavLinks>

                            </MobileNavLinks>
                            {/* Go to Admin page Button */}

                            {user && user.role === 'Admin' && (
                                <div className='mt-2'>
                                    <Separator className='mb-2'></Separator>
                                    <Button
                                        variant='secondary'
                                        size='lg'
                                        className='w-full'
                                        asChild>
                                        <Link href='/admin'>หลังบ้าน</Link>
                                    </Button>
                                </div>
                            )}

                        </ScrollArea>
                    </div>
                </div>
                {user && (
                    <SheetFooter>
                        <SignoutButton isMobile></SignoutButton>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
export default MobileMenu