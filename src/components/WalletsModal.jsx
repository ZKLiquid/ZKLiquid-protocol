import React, { useContext, useEffect } from 'react';
import Modal from '../common/Modal';

import { ArrowRight2 } from 'iconsax-react';
import { toast } from 'react-toastify';
import { WagmiContext } from '../context/WagmiContext';

function WalletsModal({ isOpen, onClose }) {
  const { connect, connectors, connectError, connectLoading, connectPending } =
    useContext(WagmiContext);

  const connectHandler = (connector) => {
    if (!connector.ready) {
      if (connector.id === 'metaMask') {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
      }
      onClose();
    } else {
      connect({ connector });
      onClose();
    }   
  };

  useEffect(() => {
    if (connectError && connectError.message) {
      toast.error(connectError.message);
    }
  }, [connectError]);

  return (
    <Modal open={isOpen} onClose={onClose} heading="Connect to a wallet">
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            // disabled={!connector.ready}
            key={connector.id}
            onClick={() => connectHandler(connector)}
            className="flex items-center w-full gap-2 px-3 py-2 text-left rounded-lg bg-dark-300 hover:bg-opacity-60"
          >
            <img
              className="w-12 h-12"
              src={`./walletIcons/${connector.id}.svg`}
              alt=""
            />
            {connector.name}
            {!connector.ready && ' install required!'}
            {connectLoading &&
              connector.id === connectPending?.id &&
              ' (connecting)'}

            <ArrowRight2 size="20" className="ml-auto" />
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default WalletsModal;
