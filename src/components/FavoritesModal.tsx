

import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { FavoriteItem, GeneratedItem } from '../types';
import { StarIcon } from './icons/StarIcon';
import { ForgeIcon } from './icons/ForgeIcon';
import { VirtualizedList } from './ui/VirtualizedList';

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: FavoriteItem[];
    onSelect: (item: FavoriteItem) => void;
    onToggleFavorite: (item: FavoriteItem) => void;
}

const FavoriteListItem: React.FC<{ item: FavoriteItem; onSelect: (item: FavoriteItem) => void; onToggleFavorite: (item: FavoriteItem) => void; }> = ({ item, onSelect, onToggleFavorite }) => {
    const name = item.nome || item.title;
    const description = item.descricao_curta;

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors h-full">
            <button onClick={() => onSelect(item)} className="flex-grow text-left flex items-start gap-4 min-w-0 h-full">
                <div className="flex-shrink-0 mt-1">
                    <ForgeIcon className="w-5 h-5 text-indigo-400"/>
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{name}</p>
                    <p className="text-sm text-gray-400 truncate">{description}</p>
                </div>
            </button>
            <div className="flex-shrink-0 ml-4">
                <Button variant="ghost" className="!p-2" onClick={() => onToggleFavorite(item)}>
                    <StarIcon className="w-5 h-5 text-yellow-400" filled />
                </Button>
            </div>
        </div>
    );
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onSelect, onToggleFavorite }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Favoritos" variant="drawer-left">
            <div className="flex flex-col h-full">
                {favorites.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-6">
                        <StarIcon className="w-12 h-12 mb-4" />
                        <h3 className="font-semibold text-lg text-white">Nenhum Favorito</h3>
                        <p className="text-sm">Clique na estrela em um item para adicioná-lo aqui.</p>
                    </div>
                ) : (
                    <div className="p-2 flex-grow">
                         <VirtualizedList
                            items={favorites}
                            renderItem={(item) => (
                                <FavoriteListItem item={item} onSelect={onSelect} onToggleFavorite={onToggleFavorite} />
                            )}
                            itemHeight={76}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};