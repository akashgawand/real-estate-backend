const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure S3-compatible client for Cloudflare R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Upload a file to AWS R2 (S3-compatible storage)
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalFilename - Original filename
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadToR2 = async (fileBuffer, originalFilename, mimetype) => {
    try {
        // Generate unique filename
        const fileExtension = path.extname(originalFilename);
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const key = `uploads/${uniqueFilename}`;

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
        });

        await s3Client.send(command);

        // Construct public URL
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        return publicUrl;
    } catch (error) {
        console.error('R2 upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
};

/**
 * Validate image file
 * @param {object} file - Multer file object
 * @returns {boolean}
 */
const validateImage = (file) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.');
    }

    return true;
};

module.exports = {
    uploadToR2,
    validateImage,
};
