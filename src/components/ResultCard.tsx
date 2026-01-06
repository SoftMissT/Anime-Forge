import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GeneratedItem } from '../types';
import { StarIcon } from './icons/StarIcon';
import { CopyIcon } from './icons/CopyIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { useToast } from './ToastProvider';
import { GeminiIcon } from './icons/GeminiIcon';
import { 
    KatanaIcon, TagIcon, UsersIcon, OniIcon, SparklesIcon, WindIcon, BookIcon, 
    HistoryIcon, SunIcon, CrystalIcon, BugIcon, PotionIcon, ZapIcon, SettingsIcon, MapIcon
} from './icons';


interface ResultCardProps {
  item: GeneratedItem;
  isSelected: boolean;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onDelete?: (id: string) => void;
}

const getRarityClass = (rarity?: string) => {
  switch (rarity?.toLowerCase()) {
    case 'lendária':
      return 'rarity-legendary';
    case 'épica':
      return 'rarity-epic';
    case 'rara':
      return 'rarity-rare';
    case 'incomum':
      return 'rarity-uncommon';
    default:
      return 'rarity-common';
  }
};

const ResultCardComponent: React.FC<ResultCardProps> = ({
  item,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showToast } = useToast();
  const [isBouncing, setIsBouncing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const CATEGORY_ICONS: Record<string, React.FC<{className?: string}>> = {
    'Arma': KatanaIcon,
    'Acessório': TagIcon,
    'Caçador': UsersIcon,
    'Inimigo/Oni': OniIcon,
    'Kekkijutsu': SparklesIcon,
    'Respiração': WindIcon,
    'Missões': BookIcon,
    'NPC': UsersIcon,
    'Evento': HistoryIcon,
    'Local/Cenário': SunIcon,
    'Mitologia': CrystalIcon,
    'História Antiga': HistoryIcon,
    'Geografia': MapIcon,
    'Biologia': BugIcon,
    'Química': PotionIcon,
    'Física': ZapIcon,
    'Engenharia': SettingsIcon,
  };

  const handleSelect = useCallback(() => {
    if (isBusy) return;
    setIsBusy(true);
    onSelect(item);
    setTimeout(() => setIsBusy(false), 500); // Prevent rapid re-clicks
  }, [isBusy, onSelect, item]);

  const handleCopyPrompt = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.imagePromptDescription) {
      navigator.clipboard.writeText(item.imagePromptDescription);
      showToast('success', 'Prompt de imagem copiado!');
    }
    setIsMenuOpen(false);
  }, [item.imagePromptDescription, showToast]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(item);
    if (!isFavorite) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 400);
    }
  }, [item, onToggleFavorite, isFavorite]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Deletar este item do histórico?')) {
      onDelete(item.id);
    }
    setIsMenuOpen(false);
  }, [item.id, onDelete]);

  const currentName = ('title' in item && item.title) || item.nome;
  const hasImage = item.imageUrl && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`result-card ${isSelected ? 'is-selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="result-card-inner">
        <div className="relative">
          {hasImage ? (
            <img
              src={item.imageUrl!}
              alt={currentName}
              className="result-card-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="result-card-placeholder">
              {(() => {
                  const Icon = CATEGORY_ICONS[item.categoria] || SparklesIcon;
                  return <Icon className="w-16 h-16 text-gray-700" />;
              })()}
            </div>
          )}
        </div>

        <div className="result-card-body">
          <h3 className="result-card-title" title={currentName}>
            {currentName}
          </h3>

          <div className="result-card-tags">
            {item.raridade && (
              <span className={`result-card-rarity ${getRarityClass(item.raridade)}`}>
                {item.raridade}
              </span>
            )}
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Nv {item.nivel_sugerido}</span>
          </div>

          <p className="result-card-description">
            {item.descricao_curta}
          </p>

          {item.provenance?.[0]?.model?.toLowerCase().includes('gemini') && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <GeminiIcon className="w-4 h-4" />
                  <span>Gerado com Gemini</span>
              </div>
          )}

          <div className="result-card-actions">
            <button
              className={`card-action-btn ${isFavorite ? 'text-yellow-400' : ''} ${isBouncing ? 'animate-favorite-bounce' : ''}`}
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <StarIcon className="w-4 h-4" filled={isFavorite} />
            </button>

            {item.imagePromptDescription && (
              <button
                className="card-action-btn"
                onClick={handleCopyPrompt}
                title="Copiar prompt de imagem"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <div className="relative ml-auto">
                <button
                  className="card-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <DotsVerticalIcon className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10"
                    >
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg"
                      >
                        🗑️ Deletar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ResultCard = React.memo(ResultCardComponent);
ResultCard.displayName = 'ResultCard';
