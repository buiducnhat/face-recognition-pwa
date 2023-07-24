import { createContext, useContext } from 'react';

import ThemeStore from './theme.store';
import ContextMenuStore from './context-menu.store';

const store = {
  themeStore: new ThemeStore(),
  contextMenuStore: new ContextMenuStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext<typeof store>(StoreContext);
};

export default store;
