'use client';
import { Snackbar } from '@mui/joy';
import React, { ReactNode, useRef } from 'react';
import { create } from 'zustand';

interface AlertContextType {
  message?: string;
  severity?: 'danger' | 'success' | 'warning' | 'neutral';
  duration?: number;
  location?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}
interface AlertState {
  open: boolean;
  context?: AlertContextType;
  showAlert: (content: AlertContextType) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  context: undefined,
  open: false,
  showAlert: (context: AlertContextType) => {
    set(() => ({ open: true, context }));
  },
  hideAlert: () => {
    set(() => ({ open: false, context: undefined }));
  },
}));

export const AlertWrapper = ({ children }: { children: ReactNode }) => {
  const { open, context, hideAlert } = useAlertStore();
  const ref = useRef(null);

  return (
    <>
      {children}
      <Snackbar
        anchorOrigin={context?.location ?? { vertical: 'bottom', horizontal: 'left' }}
        size="sm"
        ref={ref}
        open={open}
        autoHideDuration={context?.duration ?? 4000}
        onClose={hideAlert}
        animationDuration={300}
        color={context?.severity ?? 'neutral'}
      >
        {context?.message ?? 'Something went wrong'}
      </Snackbar>
    </>
  );
};
