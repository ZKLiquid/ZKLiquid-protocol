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
} from 'iconsax-react';

export default [
  {
    title: 'Swap',
    path: '/swap',
    links: [
      {
        title: 'Trade',
        // icon: <Repeat />,
        path: '/swap',
      },
      {
        title: 'Bridge Liquidity',
        // icon: <Bubble />,
        path: '/swap/bridge',
      },
    ],
  },
  {
    title: 'DeFi',
    path: '/defi',
    links: [
      {
        title: 'Dashboard',
        // icon: <Home2 />,
        path: '/defi',
      },
      {
        title: 'SynLend',
        // icon: <BitcoinRefresh />,
        children: [
          {
            title: 'Lend',
            // icon: <PercentageCircle />,
            path: '/defi/lend',
          },
          {
            title: 'My Loans',
            // icon: <EmptyWalletAdd />,
            path: '/defi/loans',
          },
        ],
      },
      {
        title: 'SynMarg',
        // icon: <Activity />,
        children: [
          {
            title: 'MTrade',
            // icon: <Activity />,
            path: '/defi/mtrade',
          },
          {
            title: 'MAbitrage',
            // icon: <Activity />,
            path: '/defi/mabitrage',
          },
        ],
      },
    ],
  },
  {
    title: 'GameFi',
    path: '/gamefi',
    links: [
      {
        title: 'GameFi link',
        // icon: <Game />,
        path: '/gamefi',
      },
    ],
  },
  {
    title: 'NFT',
    path: '/nft',
    links: [
      {
        title: 'Nft link',
        // icon: <Image />,
        path: '/nft',
      },
    ],
  },
];
