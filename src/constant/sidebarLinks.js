export default {
  defi: [
    {
      title: 'Dashboard',
      icon: '#dashboard',
      path: '/defi',
      soon: true,
    },
    {
      title: 'SynLend',
      icon: '#synlend',
      children: [
        {
          title: 'Lend',
          icon: '#lend',
          path: '/defi/lend',
          soon: false,
        },
        {
          title: 'My Loans',
          icon: '#myloans',
          path: '/defi/loans',
          soon: false,
        },
      ],
    },
    {
      title: 'SynMarg',
      icon: '#synmarg',
      soon: false,
      children: [
        {
          title: 'MTrade',
          icon: '#synmarg',
          path: '/defi/mtrade',
          soon: false,
        },
        {
          title: 'MAbitrage',
          icon: '#synmarg',
          path: '/defi/mabitrage',
          soon: true,
        },
      ],
    },
  ],
  gamefi: [
    {
      title: 'Gamefi link',
      icon: '#synmarg',
      path: '/gamefi',
      soon: true,
    },
  ],
  nft: [
    {
      title: 'Nft link',
      icon: '#synmarg',
      path: '/nft',
      soon: true,
    },
  ],
};
