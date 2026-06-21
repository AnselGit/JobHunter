import { useEffect, useState } from 'react';

/**
 * Tracks window.scrollY. Used to move the 3D world so it stays aligned
 * with the page as the user scrolls, while the <canvas> itself stays
 * fixed at viewport size (cheap to render, regardless of page length).
 */
export function useScrollY() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrollY;
}
