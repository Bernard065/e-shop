'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ReactQueryProvider } from '../components/ReactQueryProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default ClientProviders;
