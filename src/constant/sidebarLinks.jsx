import {
  BitcoinRefresh,
  Bubble,
  Home2,
  PercentageCircle,
  Repeat,
  EmptyWalletAdd,
  Activity,
  Game,
  Image,
  Link2,
  Data,
  BuyCrypto,
} from "iconsax-react";

export default [
  {
    title: "Bridge",
    path: "/swap",
    links: [
      {
        title: "Multichain Bridge",
        icon: <Repeat />,
        path: "/swap",
      },
      // {
      //   title: "Liquidity Setup",
      //   icon: <Bubble />,
      //   path: "swap/liquidity",
      // },

      {
        title: "Faucet",
        icon: <BuyCrypto />,
        path: "/swap/faucet",
      },

      // {
      //   title: "Data Link",
      //   icon: <Data />,
      //   path: "/swap/bridge",
      // },
      // {
      //   title: "Chain Link",
      //   icon: <Link2 />,
      //   path: "/swap/bridge",
      // },
    ],
  },

  // {
  //   title: "liquidity",
  //   path: "/liquidity",
  //   links: [
  //     {
  //       title: "Liquidity Setup",
  //       icon: <Bubble />,
  //       path: "/liquidity",
  //     },
  //   ],
  // },
  {
    title: "DeFi",
    path: "/defi",
    links: [
      {
        title: "Dashboard",
        icon: <Home2 />,
        path: "/defi",
      },
      {
        title: "SynLend",
        icon: <BitcoinRefresh />,
        children: [
          {
            title: "Lend",
            icon: <PercentageCircle />,
            path: "/defi/lend",
          },
          {
            title: "My Loans",
            icon: <EmptyWalletAdd />,
            path: "/defi/loans",
          },
        ],
      },
      {
        title: "SynMarg",
        icon: <Activity />,
        children: [
          {
            title: "MTrade",
            icon: <Activity />,
            path: "/defi/mtrade",
          },
          {
            title: "MAbitrage",
            icon: <Activity />,
            path: "/defi/mabitrage",
          },
        ],
      },
    ],
  },
  {
    title: "GameFi",
    path: "/gamefi",
    links: [
      {
        title: "GameFi link",
        icon: <Game />,
        path: "/gamefi",
      },
    ],
  },
  {
    title: "NFT",
    path: "/nft",
    links: [
      {
        title: "Nft link",
        icon: <Image />,
        path: "/nft",
      },
    ],
  },
];
