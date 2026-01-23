'use client';

import React, { ReactNode } from 'react';
import { ReactQueryProvider } from '../components/ReactQueryProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default ClientProviders;
