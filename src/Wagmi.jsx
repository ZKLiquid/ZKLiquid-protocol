import React from "react";

// wagmi imports
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  sepolia,
  avalancheFuji,
  polygonZkEvmCardona,
  polygonAmoy,
  baseSepolia,
} from "wagmi/chains";

import { walletConnect } from "wagmi/connectors";

const addedChains = [
  sepolia,
  avalancheFuji,
  polygonZkEvmCardona,
  polygonAmoy,
  baseSepolia,
];

// Set up wagmi config
export const config = createConfig({
  chains: addedChains,
  connectors: [
    walletConnect({ projectId: "35c6df36716ecbd04dcc4cedba364876" }),
  ],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/ZA8wYWOwu6uSKNWkXEw-715wbvPwDmWv"
    ),
    [avalancheFuji.id]: http(),
    // [mainnet.id]: http(),
    // [bsc.id]: http(
    //   "https://rpc.ankr.com/bsc/3c94f0b21c3183522e817dc726cdad596439d04df98829aaf291b8b661564f6b"
    // ),
  },
});

const queryClient = new QueryClient();

function Wagmi({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Wagmi;
