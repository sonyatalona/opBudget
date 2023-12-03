import { SessionData, defaultSession } from '@/lib';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const sessionApiRoute = '/session';

async function fetchJson<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const response = await fetch(input, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? response.statusText ?? 'Unknown Error');
  }

  return response.json();
}

interface LoginArgs {
  email: string;
  password: string;
}

function doLogin(url: string, { arg }: { arg: LoginArgs }) {
  return fetchJson<SessionData>(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
}

function doLogout(url: string) {
  return fetchJson<SessionData>(url, {
    method: 'DELETE',
  });
}

export default function useSession() {
  const { data: session, isLoading } = useSWR(sessionApiRoute, fetchJson<SessionData>, {
    fallbackData: defaultSession,
  });

  const { trigger: login, error } = useSWRMutation(sessionApiRoute, doLogin, {
    revalidate: true,
    throwOnError: false,
    onSuccess: () => {
      window.location.href = '/dashboard';
    },
  });

  const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout, {
    revalidate: true,
    throwOnError: false,
    onSuccess: () => {
      window.location.href = '/';
    },
  });

  return { session, logout, login, isLoading, error };
}
