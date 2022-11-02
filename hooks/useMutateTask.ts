import { Task } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

import useStore from '../store';
import { EditedTask } from '../types';

export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const reset = useStore((state) => state.resetEditedTask);

  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task,
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        // タスクの一覧をキャシュから取得
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          // キャッシュの内容を更新
          queryClient.setQueryData(['tasks'], [data, ...previousTasks]);
        }
        reset();
      },
      onError: (err) => {
        reset();
        if (err instanceof AxiosError && err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            router.push('/');
          }
        }
      },
    },
  );

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task,
      );
      return res.data;
    },
    {
      onSuccess: (data, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          queryClient.setQueryData(
            ['tasks'],
            previousTasks.map((task) => (task.id === data.id ? data : task)),
          );
        }
        reset();
      },
      onError: (err) => {
        reset();
        if (err instanceof AxiosError && err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            router.push('/');
          }
        }
      },
    },
  );

  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`);
    },
    {
      onSuccess: (_, variables) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        if (previousTasks) {
          queryClient.setQueryData(
            ['tasks'],
            previousTasks.filter((task) => task.id !== variables),
          );
          reset();
        }
      },
      onError: (err) => {
        reset();
        if (err instanceof AxiosError && err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            router.push('/');
          }
        }
      },
    },
  );

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
