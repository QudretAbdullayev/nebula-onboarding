import { QueryClient } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
    queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60,
    },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
