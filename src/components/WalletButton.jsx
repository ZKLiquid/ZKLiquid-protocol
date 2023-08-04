import clsx from 'clsx';
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import CoinSVG from '@/assets/svg/coins.svg';
import { toast } from 'react-toastify';

import Modal from '../common/Modal';

import { ArrowDown2, ArrowRight2, Copy, LogoutCurve } from 'iconsax-react';

function WalletButton({ width }) {
  const { address, isConnected } = useAccount();

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
                'flex gap-2 items-center p-1 pr-2.5 rounded-full text-sm font-medium border border-dark-300 transition-colors hover:bg-dark-300',
                width === 'full' && 'w-full',
                open ? 'bg-dark-300' : 'bg-dark-400'
              )}
            >
              <img src={CoinSVG} className="flex-shrink-0 w-8 h-8" alt="" />
              {address.slice(0, 5)}... {address.slice(-4)}
              <ArrowDown2
                size="16"
                color="#fff"
                className={clsx(
                  'transition-transform will-change-transform ml-auto',
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark-400 border border-dark-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                <Menu.Item>
                  <button
                    className="px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-dark-300"
                    onClick={disconnectHandler}
                  >
                    <LogoutCurve size="16" color="#fff" />
                    Disconnect
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-dark-300"
                    onClick={copyAddress}
                  >
                    <Copy size="16" color="#fff" />
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

              <ArrowRight2 size="20" className="ml-auto" />
            </button>
          ))}
        </div>

        {error && <div>{error.message}</div>}
      </Modal>
    </>
  );
}

export default WalletButton;
