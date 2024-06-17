import { DeviceStore } from '@/components/state-components/device-store';
import React from 'react';

import { NavBar } from '@/components/navbar/navbar';
import './globals.css';

export const metadata = {
  title: 'Budgetr',
  description: 'Budgetr - advanced budgeting tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <DeviceStore />
      <body>
        <div className="h-dvh w-screen bg-black/95 relative">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
