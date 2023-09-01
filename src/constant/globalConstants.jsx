import tailwindDefaultTheme from 'tailwindcss/defaultTheme';
import bridges from '../assets/svg/bridge.svg';
import numbers from '../assets/svg/number.svg';
import users from '../assets/svg/users.svg';
import syntrum from '../assets/svg/syntrum coin.svg';
import tether from '../assets/svg/tether-coin.svg';
import binance from '../assets/svg/Binance-Coin.svg';

export const NETWORK_COINS = {
  'ethereum': {
    name: 'Ethereum Token',
    symbol: 'ETH',
    decimals: 18
  },
  'bnb': {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18
  }
}

export const table = [
  {
    icon: syntrum,
    tokenName: 'Syntrum (SYT)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: tether,
    tokenName: 'Tether (USDT)',
    price: '23.4',
    volume: '21.21M',
    priceChange: '1.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
  {
    icon: binance,
    tokenName: 'Binance (BNB)',
    price: '10.4',
    volume: '21.21M',
    priceChange: '0.52%',
  },
];

export const bridge = [
  {
    icon: bridges,
    name: 'Bridge TVL (USD)',
    price: '$118.65k',
    id: '7d : +2,425',
  },
  {
    icon: bridges,
    name: 'Bridge APR',
    price: '$11.41k',
    id: '7d: +125.5',
  },
  {
    icon: numbers,
    name: 'Number of DEXs Integrated',
    price: '114',
    id: '7d: +12',
  },
  {
    icon: users,
    name: 'Number of Users',
    price: '642',
    id: '7d : +2,425',
  },
];

export const MediaQueryBreakpointEnum = {
  '2xl': `(min-width: ${tailwindDefaultTheme.screens['2xl']})`,
  lg: `(min-width: ${tailwindDefaultTheme.screens.lg})`,
  md: `(min-width: ${tailwindDefaultTheme.screens.md})`,
  sm: `(min-width: ${tailwindDefaultTheme.screens.sm})`,
  xl: `(min-width: ${tailwindDefaultTheme.screens.xl})`,
};

export const APP_SIDEBAR_WIDTH = 240;
export const APP_SIDEBAR_MOBILE_WIDTH = 70;
