import clsx from 'clsx';
import { useEffect } from 'react';
import { NavLink, Navigate, Route, Routes, useMatch } from 'react-router-dom';

import useToggle from './hooks/useToggle';
import useMediaQuery from './hooks/useMediaQuery';
import 'react-toastify/dist/ReactToastify.css';
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
import 'react-toastify/dist/ReactToastify.css';

// wagmi imports
import { WagmiConfig, createConfig, configureChains } from 'wagmi';

import { mainnet, polygon, bsc } from 'wagmi/chains';

import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ToastContainer } from 'react-toastify';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)

// TODO: .env file
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, bsc],
  [
    infuraProvider({ apiKey: 'ac546be7d92f46f5bbd794a14f4fd707' }),
    publicProvider(),
  ]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '5fd254e3935b5aede91466b0037df4b9',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

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
      <WagmiConfig config={config}>
        <div
          className={clsx('overflow-x-clip')}
          style={{ paddingLeft: ismd ? sidebarWidth : 0 }}
        >
          <AppHeader {...contentProps} />
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="/swap" replace />} />
            <Route path="/swap" element={<Trade />} />
            <Route path="/bridge-protocol" element={<BridgeProtocol />} />
          </Routes>
          <Footer />
          <AppSideBar {...contentProps} />
        </div>
      </WagmiConfig>

      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}

export default App;

function AppHeaderLink(props) {
  const isSwap = useMatch('/swap');
  const isDefi = useMatch('/defi/*');
  const isGameFi = useMatch('/gamefi/*');
  const isNDFT = useMatch('/nft/*');

  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          'px-5 mt-1 rounded-md py-1.5 text-center font-bold text-[14px] text-[#FFF]',
          (['/gamefi', '/nft', '/defi'].includes(props.to)
            ? isActive
            : !isGameFi && !isNDFT && !isDefi) && 'bg-[#2769E4] text-[#FFF]'
        )
      }
      {...props}
    />
  );
}

const HEADER_LINKS = [
  { children: 'Swap', to: '/swap' },
  { children: 'DeFi', to: '/defi' },
  { children: 'GameFi', to: '/gamefi' },
  { children: 'NFT', to: '/nft' },
];
