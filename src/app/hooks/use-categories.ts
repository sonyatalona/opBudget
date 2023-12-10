import { Category } from '@/types/categories';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

type CategoryArgs = {
  categoryName: string;
  description?: string;
  parentId?: number;
};

async function sendRequest(url: string, { arg }: { arg: CategoryArgs }) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const body = await res.json();

    throw new Error(body.error);
  }

  return res.json();
}

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<Category[]>('/category', {
    fetcher: (url) =>
      fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      }).then((res) => res.json()),
  });

  const { trigger: addCategory, error: addCategoryError } = useSWRMutation('/category', sendRequest, {
    throwOnError: false,
    onSuccess: (res) => {
      data?.push(res);
    },
  });

  return {
    categories: data,
    addCategory,
    addCategoryError,
    isLoading: isLoading,
    isError: error,
  };
};
