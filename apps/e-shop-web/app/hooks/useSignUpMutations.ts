import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface UseSignUpMutationsProps {
  userData: FormData | null;
  otp: string;
  setServerError: (error: string | null) => void;
  setTimer: (timer: number) => void;
  setCanResend: (canResend: boolean) => void;
  setUserData: (data: FormData | null) => void;
  setShowOtp: (show: boolean) => void;
  startResendTimer: () => void;
  router: ReturnType<typeof useRouter>;
}

export const useSignUpMutations = ({
  userData,
  otp,
  setServerError,
  setTimer,
  setCanResend,
  setUserData,
  setShowOtp,
  startResendTimer,
  router,
}: UseSignUpMutationsProps) => {
  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user-registration`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setServerError(null);
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-user`,
        {
          ...userData,
          otp,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
    onError: () => {
      setServerError('OTP verification failed. Please try again.');
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user-registration`,
        {
          name: userData.name,
          email: userData.email,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      setTimer(60);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setServerError(error.response?.data?.message || 'Failed to resend OTP');
    },
  });

  return {
    signUpMutation,
    verifyOtpMutation,
    resendOtpMutation,
  };
};
