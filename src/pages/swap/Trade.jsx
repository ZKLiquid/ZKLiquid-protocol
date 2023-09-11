import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { bridge } from '@/constant/globalConstants';
import NewsLetter from '@/components/NewsLetter';

import SwapCard from '../../components/SwapCard';
import TopTokensList from '../../components/TopTokensList';
import { Tab } from '@headlessui/react';

import { useMediaQuery } from 'usehooks-ts';
import axios from 'axios';

import bridges from '@/assets/svg/bridge.svg';
import numbers from '@/assets/svg/number.svg';
import users from '@/assets/svg/users.svg';

function Trade() {
  const isMd = useMediaQuery('(min-width: 768px)');
  const [selectedToken, setSelectedToken] = useState(null);
  const [statsInfo, setStatsInfo] = useState(0);
  const [isGetInfo, setGetInfo] = useState(false);

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
  }

  useEffect(() => {
    if(isGetInfo === false) {
      axios
        .get('https://v001.wallet.syntrum.com/wallet/getGeneralInfo')
        .then((res) => {
          setStatsInfo(res.data);
          setGetInfo(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return (
    <>
      <div className="text-white">
        <h1 className="heading-primary">DEX Aggregator</h1>

        <div className="flex flex-shrink-0 gap-4 mt-8 overflow-auto scroll-track-hide">
          <div
            className="inline-flex items-center w-full min-w-[272px] gap-3 bg-dark-400 rounded-xl p-3"
          >
            <img src={bridges} alt="" />
            <div>
              <p className="text-[#6D7A86] text-sm font-medium">Bridge TVL (USD)</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-base font-semibold leading-5">$0</p>
                <p className="text-xs text-[#34D399] font-bold">7d : 0</p>
              </div>
            </div>
          </div>

          <div
            className="inline-flex items-center w-full min-w-[272px] gap-3 bg-dark-400 rounded-xl p-3"
          >
            <img src={bridges} alt="" />
            <div>
              <p className="text-[#6D7A86] text-sm font-medium">Bridge APR</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-base font-semibold leading-5">$0</p>
                <p className="text-xs text-[#34D399] font-bold">7d: 0</p>
              </div>
            </div>
          </div>

          <div
            className="inline-flex items-center w-full min-w-[272px] gap-3 bg-dark-400 rounded-xl p-3"
          >
            <img src={numbers} alt="" />
            <div>
              <p className="text-[#6D7A86] text-sm font-medium">Number of DEXs Integrated</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-base font-semibold leading-5">{statsInfo.dexesNumber}</p>
                <p className="text-xs text-[#34D399] font-bold">7d: {statsInfo.dexesNumber7days > 0 ? `+${statsInfo.dexesNumber7days}` : `${statsInfo.dexesNumber7days}`}</p>
              </div>
            </div>
          </div>

          <div
            className="inline-flex items-center w-full min-w-[272px] gap-3 bg-dark-400 rounded-xl p-3"
          >
            <img src={users} alt="" />
            <div>
              <p className="text-[#6D7A86] text-sm font-medium">Number of Users</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-base font-semibold leading-5">{statsInfo.uniqueAddresses}</p>
                <p className="text-xs text-[#34D399] font-bold">7d: {statsInfo.uniqueAddresses7days > 0 ? `+${statsInfo.uniqueAddresses7days}` : `${statsInfo.uniqueAddresses7days}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-wrap items-center gap-4 p-4 mt-5 mb-6 md:flex md:flex-nowrap bg-dark-400 rounded-2xl lg:pl-6">
          <svg
            className="flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM30.0022 30.0026C33.0109 26.9938 37.507 25.85 43.2796 25.85H56.7196C62.4922 25.85 66.9883 26.9938 69.997 30.0026C73.0058 33.0113 74.1496 37.5074 74.1496 43.28V56.72C74.1496 62.4926 73.0058 66.9887 69.997 69.9974C66.9883 73.0062 62.4922 74.15 56.7196 74.15H43.2796C37.507 74.15 33.0109 73.0062 30.0022 69.9974C26.9934 66.9887 25.8496 62.4926 25.8496 56.72V43.28C25.8496 37.5074 26.9934 33.0113 30.0022 30.0026ZM32.477 32.4774C30.4458 34.5087 29.3496 37.8526 29.3496 43.28V45.45H42.8431C43.7451 41.6276 47.6728 38.9878 51.8933 40.1082C54.367 40.7586 56.3579 42.7483 57.0102 45.2212C57.0309 45.2975 57.0502 45.3738 57.0682 45.45H70.6496V43.28C70.6496 37.8526 69.5534 34.5087 67.5222 32.4774C65.4909 30.4462 62.147 29.35 56.7196 29.35H43.2796C37.8522 29.35 34.5083 30.4462 32.477 32.4774ZM29.3496 56.72V48.95H42.8884C43.2744 50.4646 44.1381 51.77 45.2863 52.7243V56.4535C45.2863 59.03 47.3765 61.1202 49.953 61.1202C52.5295 61.1202 54.6197 59.03 54.6197 56.4535V52.7243C55.7678 51.77 56.6316 50.4646 57.0176 48.95H70.6496V56.72C70.6496 62.1474 69.5534 65.4913 67.5222 67.5226C65.4909 69.5538 62.147 70.65 56.7196 70.65H43.2796C37.8522 70.65 34.5083 69.5538 32.477 67.5226C30.4458 65.4913 29.3496 62.1474 29.3496 56.72ZM50.9968 43.4914C48.4367 42.8109 46.1496 44.7062 46.1496 47.1202C46.1496 47.3073 46.1656 47.4817 46.1914 47.6238L46.1977 47.6582L46.2025 47.6928C46.3591 48.8043 47.0192 49.7632 47.9592 50.3466L48.7863 50.86V56.4535C48.7863 57.097 49.3095 57.6202 49.953 57.6202C50.5965 57.6202 51.1197 57.097 51.1197 56.4535V50.86L51.9468 50.3466C52.8867 49.7632 53.5469 48.8043 53.7034 47.6928L53.7059 47.6755L53.7087 47.6582C53.7883 47.1644 53.7713 46.6473 53.6313 46.134L53.6269 46.1179C53.2972 44.862 52.2578 43.8225 51.002 43.4928L50.9968 43.4914Z"
              fill="url(#paint0_linear_91_5791)"
              fillOpacity="0.7"
            />
            <defs>
              <linearGradient
                id="paint0_linear_91_5791"
                x1="-157.69"
                y1="43.0548"
                x2="30.1588"
                y2="230.963"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1FF7FD" />
                <stop offset="0.49074" stopColor="#B33BF6" />
                <stop offset="0.845877" stopColor="#FF844C" />
                <stop offset="1" stopColor="#FF844B" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <h3 className="text-[28px] font-bold mt-4 md:mt-0">
              Syntrum DEX Aggregator
            </h3>
            <p className="mt-2 text-dark-100">
              The largest and most popular DEXs like UniSwap, PancakeSwap, and
              more all in one place. Syntrum DEX Aggregator ensures that every
              trade gets the best rate
              <a
                className="bg-clip-text bg-gradient-to-r ml-2 text-transparent from-[#4DFFDF] to-[#4DA1FF]"
                href="https://docs.syntrum.com/key-products/syntrum-dex-aggregator"
                target="_blank"
              >
                Learn more about Syntrum DEX Aggregator
              </a>
            </p>
          </div>
          <div className="flex-shrink-0 h-full p-4 mt-4 bg-gradient_custom rounded-xl md:mt-0">
            <p className="text-sm font-bold">Add Bridge Liquidity</p>
            <p className="mt-5 text-sm font-bold">
              Up to{' '}
              <span className="text-[#33ED8D] text-[34px] font-bold">
                78.0%
              </span>
            </p>
          </div>
        </div>

        {isMd ? (
          <div className="grid items-start grid-cols-2 gap-6">
            <TopTokensList onTokenSelect={handleTokenSelect} />
            <SwapCard selectedToken={selectedToken} />
          </div>
        ) : (
          <Tab.Group>
            <Tab.List className="flex gap-3">
              <Tab
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2 text-sm font-medium leading-5 text-white',
                    'ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1',
                    selected ? 'bg-[#2769E4] shadow' : 'bg-dark-300'
                  )
                }
              >
                Swap
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2 text-sm font-medium leading-5 text-white',
                    'ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1',
                    selected ? 'bg-[#2769E4] shadow' : 'bg-dark-300'
                  )
                }
              >
                History
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <SwapCard selectedToken={selectedToken} />
              </Tab.Panel>
              <Tab.Panel>
                <TopTokensList onTokenSelect={handleTokenSelect} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        )}

        <NewsLetter />
      </div>
    </>
  );
}

export default Trade;
