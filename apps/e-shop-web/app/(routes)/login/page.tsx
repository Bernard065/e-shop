'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  useLoginMutations,
  type LoginFormData,
} from '../../hooks/useLoginMutations';
import AuthLayout from '@/components/AuthLayout';
import CustomInput from '@/components/CustomInput';
import PasswordInput from '@/components/PasswordInput';

export const dynamic = 'force-dynamic';

const Login = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({ mode: 'onChange' });

  const { loginMutation } = useLoginMutations({ setServerError, router });

  const onSubmit = (data: LoginFormData) => loginMutation.mutate(data);

  return (
    <AuthLayout
      pageTitle="Login"
      breadcrumb="Login"
      cardTitle="Login to VerityStore"
      footerText="Don't have an account?"
      linkText="Sign Up"
      linkHref="/sign-up"
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

        <PasswordInput
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password}
          registration={register('password', {
            required: 'Password is required',
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              className="form-checkbox rounded text-primary focus:ring-primary/50"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
            />
            <span className="ml-2">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          disabled={!isValid || isSubmitting || loginMutation.isPending}
        >
          {isSubmitting || loginMutation.isPending
            ? 'Signing in...'
            : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
