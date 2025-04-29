"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { CoursesType } from '@/types/courses'
import { Edit, Eye, MoreVertical, Plus, RefreshCcw, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DeleteCourseModal } from './delete-course-modal'
import RestoreCourseModal from './restore-course-modal'
import CourseDetailModal from './course-detail-modal'

interface CourseListProps {
    courses: CoursesType[]
}

const CourseList = ({ courses }: CourseListProps) => {
    const [activeTab, setActiveTab] = useState('all')
    const [filterdCourses, setFilteredCourses] = useState<CoursesType[]>(courses)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<CoursesType | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    // filter courses based on the active tab
    useEffect(() => {
        let result = [...courses]

        if (activeTab === 'active') {
            result = courses.filter((p) => p.status === 'Active')
        } else if (activeTab === 'inactive') {
            result = courses.filter((p) => p.status === 'Inactive')
        } else if (activeTab === 'low-seat') {
            result = courses.filter((p) => p.seats <= p.lowSeat)
        }

        if (searchTerm) {
            result = result.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        setFilteredCourses(result)
    }, [courses, activeTab, searchTerm])

    const handleTabChange = (value: string) => {
        setActiveTab(value)

    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleDeleteClick = (course: CoursesType) => {
        // setSelectedCourse(course)
        // setIsDeleteModalOpen(true)
        setSelectedCourse(course)
        // Delay to allow dropdown to fully close before opening modal
        setTimeout(() => setIsDeleteModalOpen(true), 0)
    }

    const handleRestoreClick = (course: CoursesType) => {
        // setSelectedCourse(course)
        // setIsRestoreModalOpen(true)
        setSelectedCourse(course)
        setTimeout(() => setIsRestoreModalOpen(true), 0)
    }

    const handleViewClick = (course: CoursesType) => {
        setSelectedCourse(course)
        setTimeout(() => setIsDetailModalOpen(true), 0)
    }

    return (
        <>
            <Card>
                <CardHeader className='pb-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                        <CardTitle className='text-lg sm:text-xl'>Courses</CardTitle>
                        <Button asChild className='mb-4'>
                            <Link href='/admin/courses/new'>
                                <Plus size={16}></Plus>
                                <span >Add Courses</span>
                            </Link>
                        </Button>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className='grid grid-cols-4 mb-4'>
                            <TabsTrigger value='all'>All</TabsTrigger>
                            <TabsTrigger value='active'>Active</TabsTrigger>
                            <TabsTrigger value='inactive'>Inactive</TabsTrigger>
                            <TabsTrigger value='low-seat'>Almost full</TabsTrigger>
                        </TabsList>

                        <div className='flex flex-col sm:flex-row gap-4 justify-between items-center mb-4'>
                            <div className='flex gap-2'>
                                <Badge variant='outline' className='sm:px-3 py-1'>
                                    <span className='font-semibold text-blue-600'>{courses.length}</span>Total
                                </Badge>
                                <Badge variant='outline' className='sm:px-3 py-1'>
                                    <span className='font-semibold text-green-600'>{courses.filter((c) => c.status === 'Active').length}</span>Active
                                </Badge>
                                <Badge variant='outline' className='sm:px-3 py-1'>
                                    <span className='font-semibold text-gray-600'>{courses.filter((c) => c.status === 'Inactive').length}</span>Inactive
                                </Badge>
                                <Badge variant='outline' className='sm:px-3 py-1'>
                                    <span className='font-semibold text-amber-600'>{courses.filter((c) => c.seats <= c.lowSeat).length}</span>Almost full
                                </Badge>
                            </div>

                            <div className='relative w-full'>
                                <Search size={16} className='absolute left-2 top-2.5 text-muted-foreground'></Search>
                                <Input placeholder='Search Courses' className='pl-8' onChange={(event) => handleSearch(event)}></Input>
                            </div>
                        </div>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Seat</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className='text-right'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>


                        <TableBody>
                            {filterdCourses.length > 0 ?
                                filterdCourses.map((course, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Image
                                                alt={course.title}
                                                src={course.mainImage?.url || '/images/no-product-image.webp'}
                                                width={40}
                                                height={40}
                                                className='object-cover rounded-md'>
                                            </Image>
                                        </TableCell>
                                        <TableCell>
                                            <div className='font-meduim'>{course.title}</div>
                                            <div className='text-xs text-muted-foreground'>{course.sku || 'No SKU'}</div>
                                        </TableCell>
                                        <TableCell ><div className='text-sm'>{course.category}</div></TableCell>
                                        <TableCell>
                                            <div className='text-sm font-medium'>
                                                {course.price.toLocaleString()}
                                            </div>
                                            {course.basePrice !== course.price && (
                                                <div className='text-xs line-through text-muted-foreground'>{course.basePrice.toLocaleString()}</div>
                                            )}

                                        </TableCell>
                                        <TableCell ><div className={cn('text-sm', { 'text-amber-500 font-medium': course.seats <= course.lowSeat })}>
                                            {course.seats}
                                        </div>
                                        </TableCell>
                                        <TableCell >
                                            <Badge variant={
                                                course.status === 'Active' ? 'default' : 'destructive'
                                            }>
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon' className='size-8'>
                                                        <MoreVertical size={16}></MoreVertical>
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align='end' className='w-56'>
                                                    <DropdownMenuItem onClick={() => handleViewClick(course)}>
                                                        <Eye size={16}></Eye>
                                                        <span>View</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/courses/edit/${course.id}`}>
                                                            <Edit size={16}></Edit>
                                                            <span>Edit</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                                    {course.status === 'Active' ? (
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(course)}>
                                                            <Trash2 size={16} className='text-destructive'></Trash2>
                                                            <span className='text-destructive'>Delete</span>
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleRestoreClick(course)}>
                                                            <RefreshCcw size={15} className='text-green-600'></RefreshCcw>
                                                            <span className='text-green-600'>Restore</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className='text-center h-40'>
                                            <p className='text-muted-foreground'>No Courses Found</p>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/*  Delete modal */}
            <DeleteCourseModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                course={selectedCourse}
            />
            <RestoreCourseModal
                open={isRestoreModalOpen}
                onOpenChange={setIsRestoreModalOpen}
                course={selectedCourse}>
            </RestoreCourseModal>

            <CourseDetailModal
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                course={selectedCourse}>

            </CourseDetailModal>
        </>
    )
}
export default CourseList