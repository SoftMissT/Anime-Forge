// components/ClanWarsResultDisplay.tsx
import React from 'react';
import type { ClanWarsResult } from '../types';
import { AccordionSection } from './AccordionSection';
import { SwordsIcon, BookIcon, StarIcon } from './icons';
import { motion } from 'framer-motion';

interface ClanWarsResultDisplayProps {
  result: ClanWarsResult | null;
}

export const ClanWarsResultDisplay: React.FC<ClanWarsResultDisplayProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)] rounded-lg p-8">
                <SwordsIcon className="w-24 h-24 mx-auto mb-6 text-gray-700" />
                <h2 className="text-2xl font-bold font-japanese mb-2 text-white">
                  O Campo de Batalha Aguarda
                </h2>
                <p>Configure a simulação no painel à esquerda e clique em "Gerar Batalha" para testemunhar uma crônica de guerra.</p>
            </div>
        );
    }

    return (
        <motion.div 
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 overflow-y-auto inner-scroll"
        >
            <header className="text-center mb-6 border-b border-[var(--border-color)] pb-6">
                <h2 className="text-3xl font-bold font-japanese text-white">{result.titulo}</h2>
                <p className="mt-2 text-lg text-indigo-300">{result.resumo_resultado}</p>
            </header>

            <motion.div 
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
                <h3 className="text-xl font-bold font-gangofthree text-white mb-2">A Crônica da Batalha</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{result.narrativa_batalha}</p>
            </motion.div>

            <div className="space-y-4">
                <AccordionSection title="Fases da Batalha" defaultOpen>
                    <div className="space-y-4">
                        {result.fases_batalha.map((fase, index) => (
                            <div key={index} className="pl-4 border-l-2 border-gray-700">
                                <h4 className="font-semibold text-white">{fase.fase}</h4>
                                <p className="text-gray-300 text-sm">{fase.descricao}</p>
                            </div>
                        ))}
                    </div>
                </AccordionSection>

                <AccordionSection title="Momentos Chave" defaultOpen>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                        {result.momentos_chave.map((momento, index) => (
                            <li key={index}>{momento}</li>
                        ))}
                    </ul>
                </AccordionSection>

                <AccordionSection title="Consequências" defaultOpen>
                     <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-green-400">Para o Vencedor:</h4>
                            <p className="text-gray-300 text-sm">{result.consequencias.para_vencedor}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-red-400">Para o Perdedor:</h4>
                            <p className="text-gray-300 text-sm">{result.consequencias.para_perdedor}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-amber-400">Para a Região:</h4>
                            <p className="text-gray-300 text-sm">{result.consequencias.para_regiao}</p>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </motion.div>
    );
};