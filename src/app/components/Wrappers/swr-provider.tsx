'use client';
import { SWRConfig } from 'swr';
import React, { ReactNode } from 'react';
import { useAlertStore } from './alert-wrapper';

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  const { showAlert } = useAlertStore();
  return (
    <SWRConfig
      value={{
        onError: (err) => {
          showAlert({ message: err.message, severity: 'danger' });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
