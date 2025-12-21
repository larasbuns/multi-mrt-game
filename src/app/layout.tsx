import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Open_Sans } from 'next/font/google';

export const metadata: Metadata = {
  title: 'MRT Challenge',
  description: "Test your knowledge of Singapore's MRT stations!",
};

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", openSans.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
