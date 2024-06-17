'use client';

import { ActionResult } from '@/types/forms';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export const DefaultForm = ({
  id,
  children,
  action,
}: {
  id: string;
  children: React.ReactNode;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}) => {
  const [state, formAction] = useFormState(action, {
    error: null,
  });
  return (
    <form id={id} action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
};

export const SignUpForm: React.FC<{
  username?: string;
  id: string;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}> = ({ username, id, action }) => {
  return (
    <DefaultForm id={id} action={action}>
      <input type="text" name="username" placeholder="Username" form={id} defaultValue={username} />
      <input type="email" name="email" placeholder="Email" form={id} />
      <input type="password" name="password" placeholder="Password" form={id} />
      <button type="submit" form={id}>
        Register
      </button>
    </DefaultForm>
  );
};

export const SignInForm: React.FC<{
  username?: string;
  id: string;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}> = ({ username, id, action }) => {
  return (
    <DefaultForm id={id} action={action}>
      <input type="text" name="username" placeholder="Username" form={id} defaultValue={username} />
      <input type="password" name="password" placeholder="Password" form={id} />
      <button type="submit" form={id}>
        Login
      </button>
    </DefaultForm>
  );
};

export const AuthenticateForm: React.FC<{
  signUpAction: (prevState: any, formData: FormData) => Promise<ActionResult>;
  signInAction: (prevState: any, formData: FormData) => Promise<ActionResult>;
  action: (prevState: any, formData: FormData) => Promise<{ exists?: boolean }>;
}> = ({ signInAction, signUpAction, action }) => {
  const [username, setUsername] = useState('');
  const modifiedAction = async (prevState: any, formData: FormData) => {
    const result = await action(prevState, formData);
    const username = formData.get('username');
    if (username) setUsername(username.toString());
    return result;
  };
  const [state, formAction] = useFormState(modifiedAction, { exists: undefined });
  return (
    <>
      {state.exists === undefined && (
        <form id="form1" action={formAction}>
          <input type="text" form="form1" name="username" placeholder="Username" />
          <button type="submit" form="form1">
            Check if username exists
          </button>
        </form>
      )}
      {state.exists === false && <SignUpForm id="form2" action={signUpAction} username={username} />}
      {state.exists === true && <SignInForm id="form3" action={signInAction} username={username} />}
    </>
  );
};
