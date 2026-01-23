'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FormData, useSignUpMutations } from '../../hooks/useSignUpMutations';
import AuthLayout from '@/components/AuthLayout';
import CustomInput from '@/components/CustomInput';
import PasswordInput from '@/components/PasswordInput';
import OtpInput from '@/components/widgets/OtpInput';

const SignUp = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState<FormData | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ mode: 'onChange' });

  // Watch password to validate confirm password
  const password = watch('password');

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const { signUpMutation, verifyOtpMutation, resendOtpMutation } =
    useSignUpMutations({
      userData,
      otp,
      setServerError,
      setTimer,
      setCanResend,
      setUserData,
      setShowOtp,
      startResendTimer,
      router,
    });

  const onSubmit = (data: FormData) => signUpMutation.mutate(data);
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate();
  };
  const handleResendOtp = () => {
    setServerError(null);
    resendOtpMutation.mutate();
  };

  if (showOtp) {
    return (
      <AuthLayout
        pageTitle="Sign Up"
        breadcrumb="Sign Up"
        cardTitle="Verify Email"
        footerText="Wrong email?"
        linkText="Go back"
        linkHref="/sign-up"
        showGoogleAuth={false}
      >
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP sent to your email
            </label>
            <OtpInput value={otp} onChange={setOtp} length={6} />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className={`text-primary font-medium ${!canResend || resendOtpMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResendOtp}
              disabled={!canResend || resendOtpMutation.isPending}
            >
              {resendOtpMutation.isPending
                ? 'Resending...'
                : `Resend OTP${!canResend ? ` (${timer}s)` : ''}`}
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-60"
              disabled={verifyOtpMutation.isPending || otp.length < 6}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          {serverError && (
            <div className="text-red-500 text-sm text-center mt-2">
              {serverError}
            </div>
          )}
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      pageTitle="Sign Up"
      breadcrumb="Sign Up"
      cardTitle="Create your account"
      footerText="Already have an account?"
      linkText="Sign In"
      linkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          id="name"
          label="Name"
          autoComplete="name"
          error={errors.name}
          {...register('name', { required: 'Name is required' })}
        />
        <CustomInput
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
          {...register('email', { required: 'Email is required' })}
        />
        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password}
          registration={register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        {serverError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          disabled={!isValid || signUpMutation.isPending || isSubmitting}
        >
          {signUpMutation.isPending || isSubmitting
            ? 'Submitting...'
            : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
