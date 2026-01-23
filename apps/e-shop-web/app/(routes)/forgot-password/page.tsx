'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  useForgotPasswordMutations,
  type ForgotPasswordFormData,
} from '../../hooks/useForgotPasswordMutations';
import AuthLayout from '@/components/AuthLayout';
import CustomInput from '@/components/CustomInput';

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ mode: 'onChange' });

  const { forgotPasswordMutation } = useForgotPasswordMutations({
    setServerError,
    setSuccess,
    router,
  });

  const onSubmit = (data: ForgotPasswordFormData) =>
    forgotPasswordMutation.mutate(data);

  return (
    <AuthLayout
      pageTitle="Forgot Password"
      breadcrumb="Forgot Password"
      cardTitle="Reset Your Password"
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
          {...register('email', { required: 'Email is required' })}
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
          disabled={
            !isValid || isSubmitting || forgotPasswordMutation.isPending
          }
        >
          {isSubmitting || forgotPasswordMutation.isPending
            ? 'Sending OTP...'
            : 'Send OTP'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
