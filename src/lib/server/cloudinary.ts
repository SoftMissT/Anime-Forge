// lib/server/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

let cloudinaryInitializationError: string | null = null;
let isCloudinaryInitialized = false;

try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('As variáveis de ambiente do Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) não estão configuradas.');
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
    
    isCloudinaryInitialized = true;
    console.log('Cliente Cloudinary inicializado com sucesso.');
} catch (error: any) {
    cloudinaryInitializationError = error.message;
    console.error('Erro ao inicializar cliente Cloudinary:', cloudinaryInitializationError);
}

export const getCloudinaryUploader = () => {
    if (cloudinaryInitializationError) {
        throw new Error(`Serviço de Mídia (Cloudinary) indisponível: ${cloudinaryInitializationError}`);
    }
    if (!isCloudinaryInitialized) {
        throw new Error('Cliente Cloudinary não inicializado.');
    }
    return cloudinary.uploader;
};

export { cloudinaryInitializationError, isCloudinaryInitialized };