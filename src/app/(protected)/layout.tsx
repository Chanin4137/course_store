import HeaderCustomer from '@/components/customer-page/headers/header'
import { authCheck } from '@/features/auths/db/auths'
import { redirect } from 'next/navigation'


interface ProtectedLayoutProps {
    children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {

    const user = await authCheck()
    if (!user || user.status !== 'Active') {
        redirect('/auth/login')
    }
    return (
        <div className='min-h-svh flex flex-col'>
            <HeaderCustomer user={user} />
            <main className='pt-16'>{children}</main>
            {/* <main className='pt-16 max-w-7xl mx-auto px-4 xl:px-0'>{children}</main> */}
        </div>
    )
}
export default ProtectedLayout