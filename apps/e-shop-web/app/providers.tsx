import { ReactNode } from 'react';
import { ReactQueryProvider } from '../components/ReactQueryProvider';

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default Providers;
