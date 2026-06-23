import { useEffect, useState } from 'react';

type Toast = {
    type: 'success' | 'error';
    message: string;
};

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null);

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