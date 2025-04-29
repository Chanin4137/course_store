import { CourseImage, Courses } from '@prisma/client';
import { CategoryType } from './category';

export interface CoursesType extends Courses {
    category: CategoryType
    lowSeat: number
    sku: string
    mainImage?: CourseImage | null;
    mainImageIndex?: number;
    images: CourseImage[];
}