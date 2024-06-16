import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBarWrapper } from './components/Navbar/NavBarWrapper';
import { SWRProvider } from './components/Wrappers/swr-provider';
import { AlertWrapper } from './components/Wrappers/alert-wrapper';
import { createStore } from 'zustand';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OP Budget App',
  description: 'Do your budgeting right with Open Source Budget App',
};

const store = createStore<{
  isAuth: boolean;
}>();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertWrapper>
          <SWRProvider>
            <NavBarWrapper>{children}</NavBarWrapper>
          </SWRProvider>
        </AlertWrapper>
      </body>
    </html>
  );
}
