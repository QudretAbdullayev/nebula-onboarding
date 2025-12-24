import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';

type AppProvidersProps = {
    children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    {children}
                </Router>
            </QueryClientProvider>
        </Suspense>
    );
};
