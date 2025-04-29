'use server'

export const checkoutAction = async (formData: FormData) => {
    const data = {
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        note: formData.get('note') as string,
        useProfileData: formData.get('use-profile-data') as string,
    }
    console.log('Checkout data:', data)

}
