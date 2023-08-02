import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ArrowDown2 } from 'iconsax-react';

function SwitchNetworkDropdown({ width }) {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

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
            <div className="bg-[#101115] p-1 rounded-full">
              <img
                className="w-6 h-6"
                src={`/cryptoIcons/${chain.network}.svg`}
                alt=""
              />
            </div>

            <span className="lg:hidden xl:inline">{chain.name}</span>
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
              {chains.map((x) => (
                <Menu.Item key={x.id}>
                  <button
                    disabled={!switchNetwork || x.id === chain?.id}
                    onClick={() => switchNetwork?.(x.id)}
                    className={clsx(
                      'px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-dark-300',
                      !switchNetwork || (x.id === chain?.id && '!hidden')
                    )}
                  >
                    <img
                      className="w-6 h-6"
                      src={`/cryptoIcons/${x.network}.svg`}
                      alt=""
                    />
                    {x.name}
                    {isLoading && pendingChainId === x.id && ' (switching)'}
                  </button>
                </Menu.Item>
              ))}

              <div>{error && error.message}</div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default SwitchNetworkDropdown;
