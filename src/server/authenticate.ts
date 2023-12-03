'use server';

import prisma from '@/utils/prisma';

export async function authenticate(formData: FormData) {
  try {
    const email = formData.get('email');

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!email) {
      throw new Error('Missing username or password');
    }
    if (typeof email !== 'string') {
      throw new Error('Username or password is not a string');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Email is not valid');
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { exists: false };
    }

    return { exists: true };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: 'An unknown error occurred' };
    }
  }
}
