import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';

import logo from '../assets/images/logo.svg';
import {
  Bars3Icon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import { ArrowSquareRight } from 'iconsax-react';
import WalletButton from './WalletButton';
import { useAccount } from 'wagmi';
import WalletBalanceButton from './WalletBalanceButton';
import SwitchNetworkDropdown from './SwitchNetworkDropdown';

function Header({ links }) {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { isConnected } = useAccount();

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 xl:left-64 right-0 px-4 py-3 transition-all bg-dark-500 xl:px-8 xl:py-4 z-10',
        isOpen ? 'md:left-64' : 'md:left-20'
      )}
    >
      <div className="flex justify-between lg:hidden">
        <button onClick={() => setIsOpen((prev) => !prev)}>
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>

        <Link to="/">
          <img src={logo} alt="Syntrum" />
        </Link>

        <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
      </div>

      <div className="lg:flex justify-between items-center hidden">
        <div className="flex gap-4">
          <button
            className={clsx('xl:hidden pr-4 border-r border-dark-300')}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ArrowSquareRight
              className={isOpen ? 'rotate-180' : ''}
              size="24"
              color="#4C9BE8"
            />
          </button>

          <div className="flex gap-2.5">
            {links.map((link) => (
              <NavLink
                className={({ isActive }) => {
                  const navClasses =
                    'py-1.5 px-5 inline-block rounded-md transition-colors hover:bg-dark-300';
                  return isActive ? `!bg-[#2769E4] ${navClasses}` : navClasses;
                }}
                key={link}
                to={`/${link}`}
              >
                <span className="capitalize text-sm font-semibold">{link}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <WalletButton />

          {isConnected && <WalletBalanceButton />}

          {isConnected && <SwitchNetworkDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Header;
