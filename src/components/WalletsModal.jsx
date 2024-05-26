import React, { useContext, useEffect } from "react";
import Modal from "../common/Modal";

import { ArrowRight2 } from "iconsax-react";
import { toast } from "react-toastify";
import { WagmiContext } from "../context/WagmiContext";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { sepolia, avalancheFuji } from "viem/chains";

function WalletsModal({ isOpen, onClose }) {
  // const { connect, connectors, connectError, connectLoading, connectPending } =
  //   useContext(WagmiContext);
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { chain } = useAccount();

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Modal open={isOpen} onClose={onClose} heading="Connect to a wallet">
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            // disabled={!connector.ready}
            key={connector.id}
            onClick={() =>
              connect({ chainId: avalancheFuji.id || chain.id, connector })
            }
            className="flex items-center w-full gap-3 px-3 py-2 text-left text-lg rounded-lg bg-dark-300 hover:bg-opacity-60"
          >
            <img
              className="w-12 h-12"
              src={
                connector.name === "WalletConnect"
                  ? "./walletIcons/WalletConnect.svg"
                  : connector.icon
              }
              alt=""
            />
            {connector.name}

            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}

            <ArrowRight2 size="20" className="ml-auto" />
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default WalletsModal;
