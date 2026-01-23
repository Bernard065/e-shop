'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export type LoginFormData = {
  email: string;
  password: string;
};

interface UseLoginMutationsProps {
  setServerError: (error: string | null) => void;
  router: ReturnType<typeof useRouter>;
}

export const useLoginMutations = ({
  setServerError,
  router,
}: UseLoginMutationsProps) => {
  let loginMutation;

  try {
    loginMutation = useMutation({
      mutationFn: async (data: LoginFormData) => {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login-user`,
          data,
          {
            withCredentials: true,
          },
        );
        return response.data;
      },
      onSuccess: () => {
        setServerError(null);
        router.push('/');
      },
      onError: (error: AxiosError<{ message: string }>) => {
        setServerError(
          error.response?.data?.message || 'Login failed. Please try again.',
        );
      },
    });
  } catch (error) {
    console.error('Failed to initialize login mutation:', error);
    loginMutation = {
      mutate: () => {
        throw new Error(
          'React Query context is not available. Ensure the component is wrapped with QueryClientProvider.',
        );
      },
      isPending: false,
    };
  }

  return {
    loginMutation,
  };
};
