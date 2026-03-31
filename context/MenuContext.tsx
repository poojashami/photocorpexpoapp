import React, { createContext, useState, useContext, ReactNode } from 'react';

type MenuContextType = {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
