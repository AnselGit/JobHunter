import { useEffect, useRef, useState } from 'react';

export function useScroll() {
    const [showScrollTop, setShowScrollTop] =
        useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [logoMounted, setLogoMounted] =
        useState(false);

    const trackRef =
        useRef<HTMLElement>(null);

    const aboutRef =
        useRef<HTMLElement>(null);

    const contactRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLogoMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () =>
            setShowScrollTop(
                window.scrollY > 400
            );

        window.addEventListener(
            'scroll',
            handleScroll
        );

        return () =>
            window.removeEventListener(
                'scroll',
                handleScroll
            );
    }, []);

    useEffect(() => {
        const updateProgressColor = () => {
            const hero =
                document.querySelector(
                    '.track-hero'
                );

            const y = window.scrollY;

            if (
                y <
                (hero?.clientHeight ?? 0)
            ) {
                document.documentElement.style.setProperty(
                    '--progress-color',
                    '#FFFFFF'
                );
            } else {
                document.documentElement.style.setProperty(
                    '--progress-color',
                    'var(--color-sky-400)'
                );
            }
        };

        updateProgressColor();

        window.addEventListener(
            'scroll',
            updateProgressColor
        );

        return () =>
            window.removeEventListener(
                'scroll',
                updateProgressColor
            );
    }, []);

    const smoothScrollTo = (
        targetY: number,
        duration = 650
    ) => {
        const startY = window.scrollY;
        const diff = targetY - startY;

        let startTime: number | null =
            null;

        const easeInOutCubic = (
            t: number
        ) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 -
                  Math.pow(
                      -2 * t + 2,
                      3
                  ) /
                      2;

        const step = (
            timestamp: number
        ) => {
            if (!startTime)
                startTime = timestamp;

            const elapsed =
                timestamp - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            const eased =
                easeInOutCubic(progress);

            window.scrollTo(
                0,
                startY + diff * eased
            );

            if (progress < 1) {
                requestAnimationFrame(
                    step
                );
            }
        };

        requestAnimationFrame(step);
    };

    const scrollToSection = (
        ref: React.RefObject<
            HTMLElement | HTMLDivElement | null
        >,
        offset = 80
    ) => {
        if (!ref.current) return;

        const targetY =
            ref.current.getBoundingClientRect()
                .top +
            window.scrollY -
            offset;

        smoothScrollTo(targetY, 700);
    };

    const scrollToTop = () =>
        smoothScrollTo(0);

    const goToSection = (
        ref: React.RefObject<
            HTMLElement | HTMLDivElement | null
        >,
        offset = 80
    ) => {
        scrollToSection(ref, offset);
        setMobileMenuOpen(false);
    };

    return {
        logoMounted,

        showScrollTop,

        mobileMenuOpen,
        setMobileMenuOpen,

        trackRef,
        aboutRef,
        contactRef,

        scrollToSection,
        scrollToTop,
        goToSection,
    };
}