import { Provider as ModalProvider } from '@ebay/nice-modal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { observer } from 'mobx-react-lite';
import { Theme } from 'react-daisyui';
import { useRoutes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import routes from './app/routes';
import { useStore } from './app/stores';

const queryClient = new QueryClient();

const App = observer(() => {
  const routing = useRoutes(routes);

  const { themeStore } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Theme id="theme-provider" dataTheme={themeStore.themeType}>
        <ModalProvider>{routing}</ModalProvider>
      </Theme>
      <ToastContainer theme={themeStore.isDarkTheme ? 'dark' : 'light'} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
});

export default App;
