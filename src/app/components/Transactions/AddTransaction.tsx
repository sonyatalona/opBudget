'use client';
import { useCategories } from '@/app/hooks/use-categories';
import { useDevice } from '@/app/hooks/use-media-query';
import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from '@mui/joy';
import { createSvgIcon } from '@mui/material';
import React from 'react';

const PlusIcon = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus'
);

export const AddTransaction: React.FC = () => {
  const [drawer, setDrawer] = React.useState<boolean>(false);
  const device = useDevice();
  const { categories, addCategory } = useCategories();
  console.log(categories);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawer(open);
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
          <Stack direction={'column'} className="p-4">
            <Typography className="text-white" level="h2" noWrap={false} variant="plain">
              Add Transaction
            </Typography>
            <form
              action={async (_formData: FormData) => {
                await addCategory({ categoryName: 'test' });
              }}
            >
              <FormControl size="sm">
                <FormLabel>Category</FormLabel>
                <Autocomplete
                  type="text"
                  multiple={false}
                  placeholder="Favorite movies"
                  autoComplete={false}
                  options={[{ title: 'The Godfather' }, { title: 'The Godfather: Part II' }] as { title: string }[]}
                  getOptionLabel={(option) => (Array.isArray(option) ? option[0].title : option.title)}
                  defaultValue={[{ title: 'The Godfather' }]}
                />
                <FormHelperText>This is a small description.</FormHelperText>
              </FormControl>
              <FormControl size="sm">
                <Button type="submit" className="bg-white text-black">
                  Submit
                </Button>
              </FormControl>
            </form>
          </Stack>
        </Sheet>
      </Drawer>
    </>
  );
};
