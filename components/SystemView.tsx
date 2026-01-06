import React, { useState, useMemo } from 'react';
import { RULEBOOK_INDEX } from '../lib/rulebookIndexData';
import { GlossaryTerm } from '../lib/glossaryData';
import { GlossaryModal } from './GlossaryModal';
import { SearchIcon, ClockIcon } from './icons';

// FIX: Reformatted the component to resolve the "not callable" error, which is often caused by subtle syntax issues or invisible characters.
export const SystemView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

    const filteredIndex = useMemo(() => {
        if (!searchTerm) return RULEBOOK_INDEX;
        return RULEBOOK_INDEX.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);
    
    const futureContent = ["Bestiário de Onis", "Guia de Itens Lendários"];

    // Updated Gamma document IDs
    const gammaEmbedId = "2fv8kofzni29vcv";
    const [iframeUrl, setIframeUrl] = useState(`https://gamma.app/embed/${gammaEmbedId}`);

    const handleIndexClick = (pageId: string | number) => {
        setIframeUrl(`https://gamma.app/embed/${gammaEmbedId}#card-${pageId}`);
    };

    return (
        <div className="flex h-full w-full gap-4 system-view-container">
            <aside className="w-80 h-full flex-shrink-0 bg-black/20 p-4 flex flex-col rounded-lg border border-gray-800">
                <div className="relative mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold font-gangofthree mb-2 text-white">Índice</h3>
                    <div className="relative">
                        <SearchIcon className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar no livro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto inner-scroll pr-2">
                    <ul className="space-y-1">
                        {filteredIndex.map(item => {
                            const isFuture = futureContent.includes(item.title);
                            const itemClasses = `w-full flex justify-between items-center px-3 py-2.5 text-left rounded-md transition-colors text-sm ${
                                isFuture 
                                ? 'text-gray-600 cursor-not-allowed opacity-50'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`;
                            
                            return (
                                <li key={item.title}>
                                    <button 
                                        onClick={() => !isFuture && handleIndexClick(item.page)}
                                        className={itemClasses}
                                        disabled={isFuture}
                                    >
                                        <span className="truncate">{item.title}</span>
                                        {isFuture ? <ClockIcon className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" /> : <span className="text-xs text-gray-500">{item.page}</span>}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 h-full overflow-hidden rounded-lg border border-gray-800">
               <iframe 
                    src={iframeUrl}
                    key={iframeUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="fullscreen" 
                    title="Livro de Regras: Crônicas do Sol">
                </iframe>
            </main>
             <GlossaryModal 
                isOpen={!!selectedTerm}
                onClose={() => setSelectedTerm(null)}
                term={selectedTerm}
            />
        </div>
    );
};
