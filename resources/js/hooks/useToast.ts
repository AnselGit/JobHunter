import { useEffect, useState } from 'react';

export function useToast() {
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 2500);

        return () => clearTimeout(timer);
    }, [toast]);

    return {
        toast,
        setToast,
    };
}