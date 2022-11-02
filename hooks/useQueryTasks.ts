import { Task } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export const useQueryTasks = () => {
  const router = useRouter();

  async function getTasks() {
    const { data } = await axios.get<Task[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/todo`,
    );
    return data;
  }

  const query = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/');
        }
      }
    },
  });

  return query;
};
