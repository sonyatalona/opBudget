'use client';
import { useDevice } from '@/app/hooks/use-media-query';
import { Button, Drawer, FormControl, IconButton, Sheet, Snackbar, Stack, Typography } from '@mui/joy';
import { createSvgIcon } from '@mui/material';
import React from 'react';
import { AutocompleteAndAdd } from './AutocompleteAndAdd';
import type { Category } from '@/types/categories';
import { PaymentProcessor } from './PaymentProcessor';

const PlusIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus'
);

export const AddTransaction: React.FC = () => {
  const [drawer, setDrawer] = React.useState<boolean>(false);
  const device = useDevice();
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    const close = () => {
      setDrawer(open);
      if (!open) {
        setTimeout(() => {
          setSelectedCategory(null);
        }, 400);
      }
    };
    if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Escape') {
      close();
      return;
    }
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    close();
  };

  return (
    <>
      <IconButton
        className="absolute bottom-2 right-2 rounded-full dark:bg-white bg-black"
        onClick={toggleDrawer(true)}
        sx={{
          '--Drawer-transitionDuration': drawer ? '0.4s' : '0.2s',
          '--Drawer-transitionFunction': drawer ? 'cubic-bezier(0.79,0.14,0.15,0.86)' : 'cubic-bezier(0.77,0,0.18,1)',
        }}
      >
        <PlusIcon />
      </IconButton>
      <Drawer
        size={'md'}
        anchor={device === 'mobile' ? 'bottom' : 'right'}
        open={drawer}
        onClose={toggleDrawer(false)}
        slotProps={{
          content: {
            sx: {
              bgcolor: 'transparent',

              boxShadow: 'none',
            },
          },
        }}
      >
        <Sheet className={`w-auto h-full dark:bg-gray-700 bg-gray-400 rounded-t-lg md:rounded-lg md:m-6`}>
          <Stack direction={'column'} className="p-4" gap={2}>
            <Typography className="dark:text-white text-black mb-4" level="h2" noWrap={false} variant="plain">
              Add Transaction
            </Typography>

            <AutocompleteAndAdd setSelected={setSelectedCategory} selected={selectedCategory} />

            <PaymentProcessor />

            <FormControl size="sm">
              <Button type="submit" className="bg-white text-black">
                Submit
              </Button>
            </FormControl>
          </Stack>
        </Sheet>
      </Drawer>
      <Snackbar open={false} autoHideDuration={6000} onClose={() => {}}>
        <Typography>Transaction Added</Typography>
      </Snackbar>
    </>
  );
};
