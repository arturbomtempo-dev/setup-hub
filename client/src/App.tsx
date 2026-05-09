import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Footer />
            <Toaster richColors theme="dark" position="top-right" />
        </>
    );
}
