import { create } from 'zustand';

type DisplayText = {
  header?: 'Authentication' | 'Registration' | 'Forgot Password' | 'Reset Password' | 'Login';
  button?: 'Continue with Email' | 'Login' | 'Register' | 'Reset Password' | 'Forgot Password';
};

interface State {
  displayText?: DisplayText;
  error?: string;
  setDisplayText: (displayText?: DisplayText) => void;
  setError: (error?: string) => void;
}

export const useAuthStore = create<State>()((set) => ({
  displayText: {
    header: 'Authentication',
    button: 'Continue with Email',
  },
  error: undefined,
  setDisplayText: (displayText) => set({ displayText }),
  setError: (error) => set(() => ({ error })),
}));
