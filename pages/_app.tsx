import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  // リクエストヘッダーにCookieを含めるよう設定 (Access-Control-Allow-Credentials)
  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function getCsrfToken() {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`,
      );
      // リクエストヘッダーにCSRFトークンを追加
      axios.defaults.headers.common['csrf-token'] = data.csrfToken;
    }
    getCsrfToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
