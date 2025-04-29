//Define Constant

import { z } from 'zod';

const MIN_ADDRESS_LENGTH = 10;
const MAX_ADDRESS_LENGTH = 255;
const PHONE_LENGTH = 10;
const PHONE_REGEX = /^((02|06|08)[0-9]{8})$/

//Define Error Messages
const ERROR_MESSAGES = {
    address: {
        min: `ที่อยู่ต้องมีความยาวอย่างน้อย ${MIN_ADDRESS_LENGTH} ตัวอักษร`,
        max: `ที่อยู่ต้องมีความยาวไม่เกิน ${MAX_ADDRESS_LENGTH} ตัวอักษร`,
    },
    phone: {
        length: `เบอร์โทรศัพท์ต้องมี ${PHONE_LENGTH} หลัก`,
        regex: `เบอร์โทรศัพท์ไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง`,
    }
}

//Order Schema

export const checkoutSchema = z.object({
    address: z
        .string()
        .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGES.address.min })
        .max(MAX_ADDRESS_LENGTH, { message: ERROR_MESSAGES.address.max }),
    phone: z
        .string()
        .min(PHONE_LENGTH, { message: ERROR_MESSAGES.phone.length })
        .max(PHONE_LENGTH, { message: ERROR_MESSAGES.phone.length })
        .regex(PHONE_REGEX, { message: ERROR_MESSAGES.phone.regex }),

    note: z.string().optional(),
})