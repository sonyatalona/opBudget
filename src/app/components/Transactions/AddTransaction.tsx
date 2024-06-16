'use client';
import { Button, Drawer, FormControl, IconButton, Sheet, Snackbar, Stack, Typography } from '@mui/joy';
import { createSvgIcon } from '@mui/material';
import React, { useEffect } from 'react';
import { AutocompleteCategory } from './AutocompleteCategory';
import { PaymentProcessor } from './PaymentProcessor';

const PlusIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus'
);

type Tab = 'income' | 'expense' | 'transfer';
type Device = 'mobile' | 'desktop' | 'tablet';

export const AddTransaction: React.FC = () => {
  const [drawer, setDrawer] = React.useState<boolean>(false);
  const [device, setDevice] = React.useState<Device>('desktop');
  const [tab, setTab] = React.useState<Tab>('expense');

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    const close = () => {
      setDrawer(open);
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

  useEffect(() => {
    setDevice(window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1250 ? 'tablet' : 'desktop');
  }, []);

  useEffect(() => {
    // adding event listener to detect screen size
    // very ugly solution
    // TODO: find a better way to do this
    const resizeHandler = () => {
      if (window.innerWidth < 768) {
        setDevice('mobile');
      } else if (window.innerWidth < 1250) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
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
        size={device === 'desktop' ? 'md' : device === 'tablet' ? 'lg' : 'lg'}
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
          {/* dirty solution to clean internal state */}
          {drawer && (
            <form
              action={async (formData: FormData) => {
                console.log(formData);
                console.log(formData.entries());
                const body: { [key: string]: FormDataEntryValue } = {};
                formData.forEach((value, key) => {
                  body[key] = value;
                });
                console.log(body);
                const response = await fetch('/transaction', {
                  method: 'POST',
                  body: JSON.stringify(body),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                const json = await response.json();
                console.log(json);
              }}
            >
              <Stack direction={'column'} className="p-4" gap={2}>
                <Typography className="dark:text-white text-black mb-4" level="h2" noWrap={false} variant="plain">
                  Add Transaction
                </Typography>

                <div className="flex justify-around rounded-full">
                  <TabButton tab="expense" setTab={setTab} color="red" active={tab === 'expense'} />
                  <TabButton tab="income" setTab={setTab} color="yellow" active={tab === 'income'} />
                  <TabButton tab="transfer" setTab={setTab} color="sky" active={tab === 'transfer'} />
                </div>

                {tab === 'expense' && (
                  <>
                    <AutocompleteCategory />

                    <PaymentProcessor />
                  </>
                )}
                {tab === 'income' && (
                  <>
                    <AutocompleteCategory />

                    <PaymentProcessor />
                  </>
                )}
                {tab === 'transfer' && (
                  <>
                    <PaymentProcessor />
                  </>
                )}

                <FormControl size="sm">
                  <Button type="submit" className="bg-white text-black">
                    Submit
                  </Button>
                </FormControl>
              </Stack>
            </form>
          )}
        </Sheet>
      </Drawer>
      <Snackbar open={false} autoHideDuration={6000} onClose={() => {}}>
        <Typography>Transaction Added</Typography>
      </Snackbar>
    </>
  );
};

const TabButton = ({
  tab,
  setTab,
  color,
  active,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  color: string;
  active: boolean;
}) => {
  if (active) {
    return (
      <div
        className={`border-2 bg-white p-1 px-4 rounded-full capitalize cursor-pointer`}
        style={{ borderColor: color }}
      >
        {tab}
      </div>
    );
  } else {
    return (
      <div
        className={`bg-white p-1 px-4 rounded-full capitalize cursor-pointer border-2`}
        onClick={() => {
          setTab(tab);
        }}
      >
        {tab}
      </div>
    );
  }
};
