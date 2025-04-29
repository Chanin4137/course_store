'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CourseImage } from '@prisma/client'
import { ImagePlus, Plus, Star, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'


interface CourseImageUploadProps {
    onImagesChange: (
        images: File[],
        mainIndex: number,
        deleteIds?: string[])
        => void
    existingImages?: CourseImage[]
}

const CourseImageUpload = ({ onImagesChange, existingImages = [] }: CourseImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [selectedFile, setSelectedFiles] = useState<File[]>([])
    const [mainImageIndex, setMainImageIndex] = useState(0)

    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

    const [existingImagesState, setExistingImagesState] = useState(existingImages)

    const [initialMainImageSet, setInitialMainImageSet] = useState(false)

    const notifyToParent = useCallback(() => {
        onImagesChange(selectedFile, mainImageIndex, deletedImageIds)
    }, [selectedFile, mainImageIndex, deletedImageIds, onImagesChange])

    useEffect(() => {
        if (existingImagesState.length > 0) {
            const mainIndex = existingImagesState.findIndex((image) => image.isMain)
            if (mainIndex > 0) {
                setMainImageIndex(mainIndex)
                setInitialMainImageSet(true) // Set main image index only once
            }
        }

        // alert 
        notifyToParent()

    }, [existingImagesState, notifyToParent, mainImageIndex])


    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        //Filter only image files

        const imageFiles = files.filter(file => file.type.startsWith('image/'))
        if (imageFiles.length === 0) return

        // Create preview URLs for the selected images
        const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file))
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
        setSelectedFiles((prev) => [...prev, ...imageFiles])

        //set first image as primary image
        // if (newPreviewUrls.length > 0) {
        //     setMainImageIndex(0)
        // }
        if (existingImagesState.length === 0 && selectedFile.length === 0 && imageFiles.length > 0) {
            setMainImageIndex(0)
        }

        // Notify parent component about the new images
        // onImagesChange([...selectedFile, ...imageFiles], mainImageIndex)

        // reset image
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSetMain = (index: number, isExisting = false) => {
        const autulIndex = isExisting ? index : existingImagesState.length + index
        setMainImageIndex(autulIndex)
        // onImagesChange(selectedFile, index)
    }

    const handleRemoveImage = (index: number, isExisting = false) => {
        if (isExisting) {
            const imageToRemove = existingImagesState[index]
            // Remove the image from the existing images state
            setDeletedImageIds((prev) => [...prev, imageToRemove.id])
            // Update remove old image list
            setExistingImagesState(existingImagesState.filter((_, i) => i !== index))

            // Adhist main image
            if (mainImageIndex === index) {
                //  if main image is removed
                if (existingImagesState.length > 0) {
                    // if there are still images left, set the first one as main
                    setMainImageIndex(0)
                } else if (selectedFile.length > 0) {
                    // if there are no images left, set the first one as main
                    setMainImageIndex(0)
                } else {
                    // if there are no images left, set the main image index to -1
                    setMainImageIndex(-1)
                }
            } else if (mainImageIndex > index) {
                // if main image is after the removed image, decrease the index
                setMainImageIndex((prev) => prev - 1)
            }

            // Create new arrays without the removed image
            // const newFiles = selectedFile.filter((_, i) => i !== index)


            // const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
            // setPreviewUrls(newPreviewUrls)
            // setSelectedFiles(newFiles)





            // const setMainIndexForParent = () => {
            //     if (mainImageIndex === index) {
            //         return 0
            //     } else if (mainImageIndex > index) {
            //         return mainImageIndex - 1
            //     } else {
            //         return mainImageIndex
            //     }
            // }

            // onImagesChange(newFiles, setMainIndexForParent())
        } else {

            URL.revokeObjectURL(previewUrls[index]) // Free up memory

        }

        setPreviewUrls(previewUrls.filter((_, i) => i !== index))
        setSelectedFiles(selectedFile.filter((_, i) => i !== index))

        const actualRemovedIndex = existingImagesState.length + index
        if (mainImageIndex === actualRemovedIndex) {
            // if removed image is main image
            if (existingImagesState.length > 0) {
                //set main image to first image
                setMainImageIndex(0)
            } else if (previewUrls.length > 0) {
                setMainImageIndex(0)
            }
            else {
                setMainImageIndex(-1) // Set to -1 if no images left
            }
        } else if (mainImageIndex > actualRemovedIndex) {
            // if main image is after the removed image, decrease the index
            setMainImageIndex(mainImageIndex - 1)
        }
    }

    const isMainImage = (index: number, isExisting: boolean) => {
        const actualIndex = isExisting ? index : existingImagesState.length + index
        return mainImageIndex === actualIndex
    }

    // //Adjust main image index if the main image is removed
    // if (mainImageIndex === index) {
    //     setMainImageIndex(newPreviewUrls.length > 0 ? 0 : -1) // Set to first image or -1 if no images left)
    // } else {
    //     setMainImageIndex((prev) => prev - 1)
    // }

    return (
        <div className='flex flex-col gap-2'>
            <Label>
                Course Images <span className='text-red-500'>*</span>
            </Label>

            {/* Image Preview */}
            {(existingImagesState.length > 0 || previewUrls.length > 0) && (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4'>

                    {/* Existing Preview */}
                    {existingImagesState.map((image, index) => (
                        <div key={`existing-${index}`}
                            className={cn('relative aspect-square group border rounded-md overflow-hidden', {
                                'ring-2 ring-primary': isMainImage(index, true),
                            })}>
                            <Image
                                alt={`Product Preview ${index + 1}`}
                                src={image.url}
                                fill
                                className='object-cover'
                            ></Image>
                            {/* Image badge */}
                            {isMainImage(index, true) && (
                                <Badge className='absolute top-1 left-1'>Main</Badge>
                            )}

                            {/* Image controll */}
                            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <div className='absolute top-1 right-1 flex items-center gap-1'>
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        className='size-6 sm:size-8 rounded-full'
                                        onClick={() => handleSetMain(index, true)}>
                                        <Star size={16}
                                            className={cn({ 'fill-yellow-400 text-yellow-400': isMainImage(index, true) })}>
                                        </Star>
                                    </Button>
                                    <Button type='button'
                                        variant='destructive'
                                        className='size-6 sm:size-8 rounded-full'
                                        onClick={() => handleRemoveImage(index, true)}>
                                        <Trash2 size={16}></Trash2>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {previewUrls.map((url, index) => (
                        <div key={`new-${index}`}
                            className={cn('relative aspect-square group border rounded-md overflow-hidden', {
                                'ring-2 ring-primary': isMainImage(index, false),
                            })}>
                            <Image
                                alt={`Product Preview ${index + 1}`}
                                src={url}
                                fill
                                className='object-cover'
                            ></Image>
                            {/* Image badge */}
                            {isMainImage(index, false) && (
                                <Badge className='absolute top-1 left-1'>Main</Badge>
                            )}

                            {/* Image controll */}
                            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <div className='absolute top-1 right-1 flex items-center gap-1'>
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        className='size-6 sm:size-8 rounded-full'
                                        onClick={() => handleSetMain(index)}>
                                        <Star size={16}
                                            className={cn({ 'fill-yellow-400 text-yellow-400': isMainImage(index, false) })}>
                                        </Star>
                                    </Button>
                                    <Button type='button'
                                        variant='destructive'
                                        className='size-6 sm:size-8 rounded-full'
                                        onClick={() => handleRemoveImage(index)}>
                                        <Trash2 size={16}></Trash2>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add more image Button */}
                    <div className='aspect-square border rounded-md flex items-center justify-center coursor-pointer hover:bg-muted transition-colors'
                        onClick={triggerFileInput}>
                        <div className='flex flex-col items-center gap-1 text-muted-foreground'>
                            <Plus size={24}></Plus>
                            <span className='text-xs'>Add Image</span>
                        </div>
                    </div>
                </div>
            )
            }

            {/* no picture */}
            {
                existingImagesState.length === 0 && previewUrls.length === 0 && (
                    <div onClick={triggerFileInput}
                        className='border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors duration-200'>
                        <ImagePlus size={40} className='mb-2'></ImagePlus>
                        <p className='text-sm text-muted-foreground mb-1'>Drag & Drop Course Here</p>
                        <p className='text-xs text-muted-foreground mb-4'>or</p>
                        <Button type='button' variant='secondary' size='sm'>Borwse Files</Button>
                    </div>
                )
            }

            <input type='file' multiple accept='image/*' className='hidden' ref={fileInputRef} onChange={handleFileChange}></input>

            <p className='text-xs text-muted-foreground'>
                Upload up to 8 images in JPG, PNG or WEBP format (max 5MB each).
            </p>
        </div >
    )
}
export default CourseImageUpload