import { Fragment } from 'react';
import clsx from 'clsx';

import { Web3Button, useWeb3Modal } from '@web3modal/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';

import { ReactComponent as COinsSvg } from '../assets/svg/coins.svg';
import { toast } from 'react-toastify';

function ConnectWalletButton() {
  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const notify = () => toast.success('Wow so easy!');

  const connect = useConnect({
    onSuccess(data) {
      console.log('Connect', data);
    },
  });
  const connectHandler = () => {
    open();
  };

  const disconnectHandler = () => {
    disconnect();
    toast.success('Disconnected.');
  };

  const copyAddressHandler = () => {
    navigator.clipboard.writeText(address);
    toast.success('Copied to clipboard.');
  };

  if (isConnected) {
    return <Web3Button />;
    return (
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <Menu.Button className="flex gap-2 items-center bg-[#1A1C22] py-2 px-4 rounded-full text-sm font-medium">
              <COinsSvg className="flex-shrink-0" />
              {address.slice(0, 5)}... {address.slice(-4)}
              <ChevronDownIcon
                className={clsx(
                  'w-4 h-4 text-white transition-transform will-change-transform',
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
                    className="px-4 py-2 text-sm transition-colors block w-full text-left hover:bg-[#292D33]"
                    onClick={disconnectHandler}
                  >
                    Disconnect
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="px-4 py-2 text-sm transition-colors block w-full text-left hover:bg-[#292D33]"
                    onClick={copyAddressHandler}
                  >
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
    <button
      className="flex gap-2 items-center bg-[#2769E4] py-2 px-4 rounded-full text-sm font-medium"
      onClick={connectHandler}
    >
      Connect Wallet
    </button>
  );
}

export default ConnectWalletButton;
