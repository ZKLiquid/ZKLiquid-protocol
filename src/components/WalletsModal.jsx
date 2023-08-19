import React, { useContext } from 'react';
import Modal from '../common/Modal';

import { ArrowRight2 } from 'iconsax-react';
import { WagmiContext } from '../context/WagmiContext';

function WalletsModal({ isOpen, onClose }) {
  const { connect, connectors, connectError, connectLoading, connectPending } =
    useContext(WagmiContext);

  const connectHandler = (connector) => {
    connect({ connector });
    onClose();
  };
  return (
    <Modal open={isOpen} onClose={onClose} heading="Connect to a wallet">
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connectHandler(connector)}
            className="flex w-full text-left items-center gap-2 px-3 py-2  bg-dark-300 rounded-lg hover:bg-opacity-60"
          >
            <img
              className="w-12 h-12"
              src={`./walletIcons/${connector.id}.svg`}
              alt=""
            />
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {connectLoading &&
              connector.id === connectPending?.id &&
              ' (connecting)'}

            <ArrowRight2 size="20" className="ml-auto" />
          </button>
        ))}
      </div>

      {connectError && <div>{connectError.message}</div>}
    </Modal>
  );
}

export default WalletsModal;
