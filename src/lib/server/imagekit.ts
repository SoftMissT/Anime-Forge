// lib/server/imagekit.ts
import ImageKit from 'imagekit';

let imagekit: ImageKit | null = null;
let imagekitInitializationError: string | null = null;

try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
        throw new Error('As variáveis de ambiente do ImageKit (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT) não estão configuradas.');
    }

    imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
    });
    console.log('Cliente ImageKit inicializado com sucesso.');
} catch (error: any) {
    imagekitInitializationError = error.message;
    console.error('Erro ao inicializar cliente ImageKit:', imagekitInitializationError);
}

export { imagekit, imagekitInitializationError };