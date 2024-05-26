import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./pages/defi/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ErrorPage from "./layouts/Error.jsx";
import Home from "./pages/Home.jsx";
import Lend from "./pages/defi/Lend";
import MyLoans from "./pages/defi/MyLoans";
import Gamefi from "./pages/gamefi/Gamefi";
import NFT from "./pages/nft/NFT";

import Trade from "./pages/swap/Trade";
import Bridge from "./pages/swap/Bridge";
import Liquidity from "./pages/liquidity/Liquidity";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route exact path="/" element={<Home />} errorElement={<ErrorPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/swap">
          <Route index element={<Trade />} />
          <Route path="liquidity" element={<Liquidity />} />
          <Route path="bridge" element={<Bridge />} />
        </Route>
        {/* <Route path="/liquidity">
          <Route index element={<Liquidity />} />
        </Route> */}
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
}

export default App;
