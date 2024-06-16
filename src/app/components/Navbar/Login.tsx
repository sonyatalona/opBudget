'use client';
import { Button, FormControl, FormHelperText, FormLabel, Input, InputProps, Modal, Stack } from '@mui/joy';
import React, { FC } from 'react';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import useSession from '../../hooks/use-session';
import { authenticate } from '@/server';
import { useAuthStore } from '@/app/hooks/use-login';

type DebounceProps = {
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
};

function DebounceInput(props: InputProps & DebounceProps) {
  const { handleDebounce, debounceTimeout, ...rest } = props;

  const timerRef = React.useRef<number>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <Input {...rest} onChange={handleChange} />;
}

export const Login: FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { displayText, error, setDisplayText, setError } = useAuthStore();

  const { login, error: loginError, isLoading } = useSession();

  const handleDebounce = (value: string) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email!');
    } else {
      setError(undefined);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDisplayText(undefined);
  };
  return (
    <>
      <Button
        variant="solid"
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-gray-200 text-black hover:text-black hover:bg-gray-300"
      >
        Login
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        disablePortal={false}
        hideBackdrop={false}
        open={open}
        onClose={(_, reason) => {
          reason !== 'backdropClick' && handleClose();
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 2,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0.5 }} />
          <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
            {displayText?.header ?? 'Login'}
          </Typography>
          <form
            action={async (formData: FormData) => {
              if (!formData.get('password')) {
                const result = await authenticate(formData);
                if (result.error) {
                  setError(result.error);
                } else {
                  setError('');
                  setDisplayText({
                    header: result.exists ? 'Login' : 'Registration',
                    button: result.exists ? 'Login' : 'Register',
                  });
                }
              } else {
                await login({
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                });
              }
            }}
          >
            <Stack direction="column" spacing={1} mb={2}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <DebounceInput
                  placeholder="Your email"
                  name="email"
                  debounceTimeout={200}
                  handleDebounce={handleDebounce}
                  type="email"
                />
                {error && <FormHelperText className="text-red-400">Please enter a valid email!</FormHelperText>}
              </FormControl>
              {displayText?.button !== 'Continue with Email' && (
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input variant="outlined" placeholder="Password" name="password" type="password" />
                  {loginError && (
                    <FormHelperText className="text-red-400">
                      {loginError?.message ?? 'Please try again'}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Stack>
            <Button
              type="submit"
              variant="solid"
              className="bg-black text-white hover:text-white hover:bg-gray-700 w-full mt-2"
              loading={isLoading}
            >
              {displayText?.button}
            </Button>
          </form>
        </Sheet>
      </Modal>
    </>
  );
};
