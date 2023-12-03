'use client';
import { FC } from 'react';
import useSession from '../../hooks/use-session';
import { Login } from './Login';
import { Logout } from './Logout';

export const NavBar: FC = () => {
  const { session, logout } = useSession();
  return (
    <div className="flex flex-row justify-between px-8 py-2 h-12 bg-cyan-900">
      <h1 className="text-2xl text-center justify-center">OP Budget</h1>
      {!session?.isLoggedIn && <Login />}
      {session?.isLoggedIn && logout && <Logout logout={logout} />}
    </div>
  );
};
