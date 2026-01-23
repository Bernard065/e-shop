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
  const loginMutation = useMutation({
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

  return {
    loginMutation,
  };
};
