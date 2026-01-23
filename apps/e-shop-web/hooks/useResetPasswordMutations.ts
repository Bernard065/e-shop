import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export type ResetPasswordFormData = {
  email: string;
  otp: string;
  newPassword: string;
};

interface UseResetPasswordMutationsProps {
  setServerError: (error: string | null) => void;
  setSuccess: (msg: string) => void;
  router: ReturnType<typeof useRouter>;
}

export function useResetPasswordMutations({
  setServerError,
  setSuccess,
  router,
}: UseResetPasswordMutationsProps) {
  let resetPasswordMutation;

  try {
    resetPasswordMutation = useMutation({
      mutationFn: async (data: ResetPasswordFormData) => {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-user-password`,
          data,
        );
        return response.data;
      },
      onSuccess: () => {
        setServerError(null);
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        setServerError(
          error.response?.data?.message || 'Failed to reset password',
        );
      },
    });
  } catch (error) {
    console.error('Failed to initialize reset password mutation:', error);
    resetPasswordMutation = {
      mutate: () => {
        throw new Error(
          'React Query context is not available. Ensure the component is wrapped with QueryClientProvider.',
        );
      },
      isPending: false,
    };
  }

  return { resetPasswordMutation };
}
