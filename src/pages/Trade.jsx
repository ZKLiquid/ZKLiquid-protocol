import React, { useState } from 'react';

import { bridge } from '../constant/globalConstants';
import NewsLetter from '../components/NewsLetter';

import { ReactComponent as SubtractSvg } from '../assets/svg/subtract.svg';
import { ReactComponent as SwapSetSvg } from '../assets/svg/SwapSet.svg';
import { ReactComponent as MoreSvg } from '../assets/svg/more.svg';
import { ReactComponent as RepeatSvg } from '../assets/svg/repeat.svg';
import { ReactComponent as BTCSvg } from '../assets/svg/btc.svg';
import { ReactComponent as ETHSvg } from '../assets/svg/Ethereum.svg';
import { ReactComponent as DownSvg } from '../assets/svg/down.svg';

const Trade = () => {
  const options = [
    { label: 'BTC', value: 'BTC', icon: <BTCSvg /> },
    { label: 'ETH', value: 'ETH', icon: <ETHSvg /> },
  ];

  const ethOptions = [
    { label: 'ETH', value: 'ETH', icon: <ETHSvg /> },
    { label: 'BTC', value: 'BTC', icon: <BTCSvg /> },
  ];

  const [selectedItem, setSelectedItem] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(0);

  const [selectedItems, setSelectedItems] = useState(options[0]);
  const [isOpens, setIsOpens] = useState(false);
  const [inputValues, setInputValues] = useState(0);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  const handleItemClicks = (items) => {
    setSelectedItems(items);
    setIsOpens(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    console.log(`Button clicked with value: ${inputValue}`);
    // logic here for what happens when the button is clicked
  };

  return (
    <>
      <div className='text-white p-8'>
        <h3 className='heading-primary mt-6'>DEX Aggregator</h3>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8'>
          {bridge.map(({ icon, name, price, id }, index) => (
            <div className='flex items-center gap-4 bg-[#191A1F] rounded-2xl px-2'>
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

        <div className='flex items-center bg-[#191A1F] gap-4 rounded-2xl mt-5 px-2 py-3'>
          <SubtractSvg />
          <div>
            <h3 className='font-Poppins text-[24px] font-black leading-[30px]'>
              Syntrum DEX Aggregator
            </h3>
            <p className='text-[14px] leading-[20px] font-medium text-[#9BA6B7] pt-2'>
              The largest and most popular DEXs like UniSwap, PancakeSwap, and
              more all in one place. Syntrum DEX Aggregator ensures that every
              trade gets the best rate
              <a className='text-[#4DFFDF]' href='#' target='_blank'>
                Learn more about Syntrum DEX Aggregator
              </a>
            </p>
          </div>
          <div className='bg-gradient-to-b from-[#33ED8D] via-[#09BDBB] h-full p-2 rounded-xl'>
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
          <div className=''>Gride One</div>
          <div className='bg-[#191A1F] rounded-xl p-6 font-Roboto'>
            <div className=''>
              <h3>Swap</h3>
              <div className=''>
                <SwapSetSvg />
              </div>
            </div>

            <p className='text-[#979797] text-[14px] leading-[18px] mt-4'>
              From
            </p>
            <div className='mt-3 flex justify-between'>
              <div>
                <p className='leading-[32px] text-[26px] font-bold'>0.5246</p>

                <p className='leading-[18px] text-[13px] font-semibold mt-3'>
                  MAX
                </p>
              </div>
              <div className='text-right'>
                <button
                  className='bg-[#252930] py-2 px-3 gap-2 rounded-xl inline-flex items-center'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className='mr-1 flex items-center gap-2 text-[#F7931A] font-bold'>
                    {selectedItem.icon}
                    {selectedItem.label}
                  </span>
                  <span>{isOpen ? <DownSvg /> : <DownSvg />}</span>
                </button>

                {isOpen && (
                  <ul className='absolute z-10 w-full bg-[#1A1C22] rounded-xl py-1'>
                    {options.map((option) => (
                      <li
                        key={option.value}
                        className={`px-2 py-2 cursor-pointer flex gap-2 items-center text-[#F7931A] ${
                          option.value === selectedItem.value
                            ? 'bg-[#212228] rounded-lg'
                            : ''
                        }`}
                        onClick={() => handleItemClick(option)}
                      >
                        {option.icon}
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {/* <div className='flex gap-4'>
                  <h1 className='text-[#6D7A86] text-[14px]'>Balance</h1>
                  <p className='flex gap-2 items-center text-white'>
                    {selectedItem.icon}
                    {selectedItem.label}
                  </p>
                </div> */}
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  Your BTC balance: 0.6280
                </p>
              </div>
            </div>

            <div className='relative py-10'>
              <div className='flex justify-center items-center my-8 absolute bottom-0 right-0 left-0 -top-1'>
                <RepeatSvg />
              </div>
              <div className='border border-b-[1px] border-[#20212C]'></div>
            </div>

            <p className='text-[#979797] text-[14px] leading-[18px] mt-4'>To</p>
            <div className='mt-3 flex justify-between'>
              <div>
                <p className='leading-[32px] text-[26px] font-bold'>6,448.99</p>
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  $23,805.00
                </p>
              </div>
              <div className='text-right'>
                <button
                  className='bg-[#252930] py-2 px-3 gap-2 rounded-xl inline-flex items-center'
                  onClick={() => setIsOpens(!isOpens)}
                >
                  <span className='mr-1 flex items-center gap-2 text-[#FFF] font-bold'>
                    {selectedItems.icon}
                    {selectedItems.label}
                  </span>
                  <span>{isOpens ? <DownSvg /> : <DownSvg />}</span>
                </button>
                {isOpens && (
                  <ul className='absolute z-10 w-full bg-[#1A1C22] rounded-xl py-1'>
                    {ethOptions.map((option) => (
                      <li
                        key={option.value}
                        className={`px-2 py-2 cursor-pointer flex gap-2 items-center text-[#FFF] ${
                          option.value === selectedItems.value
                            ? 'bg-[#212228] rounded-lg'
                            : ''
                        }`}
                        onClick={() => handleItemClicks(option)}
                      >
                        {option.icon}
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {/* <div className='flex gap-4'>
                  <h1 className='text-[#6D7A86] text-[14px]'>Balance</h1>
                  <p className='flex gap-2 items-center text-white'>
                    {selectedItem.icon}
                    {selectedItem.label}
                  </p>
                </div> */}{' '}
                <p className='leading-[18px] text-[#979797] text-[13px] font-semibold mt-3'>
                  1 BTC= 60030.6280
                </p>
              </div>
            </div>

            <div className='bg-[#33ED8D] rounded-lg relative mt-12 max-w-[440px]'>
              <div className='bg-[#11C6B3] rounded-lg absolute -top-4 left-4 p-3'>
                <p className='text-[14px] text-bold leading-[16px] text-[#000]'>
                  Via Uniswap V3
                </p>
              </div>

              <div className='flex justify-between items-center text-[#000] font-normal px-6 pt-8 pb-6'>
                <h3 className='leading-[23px] text-[20px]'>6,448.99 </h3>
                <p className='leading-[16px] text-[14px]'>
                  Est fee: 0.004 ETH = $7.88
                </p>
              </div>
            </div>

            <div className='flex justify-between mt-12'>
              <div className='bg-[#252930] rounded-lg relative'>
                <div className='bg-[#171720] rounded-lg absolute -top-4 left-4 p-3'>
                  <p className='leading-[16px] text-[12px] font-bold text-[#979797]'>
                    Via Pancakeswap V3
                  </p>
                </div>
                <div className='text-[#FFF] font-normal px-8 pt-8 pb-2'>
                  <h3 className='leading-[23px] text-[20px]'>6,448.99 </h3>
                  <p className='leading-[16px] text-[11px] pt-1'>
                    Est fee: 0.004 ETH = $7.88
                  </p>
                </div>
              </div>

              <div className='bg-[#252930] rounded-lg relative'>
                <div className='bg-[#171720] rounded-lg absolute -top-4 left-4 p-3'>
                  <p className='leading-[16px] text-[12px] font-bold text-[#979797]'>
                    Via Uniswap V2
                  </p>
                </div>
                <div className='text-[#FFF] font-normal px-8 pt-8 pb-2'>
                  <h3 className='leading-[23px] text-[20px]'>6,448.99</h3>
                  <p className='leading-[16px] text-[11px] pt-1'>
                    Est fee: 0.004 ETH = $7.88
                  </p>
                </div>
              </div>
            </div>

            <p className='flex cursor-pointer items-center gap-3 justify-center pt-8 text-[#33ED8D] text-[16px] font-medium'>
              View More DEXs <MoreSvg />
            </p>

            <button className='text-[16px] bg-[#DC40A4] w-full rounded-lg mt-6 py-3'>
              Approve
            </button>
          </div>
        </div>

        <NewsLetter />
      </div>
    </>
  );
};
export default Trade;
