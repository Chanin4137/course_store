import { UserType } from '@/types/user'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { SignoutButton, UserAvatarSmall, UserDropdownAvatar } from './user-component';

interface DesktopUserMenuProps {
    user: UserType
    itemCount: number
}

const DesktopUserMenu = ({ user, itemCount }: DesktopUserMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='size-8 rounded-full'>
                    <UserAvatarSmall user={user}></UserAvatarSmall>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' sideOffset={4} className='w-56'>
                <DropdownMenuLabel className='flex flex-col items-center gap-2'>
                    <UserDropdownAvatar user={user}></UserDropdownAvatar>
                    <span>สวัสดี, {user.name || user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuItem className='cursor-pointer' asChild>
                    <Link href='/profile'>โปรไฟล์ของฉัน</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' asChild>
                    <Link href='/cart'>
                        <span>ตะกร้าของฉัน</span>
                        <Badge className='ml-auto'>
                            {itemCount > 99 ? '99+' : itemCount}
                        </Badge>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' asChild>
                    <Link href='/my-enrolls'>ประวัติการลงทะเบียน</Link>
                </DropdownMenuItem>

                {user.role === 'Admin' && (
                    <>
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        <DropdownMenuItem className='cursor-pointer' asChild>
                            <Link href='/admin'>หลังบ้าน</Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator></DropdownMenuSeparator>
                <div>
                    <SignoutButton isMobile={false}>
                    </SignoutButton>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default DesktopUserMenu