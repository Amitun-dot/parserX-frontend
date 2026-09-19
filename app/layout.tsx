import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/auth-context';
import { ToastProvider } from '@/lib/context/toast-context';
import ErrorBoundary from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ParserX — AI-Powered Resume Analyzer',
  description:
    'Upload your resume and get instant AI-powered ATS scoring, skill matching, and job fit analysis.',
  openGraph: {
    title: 'ParserX — AI-Powered Resume Analyzer',
    description: 'AI-powered resume analysis, ATS optimization, and job matching.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
