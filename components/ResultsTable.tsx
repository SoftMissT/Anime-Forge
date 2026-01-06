import React from 'react';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GeneratedItem } from '../types';
import { StarIcon, TrashIcon } from './icons';
import { getRarityStyles } from '../lib/styleUtils';
import { motion } from 'framer-motion';

interface ResultsTableProps {
  history: GeneratedItem[];
  favorites: GeneratedItem[];
  onSelect: (item: GeneratedItem) => void;
  onToggleFavorite: (item: GeneratedItem) => void;
  selectedItem: GeneratedItem | null;
  onDeleteItem: (id: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  history,
  favorites,
  onSelect,
  onToggleFavorite,
  selectedItem,
  onDeleteItem
}) => {
  return (
    <div className="results-table-container">
      <table className="results-table w-full" style={{ minWidth: 720 }}>
        <thead className="table-header">
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Raridade</th>
            <th>Nível</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
            {history.map((item, index) => {
              const isFavorite = favorites.some(fav => fav.id === item.id);
              const isSelected = selectedItem?.id === item.id;
              const rarityStyles = getRarityStyles(item.raridade);

              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.02 } }}
                  className={`table-row ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(item)}
                >
                  <td className="font-semibold text-white">{(item.title || item.nome)}</td>
                  <td className="text-sm text-gray-400">{item.categoria}</td>
                  <td>
                    {item.raridade && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={rarityStyles}
                      >
                        {item.raridade}
                      </span>
                    )}
                  </td>
                  <td className="text-sm font-mono text-gray-400">{item.nivel_sugerido}</td>
                  <td className="actions-cell">
                    <button
                      className={`action-btn ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }}
                      title="Favoritar"
                    >
                      <StarIcon className="w-5 h-5" filled={isFavorite} />
                    </button>
                    <button
                      className="action-btn text-gray-500 hover:text-red-500"
                      onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                      title="Deletar"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};