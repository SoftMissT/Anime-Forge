// components/FilmmakerInterface.tsx
import React, { useState, useCallback, useRef } from 'react';
import { useAppCore, useAuth, useUsage } from '../contexts/AppContext';
import { startVideoGeneration, checkVideoGenerationStatus } from '../lib/client/orchestrationService';
import { AuthOverlay } from './AuthOverlay';
import { Button, Spinner, TextArea, Select } from './ui';
import { DownloadIcon, ImageIcon, VideoIcon } from './icons';
import { useToast } from './ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
    "Aquecendo a sala de renderização...",
    "Consultando o roteiro com os astros...",
    "Sincronizando os frames quânticos...",
    "Aplicando filtros cinematográficos...",
    "Aguardando a musa do cinema se manifestar...",
    "Compilando a linha do tempo...",
    "Ajustando o balanço de cores cósmico...",
    "Polindo a trilha sonora...",
];

export const FilmmakerInterface: React.FC = () => {
    const { setLoadingState, setAppError } = useAppCore();
    const { isAuthenticated, user, handleLoginClick } = useAuth();
    const { showToast } = useToast();
    const { usageCount, decrementUsage } = useUsage();

    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<{ file: File, preview: string, base64: string, mimeType: string } | null>(null);
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processImageFile(file);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    const processImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setImage({
                file,
                preview: URL.createObjectURL(file),
                base64: base64String,
                mimeType: file.type,
            });
        };
        reader.readAsDataURL(file);
    };

    const pollOperation = useCallback(async (operation: any) => {
        if (!user) return;
        
        try {
            // FIX: Pass the user object to the API call for authentication.
            const status = await checkVideoGenerationStatus(operation, user);

            if (status.done) {
                setIsLoading(false);
                setLoadingState({ active: false });
                if (status.videoUrl) {
                    setVideoUrl(status.videoUrl);
                    showToast('success', 'Seu vídeo está pronto!');
                } else {
                    throw new Error(status.error || "A operação foi concluída, mas nenhum vídeo foi retornado.");
                }
            } else {
                pollingRef.current = setTimeout(() => pollOperation(status.operation), 10000); // Poll every 10 seconds
            }
        } catch (error: any) {
            setIsLoading(false);
            setLoadingState({ active: false });
            setAppError({ message: 'Erro ao Processar Vídeo', details: error.message, canRetry: false });
        }
    }, [user, setLoadingState, setAppError, showToast]);

    const handleGenerate = async () => {
        if (!user || !prompt.trim()) return;

        if (usageCount <= 0) {
            showToast('error', 'Você atingiu seu limite de gerações pesadas (imagem/vídeo) por hoje.');
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);
        setLoadingState({ active: true, content: 'video_generation' });

        // Cycle through loading messages
        const messageInterval = setInterval(() => {
            setLoadingMessage(prev => {
                const currentIndex = LOADING_MESSAGES.indexOf(prev);
                return LOADING_MESSAGES[(currentIndex + 1) % LOADING_MESSAGES.length];
            });
        }, 3000);

        try {
            // FIX: Pass the user object to the API call for authentication.
            const operation = await startVideoGeneration({
                prompt,
                image: image ? { data: image.base64, mimeType: image.mimeType } : undefined,
                config: { resolution, aspectRatio },
                user,
            });
            decrementUsage();
            pollOperation(operation);
        } catch (error: any) {
            setIsLoading(false);
            setLoadingState({ active: false });
            clearInterval(messageInterval);
            setAppError({ message: 'Falha na Geração do Vídeo', details: error.message, canRetry: true, onRetry: handleGenerate });
        }

        // Cleanup interval on unmount or when loading finishes
        return () => clearInterval(messageInterval);
    };
    
    // Cleanup polling on unmount
    React.useEffect(() => {
        return () => {
            if (pollingRef.current) {
                clearTimeout(pollingRef.current);
            }
        };
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-start gap-4 p-4">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso ao Estúdio Cinematográfico" />}
            
            <div className="w-full max-w-4xl flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-[var(--border-color)]">
                <h3 className="font-semibold text-white">Geração de Vídeo com IA (Veo)</h3>
                <div className="text-sm text-gray-300">
                    Gerações pesadas restantes: <span className="font-bold text-lg text-[var(--accent-start)]">{usageCount}</span>
                </div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Image Upload */}
                <div 
                    className="image-upload-dropzone h-48"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleImageDrop}
                >
                    <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    {image ? (
                        <img src={image.preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                    ) : (
                        <label htmlFor="image-upload" className="text-center cursor-pointer text-gray-400">
                            <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                            <p className="font-semibold">Arraste uma imagem de referência</p>
                            <p className="text-xs">ou clique para selecionar (opcional)</p>
                        </label>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[var(--border-color)] flex flex-col justify-around">
                    <Select label="Resolução" options={['720p', '1080p']} value={resolution} onChange={v => setResolution(v as '720p' | '1080p')} />
                    <Select label="Proporção" options={['16:9', '9:16']} value={aspectRatio} onChange={v => setAspectRatio(v as '16:9' | '9:16')} />
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-4">
                <TextArea
                    label="Descreva a cena que você quer criar:"
                    placeholder="Ex: 'um samurai correndo por um campo de flores de cerejeira, pétalas voando ao vento, estilo anime cinematográfico'..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    disabled={isLoading}
                />
                <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading || usageCount <= 0}
                    className="btn-filmmaker w-full"
                    size="lg"
                >
                    {isLoading ? <><Spinner size="sm" /> Renderizando...</> : <><VideoIcon className="w-5 h-5" /> Gerar Vídeo</>}
                </Button>
            </div>

            <div className="relative w-full max-w-4xl flex-grow bg-black/20 rounded-lg flex items-center justify-center p-2 min-h-[300px] md:min-h-[400px]">
                <AnimatePresence>
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-400"
                        >
                            <Spinner size="lg" />
                            <p className="mt-4 text-lg font-semibold text-white">{loadingMessage}</p>
                            <p className="text-xs text-gray-500 mt-2">A geração de vídeo pode levar alguns minutos. Por favor, aguarde.</p>
                        </motion.div>
                    ) : videoUrl ? (
                        <motion.div 
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full relative"
                        >
                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-md" />
                            <a 
                                href={videoUrl} 
                                download={`kimetsu-forge-video-${Date.now()}.mp4`}
                                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                                aria-label="Baixar vídeo gerado"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="text-center text-gray-500"
                        >
                            <VideoIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>Seu vídeo aparecerá aqui.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};