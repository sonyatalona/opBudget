'use client';
import { Button } from '@mui/joy';
import React, { FC } from 'react';

export const Logout: FC<{ logout: () => void }> = ({ logout }) => {
  return (
    <Button
      variant="solid"
      color="neutral"
      size="sm"
      onClick={() => logout()}
      className="bg-red-500/80 text-white hover:bg-red-500 hover:text-white"
    >
      Logout
    </Button>
  );
};
