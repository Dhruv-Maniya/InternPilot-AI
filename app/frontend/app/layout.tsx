import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { AppShell } from '@/components/ui/AppShell';

export const metadata: Metadata = {
  title: 'InternPilot AI — AI-Powered Internship & Career Operating System',
  description: 'Discover Opportunities. Prepare Smarter. Manage Your Career.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
