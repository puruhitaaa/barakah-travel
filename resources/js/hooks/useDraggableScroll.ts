import { useEffect, useRef } from 'react';

export function useDraggableScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            startXRef.current = e.pageX - container.offsetLeft;
            scrollLeftRef.current = container.scrollLeft;
            container.style.cursor = 'grabbing';
        };

        const handleMouseLeave = () => {
            isDraggingRef.current = false;
            container.style.cursor = 'grab';
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            container.style.cursor = 'grab';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startXRef.current) * 1;
            container.scrollLeft = scrollLeftRef.current - walk;
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mousemove', handleMouseMove);
        container.style.cursor = 'grab';
        container.style.userSelect = 'none';

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return containerRef;
}
