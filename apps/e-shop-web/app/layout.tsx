import './global.css';
import type { Metadata } from 'next';
import Header from '@/components/shared/widgets/Header';
import { Roboto, Poppins } from '@next/font/google';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'VerityStore - Your Premier Online Store',
  description:
    'Discover a wide range of quality products at VerityStore. Shop electronics, fashion, home goods, and more with fast shipping and great prices.',
  keywords: [
    'e-shop',
    'online store',
    'shopping',
    'electronics',
    'fashion',
    'home goods',
    'fast shipping',
  ],
  openGraph: {
    title: 'VerityStore - Your Premier Online Store',
    description:
      'Discover a wide range of quality products at VerityStore. Shop electronics, fashion, home goods, and more.',
    url: 'https://veritystore.com',
    siteName: 'VerityStore',
    images: [
      {
        url: 'https://veritystore.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VerityStore - Online Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VerityStore - Your Premier Online Store',
    description:
      'Discover a wide range of quality products at VerityStore. Shop electronics, fashion, home goods, and more.',
    images: ['https://veritystore.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-Roboto',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-Poppins',
  weight: ['100', '200', '300', '400', '500', '700', '900'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${poppins.variable} bg-gradient-to-br from-gray-50 via-blue-50 to-white min-h-screen`}
      >
        <Header />
        <Providers>
          <div className="font-Poppins">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
