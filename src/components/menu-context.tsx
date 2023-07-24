import { Transition } from '@headlessui/react';
import { useClickAway } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Menu, Theme } from 'react-daisyui';
import { createPortal } from 'react-dom';
import { useStore } from 'src/app/stores';

const PORTAL_ELEMENT = document.body;

const emitter = {
  events: {} as any,
  on(event: string, listener: any) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  },
  off(event: string, listener: any) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l: any) => l !== listener);
    }
  },
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((listener: any) => listener(...args));
    }
  },
};

const useContextMenu = () => {
  const [state, setState] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  const show = (data: any) => {
    const { event = null } = data;
    if (event) event.preventDefault();
    setState(prev => ({
      ...prev,
      ...data,
      x: event ? event.clientX : prev.x,
      y: event ? event.clientY : prev.y,
    }));
  };

  const close = () => {
    setState(prev => ({
      ...prev,
      show: false,
    }));
  };

  useEffect(() => {
    emitter.on('contextmenu', show);

    return () => {
      emitter.off('contextmenu', show);
    };
  }, []);

  return { state, update: show, close };
};

type TMenuContextProps = {
  items?: {
    title: string;
    Icon?: React.ReactNode;
    onClick: () => void;
  }[];
};

export const updateContextMenu = (data: any) => {
  emitter.emit('contextmenu', data);
};

const MenuContext = observer(({ items }: TMenuContextProps) => {
  const { themeStore } = useStore();

  const menuRef = useRef(null);
  const { state, close } = useContextMenu();
  const { show, x, y } = state;

  useClickAway(() => {
    if (show) close();
  }, menuRef);

  return createPortal(
    <Theme dataTheme={themeStore.themeType}>
      <Transition
        appear
        show={show}
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="absolute inset-0 h-48"
        style={{ transform: `translate(${x}px, ${y}px)` }}
      >
        <Menu ref={menuRef} className="bg-base-100 w-56 shadow-xl rounded-box">
          {items?.map((item, index) => (
            <Menu.Item key={index} onClick={item.onClick}>
              <a>
                {item.Icon}
                {item.title}
              </a>
            </Menu.Item>
          ))}
        </Menu>
      </Transition>
    </Theme>,
    PORTAL_ELEMENT,
  );
});

export { MenuContext };
