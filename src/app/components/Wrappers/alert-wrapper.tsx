'use client';
import { Snackbar } from '@mui/joy';
import React, { ReactNode, createContext, useContext, useState, useRef } from 'react';

interface AlertContentType {
  message?: string;
  severity?: 'danger' | 'success' | 'warning' | 'neutral';
  duration?: number;
  location?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

interface AlertContextType {
  showAlert: (content: AlertContentType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertWrapper = ({ children }: { children: ReactNode }) => {
  const [alertContent, setAlertContent] = useState<AlertContentType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);

  const showAlert = (content: AlertContentType) => {
    if (ref.current) {
      return;
    }
    setAlertContent(content);
    setOpen(true);
  };

  const hideAlert = () => {
    setOpen(false);
    setTimeout(() => {
      setAlertContent(null);
    }, 300);
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
      }}
    >
      {children}

      <Snackbar
        anchorOrigin={alertContent?.location ?? { vertical: 'bottom', horizontal: 'left' }}
        size="sm"
        ref={ref}
        open={open}
        autoHideDuration={alertContent?.duration ?? 4000}
        onClose={hideAlert}
        animationDuration={300}
        color={alertContent?.severity ?? 'neutral'}
      >
        {alertContent?.message ?? 'Something went wrong'}
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within a AlertWrapper');
  }
  return context;
};
