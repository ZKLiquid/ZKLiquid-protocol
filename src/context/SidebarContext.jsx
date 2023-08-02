import { createContext, useState } from 'react';

const SidebarContext = createContext();

const SidebarContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
