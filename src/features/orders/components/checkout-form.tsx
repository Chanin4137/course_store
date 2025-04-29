import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { UserType } from '@/types/user'
import { ShoppingBag } from 'lucide-react'
import Form from 'next/form'
import { checkoutAction } from '../action/order'


interface CheckoutFormProps {
    user: UserType
}
const CheckoutForm = ({ user }: CheckoutFormProps) => {
    const hasUserData = !!(user.address && user.tel)
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-lg'>ข้อมูลการลงทะเบียน</CardTitle>
            </CardHeader>

            <Form action={checkoutAction}>
                <CardContent className='flex flex-col gap-4'>
                    {hasUserData && (
                        <div className='flex items-center space-x-2 mb-4 border p-3 rounded-md bg-muted/50'>
                            <Switch
                                id='use-profile-data'
                                name='use-profile-data'
                                defaultChecked>
                            </Switch>
                            <Label htmlFor='use-profile-data'>
                                ใช้ข้อมูลจากโปรไฟล์
                            </Label>
                        </div>
                    )}


                    {/* Phone number */}
                    <div className='flex flex-col gap-2'>
                        <InputForm
                            label='เบอร์โทรศัพท์'
                            id='phone'
                            placeholder='เบอร์โทรศัพท์'
                            defaultValue={user.tel || ''}
                            required>
                        </InputForm>
                        {/* Error MSG */}
                    </div>

                    {/* ที่อยู่ */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='address'>
                            ที่อยู่ <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                            id='address'
                            name='address'
                            placeholder='กรุณากรอกข้อมูลที่อยู่'
                            className='min-h-24'
                            defaultValue={user.address || ''}>
                        </Textarea>
                        {/* Error MSG */}
                    </div>

                    {/* หมายเหตุเพิ่มเติม */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='note'>หมายเหตุเพิ่มเติม (ถ้ามี)</Label>
                        <Textarea
                            id='note'
                            name='note'
                            placeholder='หมายเหตุเพิ่มเติม (ถ้ามี)'
                            className='min-h-2จ'>
                        </Textarea>
                        {/* Error MSG */}
                    </div>

                    {/* Personal Image */}

                    {/* Submit button */}
                    <div className='pt-4'>
                        <SubmitBtn
                            name='ดำเนินการชำระเงิน'
                            icon={ShoppingBag}
                            className='w-full'>
                        </SubmitBtn>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}
export default CheckoutForm