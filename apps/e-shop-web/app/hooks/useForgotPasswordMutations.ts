import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export type ForgotPasswordFormData = {
  email: string;
};

interface UseForgotPasswordMutationsProps {
  setServerError: (error: string | null) => void;
  setSuccess: (msg: string) => void;
  router: ReturnType<typeof useRouter>;
}

export function useForgotPasswordMutations({
  setServerError,
  setSuccess,
  router,
}: UseForgotPasswordMutationsProps) {
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-user-password`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, data) => {
      setServerError(null);
      setSuccess('Password reset code sent to your email');
      setTimeout(
        () =>
          router.push(
            `/reset-password?email=${encodeURIComponent(data.email)}`,
          ),
        2000,
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setServerError(
        error.response?.data?.message || 'Failed to send reset link',
      );
    },
  });

  return { forgotPasswordMutation };
}
