import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as WalletSvg } from './assets/svg/wallet-balance.svg';
import { ReactComponent as COinsSvg } from './assets/svg/coins.svg';
import { ReactComponent as DotSvg } from './assets/svg/dotline.svg';
import { ReactComponent as BinanceSvg } from './assets/svg/binance-down.svg';
import { ReactComponent as ChevronSvg } from './assets/svg/chevron-down.svg';
import { ReactComponent as HamburgerMenuSvg } from './assets/svg/Hamburger.svg';
import { ReactComponent as DotSvgs } from './assets/svg/Dot.svg';

import Logo from './common/Logo';
import useToggle from './hooks/useToggle';

const AppHeader = ({
  ismd,
  islg,
  headerLinks,
  toggleSidebar,
  isFullSidebarWidth,
  isSidebar,
}) => {
  const [isDropdown, toggleDropdown] = useToggle();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const onScroll = (event) => {
  //   if (typeof window !== 'undefined') {
  //     if (window.scrollY > lastScrollY && window.scrollY > 70) {
  //       setNavShow(false);
  //     } else {
  //       setNavShow(true);
  //     }
  //     setLastScrollY(window.scrollY);
  //   }
  // };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('scroll', onScroll);

  //     return () => {
  //       window.removeEventListener('scroll', onScroll);
  //     };
  //   }
  // }, [lastScrollY]);

  return (
    <div className={clsx('sticky md:px-8 px-4 pb-2 top-0 z-10 bg-[#101115]')}>
      {islg ? (
        <div className={clsx('flex items-center gap-4 cursor-pointer')}>
          {/* <button onClick={toggleSidebar}>
            <span>{isSidebar ? <ToggleSvg /> : <ToggleRightSvg />}</span>
          </button> */}

          <div className='flex items-center gap-4 flex-1'>{headerLinks}</div>
          <div className='flex text-[14px] text-[#FFF] fon-bold items-center gap-4 justify-center pt-2'>
            <button className='flex gap-2 items-center bg-[#1A1C22] p-2 rounded-full'>
              <COinsSvg />
              0x573e ... 806b
              <DotSvg />
            </button>

            <button
              //   onClick={handleSidebarToggle}
              className='flex items-center gap-2 p-2 bg-[#1A1C22] rounded-full'
            >
              <WalletSvg />
              Wallet Balance
            </button>

            <button className='flex items-center gap-2 p-2 bg-[#1A1C22] rounded-full'>
              <BinanceSvg />
              <ChevronSvg />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'flex items-center justify-between text-white relative py-2'
          )}
        >
          <HamburgerMenuSvg
            className='cursor-pointer'
            onClick={toggleSidebar}
          />
          <Logo />
          <DotSvgs className='cursor-pointer' onClick={toggleDropdown} />
          <div
            className={clsx(
              'absolute left-0 right-0 -top-1 bg-[#101115] py-4 text-[14px] font-bold',
              isDropdown ? 'translate-y-0' : '-translate-y-full'
            )}
          >
            <span
              className='cursor-pointer font-[900] text-[18px]'
              onClick={toggleDropdown}
            >
              X
            </span>
            <button className='flex gap-2 items-center bg-[#1A1C22] p-2 rounded-full w-full'>
              <COinsSvg />
              0x573e ... 806b
              <DotSvg />
            </button>

            <button
              // onClick={handleSidebarToggle}
              className='flex items-center text-[14px] font-bold space-x-2 bg-[#1A1C22] p-2 rounded-full mt-4 w-full'
            >
              <WalletSvg />
              Wallet Balance
            </button>

            <button className='flex items-center justify-between w-full mt-3 gap-2 p-2 bg-[#1A1C22] rounded-full'>
              <BinanceSvg />
              <ChevronSvg />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
