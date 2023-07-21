import { useMemo } from 'react';
import clsx from 'clsx';
import Logo from './common/Logo';
import { matchPath, NavLink, useLocation, useMatch } from 'react-router-dom';

import useToggle from './hooks/useToggle';

import { ReactComponent as TradeSvg } from './assets/svg/Trade.svg';
import { ReactComponent as BridgeSvg } from './assets/svg/SynBridge.svg';

const AppSideBar = (props) => {
  const {
    isSidebar,
    toggleSidebar,
    ismd,
    islg,
    sidebarWidth,
    headerLinks,
    isFullSidebarWidth,
  } = props;

  const isSwap = useMatch('/swap');
  const isDeFi = useMatch('/defi/*');
  const isGameFi = useMatch('/gamefi/*');
  const isNDFT = useMatch('/nft/*');

  const links = isGameFi
    ? GAME_LINKS
    : isNDFT
    ? NFT_LINKS
    : isDeFi
    ? DEFI_LINKS
    : SWAP_LINKS;

  return (
    <>
      {!ismd && isSidebar && (
        <div
          className='fixed left-0 right-0 top-0 bottom-0 bg-[#101115] bg-opacity-25 z-10'
          // className='fixed left-0 right-0 top-0 bottom-0 bg-black bg-opacity-25 inset-y-0 z-10'
          onClick={toggleSidebar}
        />
      )}

      <div
        className={clsx(
          'fixed left-0 top-0 bottom-0 border-r border-[#191A1F] bg-[#101115] transition-all z-10 md:z-0 overflow-y-auto',
          !ismd && (isSidebar ? 'translate-x-0' : '-translate-x-full')
        )}
        style={{ width: sidebarWidth }}
      >
        <div className='sticky top-0'>
          <div
            className={clsx(
              'p-4 md:mb-[105px] relative flex',
              isFullSidebarWidth ? '' : 'justify-center'
            )}
          >
            <Logo iconOnly={!isFullSidebarWidth} />
            {!ismd && (
              <>
                <div className='flex-1' />
                <span className='cursor-pointer' onClick={toggleSidebar}>
                  X
                </span>
              </>
            )}
          </div>
          {!ismd && (
            <div className='flex items-center gap-4 px-1 mb-8'>
              {headerLinks}
            </div>
          )}
        </div>
        <div>
          {links.map((link, index) => {
            const contentProps = { key: index, index, link, ...props };
            return !!link.children ? (
              <AppSidebarGroup {...contentProps} />
            ) : (
              <AppSidebarLink {...contentProps} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AppSideBar;

function AppSidebarGroup({ link, index, toggleDrawer, isFullSidebarWidth }) {
  const { label, children, SvgIcon } = link;

  const location = useLocation();

  const isActive = useMemo(() => {
    let result = null;
    for (const child of children) {
      result = matchPath({ path: child.to + '/*' }, location.pathname);
      if (result) {
        break;
      }
    }
    return result;
  }, [children, location.pathname]);

  const [isSubMenu, toggleSubMenu] = useToggle(!!isActive);

  return (
    <>
      <div
        className={clsx(
          'cursor-pointer flex items-center gap-2 p-4 bg-paper text-[#6D7A86] hover:text-white text-[16px] fon-[500] transition-all duration-300 ease-in-out',
          // isActive && 'text-[#F2F4F5]',
          isFullSidebarWidth ? '' : 'justify-center'
        )}
        {...{ onClick: toggleSubMenu }}
      >
        <SvgIcon fill={!!isActive && 'bg-paper text-[#F2]'} />
        {isFullSidebarWidth && (
          <>
            <span className='flex-1 ml-2'>{label}</span>
            {isSubMenu ? <ArrowUpSvg /> : <ArrowDownSvg />}
          </>
        )}
      </div>
      {isSubMenu && (
        <div className={clsx('bg-paper', isActive && 'bg-paper')}>
          {children?.map((link, index) => (
            <AppSidebarLink {...{ key: index, link, isFullSidebarWidth }} />
          ))}
        </div>
      )}
    </>
  );
}

function AppSidebarLink({ link, isFullSidebarWidth, toggleSidebar }) {
  const { label, SvgIcon, comingSoon, ...restProps } = link;

  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          'px-4 py-[0.9rem] flex items-center gap-1 transition-all font-[500] duration-300 ease-in-out text-[#6D7A86] hover:text-white',
          isFullSidebarWidth ? '' : 'justify-center',
          isActive && 'text-white bg-[#292B33]'
        )
      }
      {...restProps}
    >
      {({ isActive }) => (
        <>
          <SvgIcon fill={isActive ? '#FF844B' : '#6D7A86'} />
          {isFullSidebarWidth && (
            <>
              <span
                // onClick={toggleSidebar}
                className='flex-1 text-[16px] font-display font-bold ml-3'
              >
                {label}
              </span>
              {comingSoon && (
                <div className=''>
                  <SoonSvg />
                </div>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );
}

// const DEFI_LINKS = [
//     { label: 'DashBoard', to: '/', SvgIcon: DashBoardSvg, comingSoon: true },
//     {
//       label: 'SynLend',
//       SvgIcon: SynLendSvg,
//       children: [
//         { label: 'Lend', to: '/lend', SvgIcon: LendSvg },
//         {
//           label: 'My Loans',
//           to: '/my-loans',
//           SvgIcon: MyLoansSvg,
//           // comingSoon: true,
//         },
//       ],
//     },
//     { label: 'SynMarg', to: '/synmarg', SvgIcon: SynMargSvg, comingSoon: true },
//     {
//       label: 'SynBridge',
//       to: '/synbridge',
//       SvgIcon: SynBridgeSvg,
//       comingSoon: true,
//     },
//     {
//       label: 'SynTokenomics',
//       to: '/syntokenomics',
//       SvgIcon: SynamatokensSvg,
//       comingSoon: true,
//     },
//     { label: 'Syn-aaS', to: '/syn-aas', SvgIcon: SynaasSvg, comingSoon: true },
//     {
//       label: 'SynVault',
//       to: '/synvault',
//       SvgIcon: SynVaultSvg,
//       comingSoon: true,
//     },
//   ];

const SWAP_LINKS = [
  { label: 'Trade', to: '/swap', SvgIcon: TradeSvg },
  { label: 'Bridge Protocol', to: '/bridge-protocol', SvgIcon: BridgeSvg },
];

const DEFI_LINKS = [
  {
    label: 'DeFi Link',
    to: '/defi',
    SvgIcon: BridgeSvg,
    comingSoon: false,
  },
];

const GAME_LINKS = [
  {
    label: 'GameFi Link',
    to: '/gamefi',
    SvgIcon: BridgeSvg,
    comingSoon: false,
  },
];

const NFT_LINKS = [
  {
    label: 'NFT Link',
    to: '/nft',
    SvgIcon: BridgeSvg,
    comingSoon: false,
  },
];
