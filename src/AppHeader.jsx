import clsx from 'clsx';
import { useState } from 'react';

import { ReactComponent as HamburgerMenuSvg } from './assets/svg/Hamburger.svg';
import { ReactComponent as DotSvgs } from './assets/svg/Dot.svg';

import Logo from './common/Logo';
import useToggle from './hooks/useToggle';
import { toast } from 'react-toastify';

import SwitchNetworkDropdown from './components/SwitchNetworkDropdown';
import WalletBalanceButton from './components/WalletBalanceButton';
import WalletButton from './components/WalletButton';

// wagmi imports
import { useAccount } from 'wagmi';

const AppHeader = ({ islg, headerLinks, toggleSidebar }) => {
  const [isDropdown, toggleDropdown] = useToggle();
  const { isConnected } = useAccount();

  return (
    <div className={clsx('sticky md:px-8 px-4 top-0 z-10 bg-[#101115]')}>
      {islg ? (
        <div className={clsx('flex items-center gap-4 cursor-pointer')}>
          <div className="flex items-center gap-4 flex-1">{headerLinks}</div>
          <div className="flex text-[14px] text-[#FFF] fon-bold items-center   gap-4 justify-center pt-2">
            <WalletButton />

            {isConnected && <WalletBalanceButton />}

            {isConnected && <SwitchNetworkDropdown />}
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'flex items-center justify-between text-white relative py-2'
          )}
        >
          <HamburgerMenuSvg
            className="cursor-pointer"
            onClick={toggleSidebar}
          />
          <Logo />
          <DotSvgs className="cursor-pointer" onClick={toggleDropdown} />
          <div
            className={clsx(
              'absolute left-0 right-0 -top-1 bg-[#101115] py-4 text-[14px] font-bold',
              isDropdown ? 'translate-y-0' : '-translate-y-full'
            )}
          >
            <span
              className="cursor-pointer font-[900] text-[18px]"
              onClick={toggleDropdown}
            >
              X
            </span>

            <br />
            <div className="space-y-3">
              <WalletButton width="full" />

              {isConnected && <WalletBalanceButton width="full" />}

              {isConnected && <SwitchNetworkDropdown width="full" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
