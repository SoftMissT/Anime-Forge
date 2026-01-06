import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GeneratedItem, ProvenanceEntry, HunterItem, HunterWeapon } from '../types';
import { Button, Spinner } from './ui';
import { AccordionSection } from './AccordionSection';
import { useToast } from './ToastProvider';
import { buildPlainTextForItem } from '../lib/textFormatters';
import {
    StarIcon, PencilIcon, SaveIcon, CopyIcon, DownloadIcon,
    ChevronLeftIcon, ChevronRightIcon, ImageIcon, VideoIcon,
    CheckCircleIcon, XCircleIcon, MinusIcon, BookOpenIcon, TrashIcon
} from './icons';
import { getRarityStyles } from '../lib/styleUtils';
import { ImageGenerationModal } from './ImageGenerationModal';
import { useAuth } from '../contexts/AppContext';
import { updateCreation } from '../lib/client/orchestrationService';

interface DetailPanelProps {
    item: GeneratedItem | null;
    isFavorite: boolean;
    onToggleFavorite: (item: GeneratedItem) => void;
    onUpdate: (item: GeneratedItem) => void;
    onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
    onNavigateNewer: () => void;
    onNavigateOlder: () => void;
    canNavigateNewer: boolean;
    canNavigateOlder: boolean;
}

const EditableField: React.FC<{ value: string; onSave: (newValue: string) => void; as: 'textarea' | 'input' }> = ({ value, onSave, as }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(currentValue);
        setIsEditing(false);
    };

    if (isEditing) {
        const Component = as;
        return (
            <div className="relative">
                <Component
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full bg-gray-900 border border-indigo-500 rounded-md p-2 text-white text-sm resize-y"
                    rows={as === 'textarea' ? 8 : undefined}
                />
                <Button size="sm" onClick={handleSave} className="absolute bottom-2 right-2"><SaveIcon className="w-4 h-4" /> Salvar</Button>
            </div>
        );
    }

    return (
        <div className="relative group">
            <p className="whitespace-pre-wrap text-gray-300">{value}</p>
            <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 p-1 bg-gray-700 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <PencilIcon className="w-3 h-3" />
            </button>
        </div>
    );
};

export const DetailPanel: React.FC<DetailPanelProps> = ({
    item, isFavorite, onToggleFavorite, onUpdate, onGenerateVariant,
    onNavigateNewer, onNavigateOlder, canNavigateNewer, canNavigateOlder
}) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [areAllSectionsOpen, setAreAllSectionsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      setImageError(false);
    }, [item?.imageUrl]);

    if (!item) {
        return (
            <div className="detail-panel h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                <BookOpenIcon className="w-24 h-24 mx-auto mb-6 text-gray-700" />
                <h2 className="text-xl font-bold font-japanese mb-2 text-white">
                    Selecione uma Lenda
                </h2>
                <p>Clique em um item da lista para ver seus detalhes aqui.</p>
            </div>
        );
    }
    
    const handleImageUpload = async (file: File) => {
      if (!user) {
        showToast('error', 'Você precisa estar logado para enviar imagens.');
        return;
      }
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        showToast('error', 'Configuração do Cloudinary (Upload Preset) ausente.');
        return;
      }
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
       if (!cloudName) {
        showToast('error', 'Configuração do Cloudinary (Cloud Name) ausente.');
        return;
      }


      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Falha no upload para o Cloudinary.');
        
        const data = await response.json();
        const updateData = {
          imageUrl: data.secure_url,
          imagePublicId: data.public_id,
          imageBytes: data.bytes,
        };

        // FIX: Removed the `user` argument. The API endpoint handles user authentication via session cookies.
        await updateCreation(item.id, updateData);
        onUpdate({ ...item, ...updateData });

        showToast('success', 'Imagem enviada com sucesso!');

      } catch (error: any) {
        showToast('error', `Erro no upload: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    };
    
    const handleRemoveImage = async () => {
        if (!user) return;
        if (!window.confirm('Isso irá desvincular a imagem. Para deletar o arquivo, use a Ferramenta do Mestre.')) return;

        const updateData = {
          imageUrl: null,
          imagePublicId: null,
          imageBytes: null,
        };
        
        try {
            // FIX: Removed the `user` argument. The API endpoint handles user authentication via session cookies.
            await updateCreation(item.id, updateData);
            onUpdate({ ...item, ...updateData });
            showToast('info', 'Imagem desvinculada.');
        } catch (error: any) {
            showToast('error', `Erro: ${error.message}`);
        }
    };

    const handleUpdateField = (field: keyof GeneratedItem, value: any) => {
        onUpdate({ ...item, [field]: value });
    };

    const handleCopy = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        showToast('success', message);
    };

    const rarityStyles = getRarityStyles(item.raridade);
    
    const hasImage = item.imageUrl && !imageError;

    const renderProvenance = (provenance: ProvenanceEntry[]) => {
        const statusConfig = {
            success: { icon: CheckCircleIcon, color: 'text-green-400', label: 'Sucesso' },
            failed: { icon: XCircleIcon, color: 'text-red-400', label: 'Falhou' },
            skipped: { icon: MinusIcon, color: 'text-gray-500', label: 'Ignorado' },
        };

        return (
            <div className="space-y-3">
                {provenance.map((p, i) => {
                    const config = statusConfig[p.status];
                    const Icon = config.icon;
                    return (
                        <div key={i} className="flex gap-3 text-sm">
                            <div className="flex-shrink-0 mt-1">
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="font-semibold text-white truncate">{p.model}</span>
                                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${config.color} bg-white/5 whitespace-nowrap`}>
                                        {config.label}
                                    </span>
                                </div>
                                {(p.error || p.reason) && (
                                    <p className="text-xs text-gray-400 mt-1 break-words">{p.error || p.reason}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="detail-panel h-full flex flex-col bg-[var(--bg-card)]">
                {/* Header */}
                <header className="detail-panel-header flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                         <button onClick={onNavigateOlder} disabled={!canNavigateOlder} className="nav-button"><ChevronLeftIcon className="w-5 h-5"/></button>
                         <button onClick={onNavigateNewer} disabled={!canNavigateNewer} className="nav-button"><ChevronRightIcon className="w-5 h-5"/></button>
                    </div>
                    <div className="flex-grow flex justify-center items-center gap-4 min-w-0">
                       <h2 className="text-xl font-bold font-japanese text-white truncate" title={item.title || item.nome}>{item.title || item.nome}</h2>
                       <button onClick={() => onToggleFavorite(item)}>
                           <StarIcon className={`w-6 h-6 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`} filled={isFavorite} />
                       </button>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="header-action-btn" onClick={() => handleCopy(buildPlainTextForItem(item), 'Item copiado como texto!')}><CopyIcon className="w-5 h-5"/></button>
                         <button className="header-action-btn"><DownloadIcon className="w-5 h-5"/></button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="detail-panel-body flex-1 overflow-y-auto">
                    {/* Image Area */}
                    <div 
                      className="image-upload-dropzone"
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                          <Spinner />
                        ) : hasImage ? (
                          <>
                            <img src={item.imageUrl!} alt={item.nome} className="w-full h-full object-cover rounded-lg" onError={() => setImageError(true)} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} variant="danger"><TrashIcon className="w-4 h-4" /> Remover</Button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-gray-500">
                              <ImageIcon className="w-10 h-10 mx-auto mb-2"/>
                              <p className="text-sm font-semibold">Adicionar Imagem</p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          disabled={isUploading}
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                        <span className="tag-item">{item.categoria}</span>
                        {item.raridade && <span className="tag-item" style={rarityStyles}>{item.raridade}</span>}
                        {('nivel_sugerido' in item && item.nivel_sugerido) && <span className="tag-item">Nível {item.nivel_sugerido}</span>}
                    </div>

                    {/* Descrição Curta */}
                    <div className="mb-4">
                        <EditableField value={item.descricao_curta} onSave={(v) => handleUpdateField('descricao_curta', v)} as="textarea" />
                    </div>

                    {/* Descrição Detalhada */}
                    <AccordionSection title="Lore e Descrição Detalhada" forceOpen={areAllSectionsOpen} defaultOpen>
                        <EditableField value={item.descricao} onSave={(v) => handleUpdateField('descricao', v)} as="textarea" />
                    </AccordionSection>

                    {/* Mecânicas */}
                    {('dano' in item || ('kekkijutsu' in item && item.kekkijutsu)) && (
                        <AccordionSection title="Mecânicas de Jogo" forceOpen={areAllSectionsOpen} defaultOpen>
                            {'dano' in item && item.dano && <p><strong>Dano:</strong> {item.dano} {'dados' in item && item.dados ? `(${item.dados})` : ''} {'tipo_de_dano' in item && item.tipo_de_dano}</p>}
                            {'efeitos_secundarios' in item && item.efeitos_secundarios && <p><strong>Efeitos:</strong> {item.efeitos_secundarios}</p>}
                            {'kekkijutsu' in item && item.kekkijutsu && item.kekkijutsu.nome && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                    <h4 className="font-semibold text-white mb-2">Kekkijutsu: {item.kekkijutsu.nome}</h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                                        <div className="detail-stat-box">
                                            <span className="label">Tipo</span>
                                            <span className="value">{item.kekkijutsu.tipo}</span>
                                        </div>
                                        <div className="detail-stat-box">
                                            <span className="label">Custo</span>
                                            <span className="value">{item.kekkijutsu.custo_pc} PC</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{item.kekkijutsu.descricao}</p>
                                </div>
                            )}
                        </AccordionSection>
                    )}

                    {/* Detalhes do Caçador */}
                    {item.categoria === 'Caçador' && 'classe' in item && (
                        <AccordionSection title="Detalhes do Caçador" forceOpen={areAllSectionsOpen} defaultOpen>
                            <div className="space-y-3 text-gray-300">
                                <p><strong>Classe:</strong> {(item as HunterItem).classe}</p>
                                <p><strong>Respiração:</strong> {(item as HunterItem).respiracao || 'Nenhuma'}</p>
                                <p><strong>Habilidade Especial:</strong> {(item as HunterItem).habilidade_especial}</p>
                                <p><strong>Estilo de Luta:</strong> {(item as HunterItem).estilo_de_luta}</p>
                                {(item as HunterItem).equipamento?.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-white">Equipamento:</p>
                                        <ul className="list-disc list-inside pl-4 mt-1">
                                            {(item as HunterItem).equipamento.map((eq: HunterWeapon, i) => (
                                                <li key={i} className="text-sm">
                                                    {eq.nome} (Dano: {eq.dano}, {eq.tipo_de_dano}, Propriedade: {eq.propriedade})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-white">Personalidade:</p>
                                    <p className="text-sm whitespace-pre-wrap">{(item as HunterItem).personalidade}</p>
                                </div>
                                 <div>
                                    <p className="font-semibold text-white">Background:</p>
                                    <p className="text-sm whitespace-pre-wrap">{(item as HunterItem).background}</p>
                                </div>
                            </div>
                        </AccordionSection>
                    )}


                    {/* Ganchos Narrativos */}
                    <AccordionSection title="Ganchos Narrativos" forceOpen={areAllSectionsOpen} defaultOpen>
                        {Array.isArray(item.ganchos_narrativos) ? (
                            <ul className="list-disc list-inside space-y-2">
                                {item.ganchos_narrativos.map((hook, i) => <li key={i}>{hook}</li>)}
                            </ul>
                        ) : <p>{String(item.ganchos_narrativos)}</p>}
                    </AccordionSection>

                    {/* Prompt de Imagem */}
                    {item.imagePromptDescription && (
                         <AccordionSection title="Prompt de Imagem" forceOpen={areAllSectionsOpen}>
                            <div className="relative">
                                <p className="text-sm font-mono text-gray-400 bg-black/30 p-2 rounded-md pr-20">{item.imagePromptDescription}</p>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Button size="sm" variant="ghost" className="!p-1.5" onClick={() => handleCopy(item.imagePromptDescription!, 'Prompt de imagem copiado!')}><CopyIcon className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="ghost" className="!p-1.5" onClick={() => setIsImageModalOpen(true)}><ImageIcon className="w-4 h-4"/></Button>
                                </div>
                            </div>
                         </AccordionSection>
                    )}
                    
                    {/* Prompt de Vídeo */}
                    {item.videoPromptDescription && (
                         <AccordionSection title="Prompt de Vídeo (Cinemático)" forceOpen={areAllSectionsOpen}>
                            <div className="relative">
                                <p className="text-sm font-mono text-gray-400 bg-black/30 p-2 rounded-md pr-20">{item.videoPromptDescription}</p>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Button size="sm" variant="ghost" className="!p-1.5" onClick={() => handleCopy(item.videoPromptDescription!, 'Prompt de vídeo copiado!')}><CopyIcon className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="ghost" className="!p-1.5"><VideoIcon className="w-4 h-4"/></Button>
                                </div>
                            </div>
                         </AccordionSection>
                    )}

                    {/* Proveniência */}
                    {item.provenance && (
                        <AccordionSection title="Proveniência da IA">
                            <div className="bg-black/20 p-4 rounded-lg space-y-4">
                                {renderProvenance(item.provenance)}
                                {item._validation && (
                                    <div className="border-t border-gray-700 pt-3 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 font-semibold">Qualidade da Geração</span>
                                            <span className="font-bold text-lg text-white">{item._validation.score}<span className="text-sm text-gray-500">/100</span></span>
                                        </div>
                                        <p className="text-gray-500 mt-1">
                                            Gerado com sucesso após {item._validation.attempts} tentativa(s).
                                        </p>
                                        {item._validation.warnings && item._validation.warnings.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-amber-400 font-semibold">Avisos:</p>
                                                <ul className="list-disc list-inside text-amber-500 pl-4">
                                                    {item._validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </AccordionSection>
                    )}
                </div>
            </div>
            <ImageGenerationModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                item={item}
                onUpdate={onUpdate}
            />
        </>
    );
};