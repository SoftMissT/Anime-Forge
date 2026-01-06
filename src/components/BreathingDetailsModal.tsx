import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BreathingStyleInfo } from '../lib/breathingDatabase';
import { BREATHING_STYLES_DETAILS, type BreathingStyleDetail, type BreathingForm } from '../lib/breathingStylesDetails';

interface BreathingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    breathingStyle: BreathingStyleInfo | null;
}

const FormCard: React.FC<{ form: BreathingForm }> = ({ form }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h4 className="font-bold text-indigo-300">{form.nome}</h4>
        <p className="text-xs text-gray-400 mb-2">Tipo: {form.tipo}</p>
        <div className="text-sm text-gray-300 space-y-1 mb-2">
            {form.niveis.map((n, i) => (
                <p key={i}>
                    {n.nivel && <span className="font-semibold text-gray-400">Nível {n.nivel}:</span>} {n.dano} | Custo: {n.custo}
                    {n.movimento && ` | Movimento: ${n.movimento}`}
                </p>
            ))}
        </div>
        <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
            <p className="font-semibold text-gray-300">Efeitos:</p>
            <ul className="list-disc list-inside pl-2">
                {form.efeitos.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
        </div>
        {form.requisito && <p className="text-xs text-amber-400 mt-2">Requisito: {form.requisito}</p>}
        {form.sinergiaMomentum && <p className="text-xs text-cyan-400 mt-2">Sinergia com Momentum: {form.sinergiaMomentum}</p>}
    </div>
);


export const BreathingDetailsModal: React.FC<BreathingDetailsModalProps> = ({ isOpen, onClose, breathingStyle }) => {
    const details: BreathingStyleDetail | undefined = BREATHING_STYLES_DETAILS.find(b => b.id === breathingStyle?.id);

    if (!isOpen || !breathingStyle || !details) return null;

    const Icon = breathingStyle.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full md:max-w-5xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className={`relative p-6 rounded-t-2xl bg-gradient-to-r ${breathingStyle.gradient} text-white shadow-lg`}>
                            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl">&times;</button>
                            <div className="flex items-center gap-4">
                                <Icon className="w-16 h-16" />
                                <div>
                                    <h2 className="text-3xl font-bold font-japanese tracking-wider">{breathingStyle.name}</h2>
                                    <p className="text-white/80">{details.conceito}</p>
                                </div>
                            </div>
                        </header>
                        
                        <main className="flex-1 p-6 overflow-y-auto inner-scroll space-y-6">
                            <div className="prose prose-sm prose-invert max-w-none">
                                {details.historia && (
                                    <>
                                        <h4>{details.historia.titulo}</h4>
                                        {details.historia.paragrafos.map((p, i) => <p key={i}>{p}</p>)}
                                    </>
                                )}
                                
                                {details.passiva && (
                                    <>
                                        <h4>Habilidade Passiva: {details.passiva.nome}</h4>
                                        <p>{details.passiva.descricao}</p>
                                        {details.passiva.acumulo && <p><strong>Acúmulo:</strong> {details.passiva.acumulo}</p>}
                                        {details.passiva.reset && <p><strong>Reset:</strong> {details.passiva.reset}</p>}
                                        {details.passiva.efeitos && (
                                            <div className="bg-black/20 p-3 rounded-md mt-2 not-prose">
                                                <ul className="list-none space-y-2">
                                                    {details.passiva.efeitos.map((effect, i) => (
                                                        <li key={i} className="text-xs">
                                                            {Object.entries(effect).map(([key, value]) => (
                                                                <React.Fragment key={key}>
                                                                    <strong className="capitalize text-gray-400">{key}:</strong> {String(value)}{' '}
                                                                </React.Fragment>
                                                            ))}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {details.passiva.laminasCaoticas && <p className="text-xs text-cyan-300 mt-2"><strong>Lâminas Caóticas:</strong> {details.passiva.laminasCaoticas}</p>}
                                    </>
                                )}

                                {details.formas && details.formas.length > 0 && (
                                    <>
                                        <h4 className="mt-6">Formas (Kata)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                            {details.formas.map((form, i) => (
                                                <FormCard key={i} form={form} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};