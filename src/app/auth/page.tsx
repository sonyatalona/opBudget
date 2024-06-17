import { lucia, validateRequest } from '@/auth';
import { AuthenticateForm } from '@/components/common/form';
import { ActionResult } from '@/types/forms';
import { User } from '@/utils/database/user';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';

export default async function Page() {
  const { user } = await validateRequest();
  //   if (user) {
  //     return redirect('/dashboard');
  //   }
  console.log('here', user);
  return (
    <div>
      <h1>Authenticate</h1>
      <AuthenticateForm action={checkIfUserNameExists} signUpAction={signup} signInAction={login} />
    </div>
  );
}

async function checkIfUserNameExists(_: any, formData: FormData): Promise<{ exists: boolean }> {
  'use server';
  const username = formData.get('username');
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return {
      exists: false,
    };
  }

  const existingUser = await User.getUserByUsername(username);
  if (existingUser) {
    return {
      exists: true,
    };
  }

  return {
    exists: false,
  };
}

async function login(_: any, formData: FormData): Promise<ActionResult> {
  'use server';
  const username = formData.get('username');
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return {
      error: 'Invalid username',
    };
  }
  const password = formData.get('password');
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return {
      error: 'Invalid password',
    };
  }

  const existingUser = await User.getUserByUsername(username);
  if (!existingUser) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const validPassword = await new Argon2id().verify(existingUser.password, password);
  if (!validPassword) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/');
}

async function signup(_: any, formData: FormData): Promise<ActionResult> {
  'use server';
  const username = formData.get('username');
  console.log(username);
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return {
      error: 'Invalid username',
    };
  }

  const email = formData.get('email');
  if (typeof email !== 'string' || email.length < 3 || email.length > 255) {
    return {
      error: 'Invalid email',
    };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return {
      error: 'Invalid password',
    };
  }

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    await User.createUser(username, email, hashedPassword, userId);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (e) {
    return {
      error: 'An unknown error occurred',
    };
  }
  return redirect('/');
}
