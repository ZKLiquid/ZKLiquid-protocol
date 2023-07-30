import { useState } from 'react';
import clsx from 'clsx';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ReactComponent as COinsSvg } from '../assets/svg/coins.svg';
import { toast } from 'react-toastify';

import Modal from '../common/Modal';

import {
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

function WalletButton({ width }) {
  const { address, connector, isConnected } = useAccount();

  const [isOpenWalletModal, setIsOpenWalletModal] = useState(false);
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      onSuccess() {
        toast.success('Connected.');
        setIsOpenWalletModal(false);
      },
    });
  const { disconnect } = useDisconnect();
  const disconnectHandler = () => {
    disconnect();
    toast.success('Disconnected.');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Copied to clipboard.');
  };

  const connectHandler = (connector) => {
    connect({ connector });
  };

  if (isConnected) {
    return (
      <Menu
        as="div"
        className={clsx(
          'relative inline-block text-left',
          width === 'full' && 'w-full'
        )}
      >
        {({ open }) => (
          <>
            <Menu.Button
              className={clsx(
                'flex gap-2 items-center bg-[#1A1C22] py-2 px-4 rounded-full text-sm font-medium',
                width === 'full' && 'w-full'
              )}
            >
              <COinsSvg className="flex-shrink-0 w-8 h-8" />
              {address.slice(0, 5)}... {address.slice(-4)}
              <ChevronDownIcon
                className={clsx(
                  'w-4 h-4 text-white transition-transform will-change-transform ml-auto',
                  open && 'rotate-180'
                )}
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#1A1C22] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                <Menu.Item>
                  <button
                    className="px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-[#292D33]"
                    onClick={disconnectHandler}
                  >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4 inline-block" />
                    Disconnect
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-[#292D33]"
                    onClick={copyAddress}
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 inline-block" />
                    Copy Address
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  }

  return (
    <>
      <button
        className={clsx(
          'flex gap-2 items-center bg-[#2769E4] py-2.5 px-4 rounded-full text-sm font-medium text-center justify-center',
          width === 'full' && 'w-full'
        )}
        onClick={() => setIsOpenWalletModal(true)}
      >
        Connect Wallet
      </button>
      <Modal
        open={isOpenWalletModal}
        onClose={() => setIsOpenWalletModal(false)}
        heading="Connect to a wallet"
      >
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
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}

              <ChevronRightIcon className="ml-auto w-5 h-5" />
            </button>
          ))}
        </div>

        {error && <div>{error.message}</div>}
      </Modal>
    </>
  );
}

export default WalletButton;
