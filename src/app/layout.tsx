import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {cn} from '@/lib/utils';
import SessionProvider from '@/components/SessionProvider';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const inter = Inter({subsets:['latin'], variable:"--font-sans"});

export const metadata: Metadata = {
  title: "E commerce",
  description: "find and enjoy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className= {cn("bg-background min-h-screen font-sans antialiased",inter.variable)}
      >
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
