// import clsx from 'clsx';
// import { useEffect } from 'react';
// import { NavLink, Navigate, Routes, useMatch } from 'react-router-dom';

// import useToggle from './hooks/useToggle';
// import useMediaQuery from './hooks/useMediaQuery';
import 'react-toastify/dist/ReactToastify.css';
// import {
//   APP_SIDEBAR_MOBILE_WIDTH,
//   APP_SIDEBAR_WIDTH,
//   MediaQueryBreakpointEnum,
// } from './constant/globalConstants';

// import AppHeader from './AppHeader';
// import AppSideBar from './AppSideBar';

// import Trade from './pages/Trade';
// import BridgeProtocol from './pages/BridgeProtocol';
// import Footer from './common/Footer';
// import { ToastContainer } from 'react-toastify';

// import Wagmi from './Wagmi';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Dashboard from './pages/defi/Dashboard';
import DashboardLayout from './layouts/DashboardLayout.jsx';

import ErrorPage from './layouts/Error.jsx';
import Home from './pages/Home.jsx';
import Lend from './pages/defi/Lend';
import MyLoans from './pages/defi/MyLoans';
import Gamefi from './pages/gamefi/Gamefi';
import NFT from './pages/nft/NFT';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route exact path="/" element={<Home />} errorElement={<ErrorPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/defi">
          <Route index element={<Dashboard />} />
          <Route path="lend" element={<Lend />} />
          <Route path="loans" element={<MyLoans />} />
        </Route>
        <Route path="/gamefi">
          <Route index element={<Gamefi />} />
        </Route>
        <Route path="/nft">
          <Route index element={<NFT />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
  // const islg = useMediaQuery(MediaQueryBreakpointEnum.xl);
  // const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);
  // const [isSidebar, toggleSidebar, setSidebar] = useToggle(islg || false);

  // const sidebarWidth = !ismd
  //   ? APP_SIDEBAR_WIDTH
  //   : isSidebar
  //   ? APP_SIDEBAR_WIDTH
  //   : APP_SIDEBAR_MOBILE_WIDTH;
  // const isFullSidebarWidth = sidebarWidth === APP_SIDEBAR_WIDTH;

  // useEffect(() => {
  //   setSidebar(islg || false);
  // }, [islg, ismd]);

  // const headerLinks = HEADER_LINKS.map((props, i) => (
  //   <AppHeaderLink key={i} {...props} />
  // ));

  // const contentProps = {
  //   isSidebar,
  //   toggleSidebar,
  //   islg,
  //   ismd,
  //   sidebarWidth,
  //   isFullSidebarWidth,
  //   headerLinks,
  // };

  // return (
  //   <>
  //     <Wagmi>
  //       <div
  //         className={clsx('overflow-x-clip')}
  //         style={{ paddingLeft: ismd ? sidebarWidth : 0 }}
  //       >
  //         <AppHeader {...contentProps} />
  //         {/* Routes */}
  //         <Routes>
  //           <Route path="/" element={<Navigate to="/swap" replace />} />
  //           <Route path="/swap" element={<Trade />} />
  //           <Route path="/bridge-protocol" element={<BridgeProtocol />} />
  //         </Routes>
  //         <Footer />
  //         <AppSideBar {...contentProps} />
  //       </div>
  //     </Wagmi>

  //     <ToastContainer position="bottom-right" theme="dark" />
  //   </>
  // );
}

export default App;

// function AppHeaderLink(props) {
//   const isSwap = useMatch('/swap');
//   const isDefi = useMatch('/defi/*');
//   const isGameFi = useMatch('/gamefi/*');
//   const isNDFT = useMatch('/nft/*');

//   return (
//     <NavLink
//       className={({ isActive }) =>
//         clsx(
//           'px-5 mt-1 rounded-md py-1.5 text-center font-bold text-[14px] text-[#FFF]',
//           (['/gamefi', '/nft', '/defi'].includes(props.to)
//             ? isActive
//             : !isGameFi && !isNDFT && !isDefi) && 'bg-[#2769E4] text-[#FFF]'
//         )
//       }
//       {...props}
//     />
//   );
// }

// const HEADER_LINKS = [
//   { children: 'Swap', to: '/swap' },
//   { children: 'DeFi', to: '/defi' },
//   { children: 'GameFi', to: '/gamefi' },
//   { children: 'NFT', to: '/nft' },
// ];
