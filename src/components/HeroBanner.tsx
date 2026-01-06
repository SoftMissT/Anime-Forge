import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Button } from './ui/Button';
import { BREATHING_DATABASE, BreathingStyleInfo } from '../lib/breathingDatabase';
import { BreathingDetailsModal } from './BreathingDetailsModal';

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    })
};

const CarouselControls = memo<{ onPrevious: () => void; onNext: () => void; }>(({ onPrevious, onNext }) => (
    <>
        <button onClick={(e) => { e.stopPropagation(); onPrevious(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full transition-all opacity-0 group-hover:opacity-100" aria-label="Slide anterior">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full transition-all opacity-0 group-hover:opacity-100" aria-label="Próximo slide">
            <ChevronRightIcon className="w-6 h-6 text-white" />
        </button>
    </>
));
CarouselControls.displayName = 'CarouselControls';

const PageIndicators = memo<{ total: number; current: number; onSelect: (index: number) => void; isPaused: boolean; }>(({ total, current, onSelect, isPaused }) => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {Array.from({ length: total }).map((_, index) => (
            <button
                key={index}
                onClick={(e) => { e.stopPropagation(); onSelect(index); }}
                className={`h-2 rounded-full transition-all duration-300 ${index === current ? `bg-white w-8` : 'bg-white/40 hover:bg-white/60 w-2'}`}
                aria-label={`Ir para slide ${index + 1}`}
            >
                {index === current && !isPaused && (
                    <motion.div
                        key={current} 
                        className="h-full bg-white/50 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                    />
                )}
            </button>
        ))}
    </div>
));
PageIndicators.displayName = 'PageIndicators';

const SlideContent = memo<{ slide: BreathingStyleInfo; onDetailsClick: () => void }>(({ slide, onDetailsClick }) => {
    const Icon = slide.icon;
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [slide.imageUrl]);

    const showImage = !!slide.imageUrl && !imageError;

    return (
        <>
            {showImage ? (
                <motion.img
                    key={slide.id + '-img'}
                    src={slide.imageUrl}
                    alt={slide.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center text-gray-500">
                        <Icon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    </div>
                </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-40 mix-blend-hard-light`} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            <div className="relative z-10 h-full flex items-center px-6 md:px-12">
                <div className="max-w-xl">
                    <motion.span 
                        className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full mb-3 backdrop-blur-sm"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                    >
                        {slide.category} • {slide.rarity}
                    </motion.span>

                    <motion.h2 
                        className="font-japanese text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide drop-shadow-lg flex items-center gap-3"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
                    >
                        {slide.name}
                    </motion.h2>

                    <motion.p 
                        className="text-gray-200 text-base mb-6 max-w-lg leading-relaxed drop-shadow-sm"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
                    >
                        {slide.shortDesc}
                    </motion.p>
                    
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.6 } }}
                        className="inline-block"
                    >
                        <Button onClick={(e) => { e.stopPropagation(); onDetailsClick(); }}>
                            Ver Detalhes
                        </Button>
                    </motion.div>
                </div>
            </div>
        </>
    );
});
SlideContent.displayName = 'SlideContent';

const HeroBannerComponent: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<BreathingStyleInfo | null>(null);

    const slides = useMemo(() => BREATHING_DATABASE, []);
    const currentSlide = useMemo(() => slides[currentIndex], [slides, currentIndex]);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
    }, [slides.length]);

    const goToNext = useCallback(() => paginate(1), [paginate]);
    const goToPrevious = useCallback(() => paginate(-1), [paginate]);

    const selectSlide = useCallback((index: number) => {
        const newDirection = index > currentIndex ? 1 : -1;
        setDirection(newDirection);
        setCurrentIndex(index);
    }, [currentIndex]);
    
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [isPaused, goToNext]);

    useEffect(() => {
        if (slides.length < 2) return;

        // Preload next and previous images to make carousel navigation smoother
        const nextIndex = (currentIndex + 1) % slides.length;
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        
        const urlsToPreload = [
            slides[nextIndex]?.imageUrl,
            slides[prevIndex]?.imageUrl,
        ].filter(Boolean); // Filter out empty/null URLs

        const preloadLinks: HTMLLinkElement[] = [];

        urlsToPreload.forEach(url => {
            // Check if a link for this URL already exists to avoid duplicates
            if (!document.querySelector(`link[rel="preload"][href="${url}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                document.head.appendChild(link);
                preloadLinks.push(link);
            }
        });

        // Cleanup function to remove the preload links when the component unmounts or the index changes
        return () => {
            preloadLinks.forEach(link => document.head.removeChild(link));
        };
    }, [currentIndex, slides]);

    return (
        <>
            <div
                className="relative w-full h-[280px] sm:h-[300px] bg-gray-900 rounded-lg overflow-hidden select-none cursor-pointer group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => setSelectedStyle(currentSlide)}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                    >
                        <SlideContent
                            slide={currentSlide}
                            onDetailsClick={() => setSelectedStyle(currentSlide)}
                        />
                    </motion.div>
                </AnimatePresence>
                
                <CarouselControls onPrevious={goToPrevious} onNext={goToNext} />
                <PageIndicators total={slides.length} current={currentIndex} onSelect={selectSlide} isPaused={isPaused} />
            </div>

            <BreathingDetailsModal 
                isOpen={!!selectedStyle} 
                onClose={() => setSelectedStyle(null)} 
                breathingStyle={selectedStyle} 
            />
        </>
    );
};

export const HeroBanner = memo(HeroBannerComponent);
HeroBanner.displayName = 'HeroBanner';