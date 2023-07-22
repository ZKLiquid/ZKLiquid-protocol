import React, { useState } from 'react';
import clsx from 'clsx';
import { MediaQueryBreakpointEnum } from '../constant/globalConstants';
import useMediaQuery from '../hooks/useMediaQuery';

import { bridge, table } from '../constant/globalConstants';
import NewsLetter from '../components/NewsLetter';

import { ReactComponent as SubtractSvg } from '../assets/svg/subtract.svg';
import { ReactComponent as SwapSetSvg } from '../assets/svg/SwapSet.svg';
import { ReactComponent as MoreSvg } from '../assets/svg/more.svg';
import { ReactComponent as RepeatSvg } from '../assets/svg/repeat.svg';
import { ReactComponent as BTCSvg } from '../assets/svg/btc.svg';
import { ReactComponent as ETHSvg } from '../assets/svg/Ethereum.svg';
import { ReactComponent as DownSvg } from '../assets/svg/down.svg';
import SearchBar from '../components/SearchBar';
// import Pagination from '../components/Pagination';

const Trade = (props) => {
  const [tab, setTab] = useState(0);

  const islg = useMediaQuery(MediaQueryBreakpointEnum.lg);
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

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

  const [currentPage, setCurrentPage] = useState(1);

  // Assuming 'table' and 'itemsPerPage' are defined elsewhere in your code
  const itemsPerPage = 10;
  const totalPages = Math.ceil(table.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, table.length);
  const currentPageData = table.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const historyTab = (
    <>
      {islg ? (
        <>
          <div className='pt-10'>
            <div className='flex justify-between items-end'>
              <h3 className='text-[#FFFFFF] text-[16px] font-bold'>
                Top Tokens
              </h3>
              <SearchBar />
            </div>

            <div className='border border-b-[1px] border-[#20212C] my-4'></div>

            <div className='px-6 py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl'>
              <table className='min-w-full mt-6'>
                <thead className='text-[14px] px-2 py-3 text-[#6D7A86] capitalize'>
                  <tr>
                    <th scope='col' className='text-left'>
                      Token Name
                    </th>
                    <th scope='col' className='text-right'>
                      Price
                    </th>
                    <th scope='col' className='text-right'>
                      Volume (24H)
                    </th>
                    <th scope='col' className='text-right'>
                      Price Change
                    </th>
                  </tr>
                </thead>
                <tbody className='text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap'>
                  {table.map((row, index) => (
                    <tr key={index}>
                      <td className='py-4 flex items-center gap-2 text-[14px]'>
                        <img src={row.icon} alt='' />
                        {row.tokenName}
                      </td>
                      <td className='text-right'>
                        <p>{row.price}</p>
                      </td>
                      <td className='text-right'>
                        <p>{row.volume}</p>
                      </td>
                      <td className='text-right text-[#23DB9F]'>
                        {row.priceChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              /> */}
            </div>
          </div>{' '}
        </>
      ) : (
        <>
          <div className=''>
            <div className='flex justify-between gap-4 items-end'>
              <h3 className='text-[#FFFFFF] md:text-[16px] text-[13px] font-bold'>
                Top Tokens
              </h3>
              <SearchBar />
            </div>

            <div className='border border-b-[1px] border-[#20212C] my-4'></div>

            <div className='px-3 py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl'>
              <table className='min-w-full mt-6'>
                <thead className='text-[14px] px-2 py-3 text-[#6D7A86] capitalize'>
                  <tr>
                    <th scope='col' className='text-left'>
                      Token Name
                    </th>
                    <th scope='col' className='text-right'>
                      Price
                    </th>
                    <th scope='col' className='text-right'>
                      Volume (24H)
                    </th>
                    <th scope='col' className='text-right'>
                      Price Change
                    </th>
                  </tr>
                </thead>
                <tbody className='text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap'>
                  {table.map((row, index) => (
                    <tr key={index}>
                      <td className='py-4 flex items-center gap-2 text-[14px]'>
                        <img src={row.icon} alt='' />
                        {row.tokenName}
                      </td>
                      <td className='text-right'>
                        <p>{row.price}</p>
                      </td>
                      <td className='text-right'>
                        <p>{row.volume}</p>
                      </td>
                      <td className='text-right text-[#23DB9F]'>
                        {row.priceChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>{' '}
        </>
      )}
    </>
  );

  const swapTab = (
    <>
      {islg ? (
        <>
          <div className='bg-[#191A1F] rounded-xl p-6 font-Roboto mt-10'>
            <div className='flex items-center justify-center gap-2'>
              {/* <div className='flex justify-between'> */}
              <h3>Swap</h3>
              <div className=''>
                <SwapSetSvg />
              </div>
              {/* </div> */}
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

            <div className='bg-gradient-to-b from-[#33ED8D] to-[#09BDBB] rounded-lg relative mt-12 max-w-[440px]'>
              <div className='bg-gradient-to-b from-[#11C6B3] to-[#7A6CAC] rounded-lg absolute -top-4 left-4 p-3'>
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

            <button className='text-[16px] bg-gradient-to-r from-[#DC40A4] to-[#6749D5] w-full rounded-lg mt-6 py-3'>
              Approve
            </button>
          </div>{' '}
        </>
      ) : (
        <>
          <div className='bg-[#191A1F] rounded-xl p-3 font-Roboto'>
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

            <div className='bg-gradient-to-b from-[#33ED8D] to-[#09BDBB] rounded-lg relative mt-12 max-w-[440px]'>
              <div className='bg-gradient-to-b from-[#11C6B3] to-[#7A6CAC] rounded-lg absolute -top-4 left-4 p-3'>
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

            <div className='flex justify-between mt-12 gap-2'>
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

            <button className='text-[16px] bg-gradient-to-r from-[#DC40A4] to-[#6749D5] w-full rounded-lg mt-6 py-3'>
              Approve
            </button>
          </div>{' '}
        </>
      )}
    </>
  );

  return (
    <>
      <div className='text-white md:p-8 p-4'>
        <h3 className='heading-primary'>DEX Aggregator</h3>

        <div className='w-full'>
          <div className='flex overflow-x-scroll flex-shrink-0 scroll-track-hide gap-4 pt-8'>
            {bridge.map(({ icon, name, price, id }, index) => (
              <div
                key={index}
                className='flex w-full items-center min-w-[272px] gap-4 bg-[#191A1F] rounded-xl p-3 hover:bg-opacity-80'
              >
                <img src={icon} alt='' />
                <div>
                  <p className='text-[#6D7A86] text-[14px] font-medium'>
                    {name}
                  </p>
                  <div className='flex gap-3 items-end mt-1'>
                    <p className='text-[16px] font-semibold'>{price}</p>
                    <p className='text-[12px] text-[#34D399] font-bold'>{id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='md:flex flex-wrap md:flex-nowrap items-center bg-[#191A1F] gap-4 rounded-2xl mt-5 px-2 py-3'>
          <SubtractSvg />
          <div>
            <h3 className='font-Poppins md:text-[24px] text-[20px] font-black leading-[30px] mt-4 md:mt-0'>
              Syntrum DEX Aggregator
            </h3>
            <p className='text-[14px] leading-[20px] font-medium text-[#9BA6B7] pt-2'>
              The largest and most popular DEXs like UniSwap, PancakeSwap, and
              more all in one place. Syntrum DEX Aggregator ensures that every
              trade gets the best rate
              <a
                className='bg-clip-text bg-gradient-to-r ml-2 text-transparent from-[#4DFFDF] to-[#4DA1FF]'
                href='#'
                target='_blank'
              >
                Learn more about Syntrum DEX Aggregator
              </a>
            </p>
          </div>
          <div className='bg-gradient_custom h-full p-4 rounded-xl mt-4 md:mt-0'>
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

        {islg ? (
          <>
            <div className={clsx('flex gap-4 pb-4')}>
              <div className='flex-1'>{historyTab}</div>
              <div className='flex-1'>{swapTab}</div>
            </div>
          </>
        ) : (
          <>
            <div className='flex gap-4 my-6'>
              {[{ label: 'History' }, { label: 'Swap' }].map(
                ({ label }, index) => {
                  return (
                    <button
                      key={index}
                      className={clsx(
                        'p-2 rounded-lg flex-1 font-bold text-sm',
                        tab === index ? 'bg-[#2769E4]' : 'bg-[#191A1F]'
                      )}
                      onClick={() => setTab(index)}
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>
            {[<>{historyTab}</>, <>{swapTab}</>][tab]}
          </>
        )}

        <NewsLetter />
      </div>
    </>
  );
};
export default Trade;

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className='flex items-center justify-center mt-6'>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className='px-2 py-1 text-[#23DB9F] hover:text-white'
      >
        {'<= Previous'}
      </button>

      <span
        onClick={() => handlePageClick(1)}
        className={`px-2 py-1 ${
          currentPage === 1 ? 'text-white bg-[#23DB9F]' : 'text-[#6D7A86]'
        } hover:text-white hover:bg-[#23DB9F] cursor-pointer`}
      >
        {1}
      </span>

      {currentPage > 4 && <span className='px-2 py-1 text-[#6D7A86]'>...</span>}

      {pageNumbers.map((page) => {
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <span
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-2 py-1 ${
                page === currentPage
                  ? 'text-white bg-[#23DB9F]'
                  : 'text-[#6D7A86]'
              } hover:text-white hover:bg-[#23DB9F] cursor-pointer`}
            >
              {page}
            </span>
          );
        }
        return null;
      })}

      {currentPage < totalPages - 3 && (
        <span className='px-2 py-1 text-[#6D7A86]'>...</span>
      )}

      {totalPages > 1 && (
        <span
          onClick={() => handlePageClick(totalPages)}
          className={`px-2 py-1 ${
            currentPage === totalPages
              ? 'text-white bg-[#23DB9F]'
              : 'text-[#6D7A86]'
          } hover:text-white hover:bg-[#23DB9F] cursor-pointer`}
        >
          {totalPages}
        </span>
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className='px-2 py-1 text-[#23DB9F] hover:text-white'
      >
        {'Next =>'}
      </button>
    </div>
  );
};
