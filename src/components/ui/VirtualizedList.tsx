import React, { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react';

interface VirtualizedListProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
}

function VirtualizedListComponent<T extends { id: string | number }>({
  items,
  renderItem,
  itemHeight,
  overscan = 2,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRAF = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (scrollRAF.current) {
        cancelAnimationFrame(scrollRAF.current);
    }
    scrollRAF.current = requestAnimationFrame(() => {
        setScrollTop(target.scrollTop);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRAF.current) {
        cancelAnimationFrame(scrollRAF.current);
      }
    };
  }, []);

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const visibleNodeCount = Math.ceil(containerHeight / itemHeight) || 10;
    const startNode = Math.floor(scrollTop / itemHeight);
    
    const start = Math.max(0, startNode - overscan);
    const end = Math.min(items.length - 1, startNode + visibleNodeCount + overscan);
    const offset = start * itemHeight;

    return { startIndex: start, endIndex: end, offsetY: offset };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        willChange: 'scroll-position'
      }}
      className="inner-scroll"
    >
      <div style={{
        height: totalHeight,
        position: 'relative',
        contain: 'layout style'
      }}>
        <div style={{
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform'
        }}>
          {visibleItems.map((item) => (
            <div
              key={item.id}
              style={{
                height: itemHeight,
                contain: 'layout style paint'
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const VirtualizedList = React.memo(VirtualizedListComponent) as typeof VirtualizedListComponent;