'use server'

import { InitialFormState } from '@/types/action'
import { signup, signin } from '@/features/auths/db/auths'
import { signout } from '@/features/auths/db/auths';

export const authAction = async (
    _prevState: InitialFormState,
    formData: FormData,
) => {
    const rawData = {
        name: (formData.get('name')?.toString() || '').trim(),
        email: (formData.get('email')?.toString() || '').trim(),
        password: (formData.get('password')?.toString() || '').trim(),
        confirmPassword: (formData.get('confirmPassword')?.toString() || '').trim(),
    };


    const result = rawData.confirmPassword ? await signup(rawData) : await signin(rawData)


    return result && result.message
        ? {
            success: false,
            message: result.message,
            errors: result.error,
        }
        : {
            success: true,
            message: rawData.confirmPassword
                ? "สมัครสมาชิกสำเร็จ"
                : "เข้าสู่ระบบสำเร็จ",
        };
};


export const signoutAction = async () => {
    const result = await signout()
    return result && result.message
        ? {
            success: false,
            message: result.message,
        }
        : {
            success: true,
            message: "ออกจากระบบสำเร็จ",
        };
}