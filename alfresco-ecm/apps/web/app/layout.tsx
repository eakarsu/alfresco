import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import { ToastProviderWrapper } from './ToastProviderWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alfresco ECM Platform',
  description: 'Enterprise Content Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <ToastProviderWrapper>
          <Navigation />
          <main>{children}</main>
        </ToastProviderWrapper>
      </body>
    </html>
  );
}