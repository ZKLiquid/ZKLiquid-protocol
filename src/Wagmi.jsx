import React from "react";

// wagmi imports
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  avalancheFuji,
  sepolia,
  // polygonZkEvmCardona,
  // arbitrumSepolia,
  bscTestnet,
  polygonAmoy,
  // baseSepolia,
} from "wagmi/chains";

import { walletConnect } from "wagmi/connectors";

const addedChains = [
  avalancheFuji,
  sepolia,
  // arbitrumSepolia,
  bscTestnet,
  // polygonZkEvmCardona,
  polygonAmoy,
  // baseSepolia,
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
    // [arbitrumSepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [bscTestnet.id]: http(),
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
