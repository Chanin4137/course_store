import sharp from "sharp";
import fs from 'fs/promises';
import path from 'path';

export const uploadToImageKit = async (file: File, label: string) => {
    try {
        if (!file) {
            return {
                message: "No file provided",
            };
        }

        // Check File Size
        if (file.size > 5 * 1024 * 1024) {
            return {
                message: "File size exceeds 5MB limit",
            };
        }

        // Read File Buffer
        const buffer = await file.arrayBuffer();

        const processedImageBuffer = await sharp(Buffer.from(buffer))
            .webp({
                quality: 80,
                lossless: false,
                effort: 4,
            })
            .resize({
                width: 1200,
                height: 1200,
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();

        // Save image to local file system
        const ext = '.webp';
        const fileName = `${label}_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', label);
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, processedImageBuffer);

        return {
            url: `/uploads/${label}/${fileName}`,
            fileId: fileName,
        };
    } catch (error) {
        console.error("Error uploading image to local file system:", error);
        return {
            message: "Failed to upload image",
        };
    }
};

export const deleteFromImageKit = async (fileId: string, label: string) => {
    try {
        if (!fileId) {
            return {
                message: "No file id",
            };
        }
        const filePath = path.join(process.cwd(), 'public', 'uploads', label, fileId);
        await fs.unlink(filePath);
        
        return { message: "Deleted successfully" };
    } catch (error) {
        console.error("Error deleting image from local file system:", error);
        return {
            message: "Failed to delete image",
        };
    }
};