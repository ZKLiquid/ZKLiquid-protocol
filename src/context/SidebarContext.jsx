import { createContext, useState } from "react";

const SidebarContext = createContext();

const SidebarContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isXLM, setIsXLM] = useState(false);
  const [userPubKey, setUserPubKey] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [freighterConnecting, setFreighterConnecting] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isXLM,
        setIsXLM,
        userPubKey,
        setUserPubKey,
        selectedNetwork,
        setSelectedNetwork,
        freighterConnecting,
        setFreighterConnecting,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarContextProvider };
