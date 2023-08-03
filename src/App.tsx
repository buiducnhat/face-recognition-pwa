import { Provider as ModalProvider } from '@ebay/nice-modal-react';
import { observer } from 'mobx-react-lite';
import { Theme } from 'react-daisyui';
import { useRoutes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import routes from './app/routes';
import { useStore } from './app/stores';

const App = observer(() => {
  const routing = useRoutes(routes);

  const { themeStore } = useStore();

  return (
    <>
      <Theme id="theme-provider" dataTheme={themeStore.themeType}>
        <ModalProvider>{routing}</ModalProvider>
      </Theme>
      <ToastContainer theme={themeStore.isDarkTheme ? 'dark' : 'light'} />
    </>
  );
});

export default App;
