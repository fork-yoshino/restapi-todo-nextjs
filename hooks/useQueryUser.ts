import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export const useQueryUser = () => {
  const router = useRouter();

  async function getUser() {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
    );
    return data;
  }

  const query = useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (err) => {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 401 || err.response.status === 403)
          router.push('/');
      }
    },
  });

  return query;
};
