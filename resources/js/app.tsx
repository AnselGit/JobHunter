import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // Looks inside resources/js/pages, matches both .tsx and .jsx files,
        // and supports nested folders (e.g. "job-applications/index").
        // The generic here tells TS what each matched module looks like,
        // which is what Inertia's resolver type expects.
        const pages = import.meta.glob<{ default: ComponentType }>(
            ['./pages/**/*.tsx', './pages/**/*.jsx'],
            { eager: true },
        );
        return pages[`./pages/${name}.tsx`] ?? pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});