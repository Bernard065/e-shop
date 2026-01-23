'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children: ReactNode;
}

let queryClient: QueryClient | undefined;

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  if (!queryClient) {
    queryClient = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
