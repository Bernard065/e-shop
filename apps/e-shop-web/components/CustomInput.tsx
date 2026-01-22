import React from 'react';
import { FieldError } from 'react-hook-form';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError | string;
  className?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary/50 text-base ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">
            {typeof error === 'string' ? error : error.message}
          </p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
