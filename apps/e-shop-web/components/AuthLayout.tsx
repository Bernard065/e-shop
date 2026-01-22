import React from 'react';
import Link from 'next/link';
import GoogleButton from '@/components/google-button/GoogleButton';

interface AuthLayoutProps {
  pageTitle: string;
  breadcrumb: string;
  cardTitle: string;
  footerText: string;
  linkText: string;
  linkHref: string;
  children: React.ReactNode;
  showGoogleAuth?: boolean;
}

const AuthLayout = ({
  pageTitle,
  breadcrumb,
  cardTitle,
  footerText,
  linkText,
  linkHref,
  children,
  showGoogleAuth = true,
}: AuthLayoutProps) => {
  return (
    <div className="w-full py-10 min-h-[85vh] bg-background">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        {pageTitle}
      </h1>
      <p className="text-center text-lg font-medium py-3 text-text-secondary">
        Home . {breadcrumb}
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            {cardTitle}
          </h3>
          <p className="text-center text-gray-500 mb-4">
            {footerText}
            <Link href={linkHref} className="text-primary font-medium ml-1">
              {linkText}
            </Link>
          </p>

          {showGoogleAuth && (
            <>
              <GoogleButton />
              <div className="flex items-center my-5 text-gray-400 text-sm">
                <div className="flex-grow border-t border-gray-300" />
                <span className="px-3">or continue with Email</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>
            </>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
