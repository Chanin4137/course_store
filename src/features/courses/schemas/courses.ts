// Define Constatns

import { z } from 'zod';

const MIN_TITLE_LENGTH = 3;
const MIN_DESC_LENGTH = 10;


// Define Error Messages
const ERROR_MESSAGES = {
    title: `Course title must be at least ${MIN_TITLE_LENGTH} characters long`,
    description: `Course description must be at least ${MIN_DESC_LENGTH} characters long`,
    category: 'Category is required',
    basePrice: 'Base price must be a positive number',
    price: 'Sale price must be a positive number',
    seat: 'Seat must be a positive number'
}

// Define Course Schema

export const createCourseSchema = z.object({
    title: z.string().min(MIN_TITLE_LENGTH, { message: ERROR_MESSAGES.title }),
    description: z.string()
        .min(MIN_DESC_LENGTH, { message: ERROR_MESSAGES.description }),
    categoryId: z.string().min(1, { message: ERROR_MESSAGES.category }),
    cost: z.coerce.number().nonnegative().optional(),
    basePrice: z.coerce.number().positive({ message: ERROR_MESSAGES.basePrice }),
    price: z.coerce.number().positive({ message: ERROR_MESSAGES.price }),
    seat: z.coerce.number().positive({ message: ERROR_MESSAGES.seat }),
});