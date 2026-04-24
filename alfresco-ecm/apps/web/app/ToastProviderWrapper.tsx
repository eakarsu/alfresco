'use client';

import { ToastProvider } from '../components/ToastNotification';

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
