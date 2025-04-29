
import AuthForm from '@/features/auths/components/auth-form'
import AuthHeader from "@/features/auths/components/auth-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'สมัครสมาชิก',
    description: 'Best Course Store'
}

const SingupPage = () => {

    const type = 'signup'

    return (<AuthHeader type={type}>
        <AuthForm type={type}>
        </AuthForm>
    </AuthHeader>
    )
}

export default SingupPage