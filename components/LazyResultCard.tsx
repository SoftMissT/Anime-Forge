import React, { useState, useEffect, useRef, memo } from 'react';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { ResultCardSkeleton } from './ResultCardSkeleton';

interface LazyResultCardProps {
  item: GeneratedItem;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  isSelected: boolean;
  onDelete: (id: string) => void;
}

let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, () => void>();

const getSharedObserver = () => {
    if (sharedObserver) return sharedObserver;
    sharedObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const callback = observedElements.get(entry.target);
                    if (callback) {
                        callback();
                        sharedObserver?.unobserve(entry.target);
                        observedElements.delete(entry.target);
                    }
                }
            });
        },
        {
            rootMargin: '50px 0px',
            threshold: 0.01
        }
    );
    return sharedObserver;
};

const LazyResultCardComponent: React.FC<LazyResultCardProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        const observer = getSharedObserver();
        const handleVisible = () => setIsVisible(true);

        observedElements.set(element, handleVisible);
        observer.observe(element);

        return () => {
            if (element) {
                observedElements.delete(element);
                observer.unobserve(element);
            }
        };
    }, []);

    return (
        <div ref={cardRef} style={{ minHeight: '360px' }}>
            {isVisible ? <ResultCard {...props} /> : <ResultCardSkeleton />}
        </div>
    );
};

export const LazyResultCard = memo(
    LazyResultCardComponent,
    (prevProps, nextProps) =>
        prevProps.item.id === nextProps.item.id &&
        prevProps.isFavorite === nextProps.isFavorite &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.onSelect === nextProps.onSelect &&
        prevProps.onToggleFavorite === nextProps.onToggleFavorite &&
        prevProps.onDelete === nextProps.onDelete
);

LazyResultCard.displayName = 'LazyResultCard';