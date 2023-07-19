import React from 'react';

import { bridge } from '../constant/globalConstants';
import NewsLetter from '../components/NewsLetter';

import { ReactComponent as SubtractSvg } from '../assets/svg/subtract.svg';
import { ReactComponent as SwapSetSvg } from '../assets/svg/SwapSet.svg';
import { ReactComponent as MoreSvg } from '../assets/svg/more.svg';

const Trade = () => {
  return (
    <>
      <div className='text-white p-8'>
        <h3 className='heading-primary mt-6'>DEX Aggregator</h3>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 max-w-[1136px]'>
          {bridge.map(({ icon, name, price, id }, index) => (
            <div className='flex items-center gap-4 bg-[#191A1F] rounded-2xl px-2 max-w-[272px]'>
              <img src={icon} alt='' />
              <div>
                <p className='text-[#6D7A86] text-[14px] font-medium'>{name}</p>
                <div className='flex gap-3 items-end mt-1'>
                  <p className='text-[16px] font-semibold'>{price}</p>
                  <p className='text-[12px] text-[#34D399] font-bold'>{id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center bg-[#191A1F] max-w-[1136px] gap-4 rounded-2xl mt-5 px-2 py-3'>
          <SubtractSvg />
          <div>
            <h3 className='font-Poppins text-[24px] font-black leading-[30px]'>
              Syntrum DEX Aggregator
            </h3>
            <p className='text-[14px] leading-[20px] font-medium text-[#9BA6B7] pt-2 max-w-[794px]'>
              The largest and most popular DEXs like UniSwap, PancakeSwap, and
              more all in one place. Syntrum DEX Aggregator ensures that every
              trade gets the best rate
              <a className='text-[#4DFFDF]' href='#' target='_blank'>
                Learn more about Syntrum DEX Aggregator
              </a>
            </p>
          </div>
          <div className='bg-gradient-to-b from-[#33ED8D] via-[#09BDBB] max-w-[163px] h-full p-2 rounded-xl'>
            <p className='text-[14px] font-bold leading-[20px]'>
              Add Bridge Liquidity
            </p>
            <p className='text-[14px] font-bold leading-[20px] mt-2'>
              Up to{' '}
              <span className='text-[#33ED8D] text-[30px] font-bold'>
                78.0%
              </span>
            </p>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-4 pt-6'>
          <div className='max-w-[623px]'>Gride One</div>
          <div className='max-w-[492px] bg-[#191A1F] rounded-xl p-6 font-Roboto'>
            <div className=''>
              <h3>Swap</h3>
              <div className=''>
                <SwapSetSvg />
              </div>
            </div>

            <p className='text-[#979797] text-[14px] leading-[18px] mt-4'>
              From
            </p>
            <div className='mt-4 flex justify-between'>
              <div>
                <p className='leading-[32px] text-[26px] font-bold'>0.5246</p>
                <p className='leading-[18px] text-[13px] font-semibold mt-3'>
                  MAX
                </p>
              </div>
              <div className='text-right'>
                <p>0.5246</p>
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  Your BTC balance: 0.6280
                </p>
              </div>
            </div>

            <p className='text-[#979797] text-[14px] leading-[18px] mt-4'>To</p>
            <div className='mt-4 flex justify-between'>
              <div>
                <p className='leading-[32px] text-[26px] font-bold'>6,448.99</p>
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  $23,805.00
                </p>
              </div>
              <div className='text-right'>
                <p>0.5246</p>
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  1 BTC= 60030.6280
                </p>
              </div>
            </div>

            <div>
              <div>
                <p>Via Uniswap V3</p>
              </div>
              <div>
                <h3>6,448.99 </h3>
                <p>Est fee: 0.004 ETH = $7.88</p>
              </div>
            </div>

            <div>
              <div>
                <div>
                  <p>Via Pancakeswap V3</p>
                </div>
                <div>
                  <h3>6,448.99 </h3>
                  <p>Est fee: 0.004 ETH = $7.88</p>
                </div>
              </div>

              <div>
                <div>
                  <p>Via Uniswap V2</p>
                </div>
                <div>
                  <h3>6,448.99</h3>
                  <p>Est fee: 0.004 ETH = $7.88</p>
                </div>
              </div>
            </div>

            <p>
              View More DEXs <MoreSvg />
            </p>

            <button>Approve</button>
          </div>
        </div>

        <NewsLetter />
      </div>
    </>
  );
};
export default Trade;
