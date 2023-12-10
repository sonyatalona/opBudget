'use client';
import { FC, ReactNode } from 'react';
import useSession from '../../hooks/use-session';
import { Avatar, IconButton } from '@mui/joy';
import { WalletIcon } from '../Icons/WalltetIcon';
import { HomeIcon } from '../Icons/HomeIcon';
import { CreditCardIcon } from '../Icons/CreditCardIcon';
import Link from 'next/link';
import { Login } from './Login';
import { Logout } from './Logout';
import { usePathname } from 'next/navigation';

interface NavBarWrapperProps {
  children: ReactNode;
}

const LinkWrapper: FC<{ location: string; href: string; children: JSX.Element }> = ({ location, href, children }) => (
  <Link
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all ease-in-out duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-200 hover:dark:bg-gray-600 ${
      location === href ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-50' : 'bg-transparent'
    }`}
    href={href}
  >
    {children}
  </Link>
);

export const NavBarWrapper: FC<NavBarWrapperProps> = ({ children }) => {
  const { session, logout } = useSession();
  const location = usePathname();
  return (
    <div className="grid h-screen w-full lg:grid-cols-[280px_1fr] overflow-hidden">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 border-gray-700">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex flex-shrink-0 h-[60px] items-center border-b border-gray-700 px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <WalletIcon className="h-6 w-6" />
              <span>OP Budget</span>
            </Link>
            {/* <IconButton className="ml-auto h-8 w-8">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </IconButton> */}
          </div>
          <div className="overflow-auto py-2 items-start px-4 text-sm font-medium pt-2 grid gap-2">
            <LinkWrapper href="/dashboard" location={location}>
              <>
                <HomeIcon className="h-4 w-4" />
                Dashboard
              </>
            </LinkWrapper>
            <LinkWrapper href="/expenses" location={location}>
              <>
                <CreditCardIcon className="h-4 w-4" />
                Expenses
              </>
            </LinkWrapper>
            {/* <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/reports"
            >
              <PieChartIcon className="h-4 w-4" />
              Reports
            </Link> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row h-14 lg:h-[60px] items-center justify-between lg:justify-end gap-4 border-b border-gray-700 bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden justify-self-start" href="#">
            <WalletIcon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex flex-row justify-self-end gap-2">
            <IconButton className="ml-auto h-8 w-8 rounded-full bg-transparent hover:bg-transparent">
              <Avatar />
            </IconButton>
            <div>
              {!session?.isLoggedIn && <Login />}
              {session?.isLoggedIn && logout && <Logout logout={logout} />}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh_-_3.6rem)] lg:h-[calc(100vh_-_60px)] relative">
          {children}
        </div>
      </div>
    </div>
  );
};
