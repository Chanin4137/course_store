import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const EmptyCart = () => {
    return (
        <div className='flex flex-col items-center justify-center py-12 px-4 border border-primary rounded-md'>
            <div className='bg-muted p-6 rounded-full mb-6'>
                <ShoppingBag size={64}></ShoppingBag>
            </div>
            <h2 className='text-xl font-semibold mb-2'>ตะกร้าของคุณว่างเปล่า</h2>
            <p className='text-muted-foreground text-center max-w-md mb-6'>
                ดูเหมือนว่าคุณยังไม่มีคอร์สในตะกร้า
                เลือกและเพิ่มคอร์สลงในตะกร้าของคุณได้เลย!
            </p>
            <Button asChild>
                <Link href='/courses'>
                    ค้นหา คอร์สเรียน
                </Link>
            </Button>
        </div>
    )
}
export default EmptyCart