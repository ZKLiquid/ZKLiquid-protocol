import { useEffect } from 'react';
import { NavLink, Route, Routes, useMatch } from 'react-router-dom';
import clsx from 'clsx';

import useToggle from './hooks/useToggle';
import useMediaQuery from './hooks/useMediaQuery';
import {
  APP_SIDEBAR_MOBILE_WIDTH,
  APP_SIDEBAR_WIDTH,
  MediaQueryBreakpointEnum,
} from './constant/globalConstants';

import AppHeader from './AppHeader';
import AppSideBar from './AppSideBar';

import Trade from './pages/Trade';
import BridgeProtocol from './pages/BridgeProtocol';
import Footer from './common/Footer';

function App() {
  const islg = useMediaQuery(MediaQueryBreakpointEnum.xl);
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);
  const [isSidebar, toggleSidebar, setSidebar] = useToggle(islg || false);

  const sidebarWidth = !ismd
    ? APP_SIDEBAR_WIDTH
    : isSidebar
    ? APP_SIDEBAR_WIDTH
    : APP_SIDEBAR_MOBILE_WIDTH;
  const isFullSidebarWidth = sidebarWidth === APP_SIDEBAR_WIDTH;

  useEffect(() => {
    setSidebar(islg || false);
  }, [islg, ismd]);

  const headerLinks = HEADER_LINKS.map((props, i) => (
    <AppHeaderLink key={i} {...props} />
  ));

  const contentProps = {
    isSidebar,
    toggleSidebar,
    islg,
    ismd,
    sidebarWidth,
    isFullSidebarWidth,
    headerLinks,
  };

  return (
    <>
      <div
        className={clsx('')}
        style={{ paddingLeft: ismd ? sidebarWidth : 0 }}
      >
        <AppHeader {...contentProps} />
        {/* Routes */}
        <Routes>
          <Route path='/' element={<Trade />} />
          <Route path='/bridge-protocol' element={<BridgeProtocol />} />
        </Routes>
        <Footer />
      </div>
      <AppSideBar {...contentProps} />
    </>
  );
}

export default App;

function AppHeaderLink(props) {
  const isSwap = useMatch('/');
  // const isDefi = useMatch('/defi/*')
  const isGameFi = useMatch('/gamefi/*');
  const isNDFT = useMatch('/nft/*');

  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          'px-5 py-[0.2rem] rounded-md min-w-[60px] text-center font-[700] text-[14px] text-[#FFF] font-display',
          (['/gamefi', '/nft'].includes(props.to)
            ? isActive
            : !isGameFi && !isNDFT) && 'bg-primary-main text-[#FFF]'
        )
      }
      {...props}
    />
  );
}

const HEADER_LINKS = [
  { children: 'Swap', to: '/' },
  // { children: 'DeFi', to: '/defi' },
  { children: 'GameFi', to: '/gamefi' },
  { children: 'NFT', to: '/nft' },
];
