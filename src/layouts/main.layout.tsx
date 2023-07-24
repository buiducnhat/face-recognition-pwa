import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { useStore } from 'src/app/stores';
import { MenuContext } from 'src/components/menu-context';

const MainLayout = observer(() => {
  const { contextMenuStore } = useStore();

  return (
    <div className="min-h-screen w-full bg-base-100">
      <MenuContext items={contextMenuStore.items} />
      <Outlet />
    </div>
  );
});

export default MainLayout;
