import { createContext } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from 'react-toastify';

const WagmiContext = createContext();

const WagmiContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();

  const {
    connect,
    connectors,
    error: connectError,
    isLoading: connectLoading,
    pendingConnector: connectPending,
  } = useConnect({
    onSuccess() {
      toast.success('Connected.');
    },
  });

  const { disconnect } = useDisconnect({
    onSuccess(data) {
      toast.success('Disconnected.', data);
    },
  });

  return (
    <WagmiContext.Provider
      value={{
        address,
        isConnected,
        connect,
        connectors,
        connectError,
        connectLoading,
        connectPending,
        disconnect,
      }}
    >
      {children}
    </WagmiContext.Provider>
  );
};

export { WagmiContext, WagmiContextProvider };
