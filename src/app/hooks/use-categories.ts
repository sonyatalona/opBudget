import { Category } from '@/types/categories';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

type CategoryArgs = {
  categoryName: string;
  description?: string;
  parentId?: number;
};

async function sendRequest(url: string, { arg }: { arg: CategoryArgs }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json());
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
    onSuccess: (res) => {
      console.log(res);
      data?.push(res);
    },
  });

  console.log(data);
  return {
    categories: data,
    addCategory,
    addCategoryError,
    isLoading: isLoading,
    isError: error,
  };
};
