'use client';

import React, { useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

const PasswordInput = ({
  label,
  error,
  registration,
  className = '',
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={visible ? 'text' : 'password'}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary/50 text-base pr-10 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...registration}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        >
          {visible ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41m-1.41 1.41A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.13-.995.36-1.41m1.41-1.41A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41m-1.41 1.41A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.13-.995.36-1.41"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default PasswordInput;
