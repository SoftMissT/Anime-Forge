import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Button } from './ui/Button';
import { BREATHING_DATABASE, BreathingStyleInfo } from '../lib/breathingDatabase';
import { BreathingDetailsModal } from './BreathingDetailsModal';

export const BreathingCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<BreathingStyleInfo | null>(null);

    const slides = useMemo(() => BREATHING_DATABASE, []);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
    };

    const goToNext = useCallback(() => paginate(1), []);
    const goToPrevious = () => paginate(-1);

    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(goToNext, 5000);
            return () => clearInterval(interval);
        }
    }, [isPaused, goToNext]);
    
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };
    
    const currentSlide = slides[currentIndex];
    const Icon = currentSlide.icon;

    return (
        <>
            <div
                className="relative w-full h-[280px] sm:h-[300px] bg-gray-900 rounded-lg overflow-hidden select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`} />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        
                        <div className="relative z-10 h-full flex items-center px-6 md:px-12">
                            <div className="max-w-xl">
                                <motion.span 
                                    className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full mb-3 backdrop-blur-sm"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                                >
                                    {currentSlide.category} • {currentSlide.rarity}
                                </motion.span>

                                <motion.h2 
                                    className="font-japanese text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide drop-shadow-lg flex items-center gap-3"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
                                >
                                    <Icon className="w-7 h-7 md:w-8 md:h-8 opacity-80" />
                                    {currentSlide.name}
                                </motion.h2>

                                <motion.p 
                                    className="text-gray-300 text-sm mb-6 max-w-lg leading-relaxed"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
                                >
                                    {currentSlide.shortDesc}
                                </motion.p>
                                
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1, transition: { delay: 0.6 } }}
                                >
                                    <Button onClick={() => setSelectedStyle(currentSlide)}>
                                        Ver Detalhes
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full transition-all">
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full transition-all">
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? `bg-white w-6` : 'bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            <BreathingDetailsModal 
                isOpen={!!selectedStyle} 
                onClose={() => setSelectedStyle(null)} 
                breathingStyle={selectedStyle} 
            />
        </>
    );
};