'use client';

import React, { useState, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import CustomInput from '@/components/CustomInput';
import PasswordInput from '@/components/PasswordInput';
import OtpInput from '@/components/widgets/OtpInput';
import { useResetPasswordMutations } from '../../../hooks/useResetPasswordMutations';

export type ResetPasswordFormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    mode: 'onChange',
    defaultValues: { email, otp: '' },
  });

  const newPassword = watch('newPassword');

  const { resetPasswordMutation } = useResetPasswordMutations({
    setServerError,
    setSuccess,
    router,
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <AuthLayout
      pageTitle="Reset Password"
      breadcrumb="Reset Password"
      cardTitle="Enter Reset Code & New Password"
      footerText="Remember your password?"
      linkText="Sign In"
      linkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
          value={email}
          readOnly
          {...register('email', { required: 'Email is required' })}
        />

        <OtpInput
          value={watch('otp')}
          onChange={(value) => setValue('otp', value)}
        />

        <PasswordInput
          id="newPassword"
          label="New Password"
          autoComplete="new-password"
          error={errors.newPassword}
          registration={register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          })}
        />

        {serverError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {serverError}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center mt-2">
            {success}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          disabled={!isValid || isSubmitting || resetPasswordMutation.isPending}
        >
          {isSubmitting || resetPasswordMutation.isPending
            ? 'Resetting Password...'
            : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
