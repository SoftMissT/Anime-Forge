// components/CosmakerInterface.tsx
import React, { useState, useCallback } from 'react';
import { useAppCore, useAuth, useUsage } from '../contexts/AppContext';
import { generateImage } from '../lib/client/orchestrationService';
import { AuthOverlay } from './AuthOverlay';
import { Button, Spinner, TextArea } from './ui';
import { DownloadIcon, ImageIcon, SparklesIcon, TrashIcon } from './icons';
import { useToast } from './ToastProvider';
import { motion } from 'framer-motion';

export const CosmakerInterface: React.FC = () => {
    const { setAppError } = useAppCore();
    const { isAuthenticated, user, handleLoginClick } = useAuth();
    const { usageCount, decrementUsage } = useUsage();
    const { showToast } = useToast();

    const [sourceImage, setSourceImage] = useState<{ file: File, preview: string, base64: string, mimeType: string } | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const processImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setSourceImage({
                file,
                preview: URL.createObjectURL(file),
                base64: base64String,
                mimeType: file.type,
            });
            setGeneratedImage(null); // Clear previous result
        };
        reader.readAsDataURL(file);
    };

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) processImageFile(file);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processImageFile(file);
    };

    const handleGenerateImage = async () => {
        if (!user || (!prompt.trim() && !sourceImage)) return;
        
        if (usageCount <= 0) {
            showToast('error', 'Você atingiu seu limite de gerações pesadas (imagem/vídeo) por hoje.');
            return;
        }

        setIsLoading(true);
        try {
            // FIX: Removed the `user` property. The API endpoint handles user authentication via session cookies.
            const result = await generateImage({
                prompt,
                sourceImage: sourceImage ? { data: sourceImage.base64, mimeType: sourceImage.mimeType } : undefined,
            });
            setGeneratedImage(`data:image/jpeg;base64,${result.image}`);
            decrementUsage();
            showToast('success', 'Imagem processada com sucesso!');
        } catch (error: any) {
            setAppError({ message: 'Falha na Geração de Imagem', details: error.message, canRetry: true, onRetry: handleGenerateImage });
        } finally {
            setIsLoading(false);
        }
    };
    
    const resultImage = generatedImage || (sourceImage ? `data:image/jpeg;base64,${sourceImage.base64}` : null);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-start gap-4 p-4">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso ao Estúdio Cosmaker" />}
            
            <div className="w-full max-w-4xl flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-[var(--border-color)]">
                <h3 className="font-semibold text-white">Edição de Imagem com IA (Nano Banana)</h3>
                <div className="text-sm text-gray-300">
                    Gerações pesadas restantes: <span className="font-bold text-lg text-[var(--accent-cosmaker-start)]">{usageCount}</span>
                </div>
            </div>

            <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleImageDrop}
                className={`relative w-full max-w-4xl flex-grow bg-black/20 rounded-lg flex items-center justify-center p-2 min-h-[300px] md:min-h-[400px] border-2 border-dashed  transition-colors ${isDragOver ? 'border-purple-500' : 'border-gray-700'}`}
            >
                {isLoading ? (
                    <div className="text-center text-gray-400">
                        <Spinner size="lg" />
                        <p className="mt-4">Editando sua imagem...</p>
                    </div>
                ) : resultImage ? (
                    <>
                        <motion.img 
                            key={resultImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={resultImage} 
                            alt="Imagem" 
                            className="w-full h-full object-contain rounded-md" 
                        />
                         <div className="absolute top-2 right-2 flex gap-2">
                             <Button variant="danger" size="sm" className="!p-2" onClick={() => { setSourceImage(null); setGeneratedImage(null); }}>
                                 <TrashIcon className="w-4 h-4" />
                             </Button>
                             <a 
                                href={resultImage} 
                                download={`kimetsu-forge-edited-${Date.now()}.jpg`}
                                className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                                aria-label="Baixar imagem"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </>
                ) : (
                    <label htmlFor="image-upload" className="text-center cursor-pointer text-gray-500 p-8">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-semibold text-white">Arraste uma imagem para editar</p>
                        <p className="text-sm">ou clique para selecionar</p>
                        <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </label>
                )}
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-4">
                <TextArea
                    label="Descreva a edição que você quer fazer:"
                    placeholder="Ex: 'adicione um filtro retro', 'remova a pessoa no fundo', 'mude o fundo para uma floresta mística'..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={2}
                    disabled={isLoading}
                />
                <Button
                    onClick={handleGenerateImage}
                    disabled={!prompt.trim() || !sourceImage || isLoading || usageCount <= 0}
                    className="btn-cosmaker w-full"
                    size="lg"
                >
                    {isLoading ? <><Spinner size="sm" /> Processando...</> : <><SparklesIcon className="w-5 h-5" /> Aplicar Edição</>}
                </Button>
            </div>
        </div>
    );
};