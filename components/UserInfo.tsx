import { Loader } from '@mantine/core';
import { FC } from 'react';

import { useQueryUser } from '../hooks/useQueryUser';

export const UserInfo: FC = () => {
  const { data: user, status } = useQueryUser();

  if (status === 'loading') return <Loader />;

  return <p>{user?.email}</p>;
};
