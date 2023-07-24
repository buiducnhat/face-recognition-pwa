import { action, makeObservable, observable } from 'mobx';
import { updateContextMenu } from 'src/components/menu-context';

type TContextMenuItem = {
  title: string;
  Icon?: React.ReactNode;
  onClick: () => void;
};

class ContextMenuStore {
  @observable items: TContextMenuItem[] = [];

  constructor() {
    makeObservable(this);
  }

  @action.bound
  public setItems(items: TContextMenuItem[]) {
    this.items = items;
  }

  @action.bound
  showContextMenu(items: TContextMenuItem[], event: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.setItems(items);

    updateContextMenu({
      show: true,
      event,
    });
  }

  @action.bound
  hideContextMenu() {
    this.setItems([]);

    updateContextMenu({
      show: false,
    });
  }
}

export default ContextMenuStore;
