'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryType } from '@/types/category'
import { MoreVertical, Pencil, RefreshCcw, Search, Trash2 } from 'lucide-react'
import EditCategoryModal from '@/features/categories/components/edit-category-model'
import { useEffect, useState } from 'react'
import DeleteCategoryModal from '@/features/categories/components/delete-category-modal'
import RestoreCategoryModal from '@/features/categories/components/restore-category-modal.tsx'


interface CategoryListProps {
    categories: CategoryType[]
}

const CategoryList = ({ categories }: CategoryListProps) => {
    //Modal State
    const [isEditModal, setIsEditModal] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isRestoreModal, setIsRestoreModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
        null
    )

    const [activeTab, setActiveTab] = useState('all')
    const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>(categories)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        let result = [...categories]
        if (activeTab === 'active') {
            result = categories.filter((c) => c.status === 'Active')
        }
        else if (activeTab === 'inactive') {
            result = categories.filter((c) => c.status === 'Inactive')
        } else {
            result = categories
        }

        if (searchTerm) {
            result = result.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        setFilteredCategories(result)

    }, [categories, activeTab, searchTerm])

    const handleEditClick = (category: CategoryType) => {
        setSelectedCategory(category)
        setTimeout(() => setIsEditModal(true), 0) // allow dropdown to close
    }

    const handleDeleteClick = (category: CategoryType) => {
        setSelectedCategory(category)
        setTimeout(() => setIsDeleteModal(true), 0) // allow dropdown to close
    }

    const handleRestoreClick = (category: CategoryType) => {
        setSelectedCategory(category)
        setTimeout(() => setIsRestoreModal(true), 0) // allow dropdown to close
    }

    const handleTabActive = (value: string) => {
        setActiveTab(value)
    }

    const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }
    return (
        <>
            <Card>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-lg sm:text-xl'>Category List</CardTitle>
                    <Tabs value={activeTab} onValueChange={handleTabActive}>
                        <TabsList className='grid grid-cols-3 mb-4'>
                            <TabsTrigger value='all'>All Categories</TabsTrigger>
                            <TabsTrigger value='active'>Active</TabsTrigger>
                            <TabsTrigger value='inactive'>Inactive</TabsTrigger>
                        </TabsList>

                        <div className='relative'>
                            <Search size={16} className='absolute left-2 top-2.5 text-muted-foreground'></Search>
                            <Input placeholder='Search Course Categories...' className='pl-8' value={searchTerm} onChange={handleSearchTerm}></Input>
                        </div>
                    </Tabs>
                </CardHeader>

                <CardContent>
                    {/* Header */}
                    <div className='border rounded-md overflow-hidden'>
                        <div className='grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium'>
                            <div className='col-span-1 hidden sm:block '>No.</div>
                            <div className='col-span-6 sm:col-span-5'>Category name</div>
                            <div className='col-span-2 text-center hidden sm:block'>Products</div>
                            <div className='col-span-3 sm:col-span-2 text-center'>Status</div>
                            <div className='col-span-3 sm:col-span-2 text-right'>Actions</div>
                        </div>
                    </div>
                    <ScrollArea className='h-[350px] sm:h[420px]'>
                        {/* Data */}
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, index) =>
                                <div key={index} className='grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center hover:bg-gray-50 transition-colors duration-100 text-sm'>
                                    <div className='col-span-1 hidden sm:block'>{index + 1}</div>
                                    <div className='col-span-6 sm:col-span-5 truncate'>{category.name}</div>
                                    <div className='col-span-2 text-center hidden sm:block'>0</div>
                                    <div className='col-span-3 sm:col-span-2 text-center'>
                                        <Badge variant={category.status === 'Active' ? 'default' : 'outline'}>{category.status}</Badge>
                                    </div>
                                    <div className='col-span-3 sm:col-span-2 text-right'>
                                        {/* Mobile */}
                                        <div className='flex justify-end gap-1 md:hidden'>
                                            <Button variant='ghost' size='icon' className='size-7' onClick={() => handleEditClick(category)}>
                                                <Pencil size={15}></Pencil>
                                            </Button>
                                            {category.status === 'Active' ? (
                                                <Button variant='ghost' size='icon' className='size-7' onClick={() => handleDeleteClick(category)}>
                                                    <Trash2 size={15}></Trash2>
                                                </Button>
                                            ) : (
                                                <Button variant='ghost' size='icon' className='size-7' onClick={() => handleRestoreClick(category)}>
                                                    <RefreshCcw size={15}></RefreshCcw>
                                                </Button>
                                            )}

                                        </div>
                                        {/* Desktop */}
                                        <div className='hidden md:block'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon' className='size-8'>
                                                        <MoreVertical size={16}></MoreVertical>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleEditClick(category)}>
                                                        <Pencil size={15}></Pencil>
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                                    {category.status === 'Active' ? (
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                                                            <Trash2 size={15} className='text-destructive'></Trash2>
                                                            <span className='text-destructive'>Delete</span>
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleRestoreClick(category)}>
                                                            <RefreshCcw size={15} className='text-green-600'></RefreshCcw>
                                                            <span className='text-green-600'>Restore</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                            <div className='py-8 text-center'>No Course Categories found</div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {isEditModal && (
                <EditCategoryModal
                    open={isEditModal}
                    onOpenChange={(open) => {
                        if (!open) setSelectedCategory(null)
                        setIsEditModal(open)
                    }}
                    category={selectedCategory}
                >
                    {/* Modal contents */}
                </EditCategoryModal>
            )}
            <DeleteCategoryModal
                open={isDeleteModal}
                onOpenChange={setIsDeleteModal}
                category={selectedCategory}
            >
            </DeleteCategoryModal>

            <RestoreCategoryModal
                open={isRestoreModal}
                onOpenChange={setIsRestoreModal}
                category={selectedCategory}
            >
            </RestoreCategoryModal>
        </>
    )
}
export default CategoryList