import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { NETWORK_COINS } from '@/constant/globalConstants';
import SearchBar from '@/components/SearchBar';

import { useNetwork } from 'wagmi';

const chainAlliases = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'matic-network',
};

function TopTokensList({ onTokenSelect }) {
  const { chain } = useNetwork();
  const [tokens, setTokens] = useState([]);
  const [keyword, setKeyword] = useState('');

  const handleTokenClick = (token) => {
    onTokenSelect(token);
  }

  const onChangeKeyword = (keyword) => {
    setKeyword(keyword);
  }

  useEffect(() => {
    const platformId = chain ? chainAlliases[chain.id] : 'ethereum';
    const query = keyword ? `?search=${keyword}` : '';

    axios
      .get(
        `https://v001.wallet.syntrum.com/wallet/swapAssets/${platformId}${query}`
      )
      .then((res) => {
        setTokens(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chain, keyword]);

  return (
    <div className="pt-10">
      <div className="flex items-end justify-between ">
        <div className='flex justify-start gap-2 p-1 border-[1px] border-white rounded-full'>
          <button 
            className="text-[#FFFFFF] text-[16px] px-[15px] py-[10px] rounded-full font-bold"
            style={{ background: 'linear-gradient(135.01deg, rgba(31, 247, 253, 0.7) -57.3%, rgba(179, 59, 246, 0.7) 34.9%, rgba(255, 132, 76, 0.7) 101.62%, rgba(255, 132, 75, 0.7) 130.58%)' }}
          >
            Top Tokens
          </button>
          <button 
            className="text-[#FFFFFF] text-[16px] px-[15px] py-[10px] rounded-full font-bold hover:bg-dark-300"
          >
            Trade History
          </button>
        </div>
        <SearchBar onChangeKeyword={onChangeKeyword} />
      </div>

      <div className="border border-b-[1px] border-[#20212C] my-4"></div>

      <div className="px-6 py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl pb-14">
        <table className="min-w-full mt-2">
          <thead className="text-[12px] font-bold px-2 py-3 text-[#FFF] capitalize">
            <tr>
              <th scope="col" className="text-left">
                Token Name
              </th>
              <th scope="col" className="text-right">
                Price
              </th>
              <th scope="col" className="text-right">
                Volume (24H)
              </th>
              <th scope="col" className="text-right">
                Price Change
              </th>
            </tr>
          </thead>

          <tbody className="text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap">
            {tokens.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b-[2px] border-[#20212C]">
                <td className="py-4 flex items-center gap-2 text-[14px] cursor-pointer hover:text-[#23DB9F]" onClick={() => handleTokenClick(row)}>
                  {row?.type === 'coin' ? (
                    <img
                      className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                      src={`https://v001.wallet.syntrum.com/images/${row.platformId}/currency/24/icon.png`}
                      alt=""
                    />
                  ) : (
                    <img
                      className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                      src={`https://v001.wallet.syntrum.com/images/${
                        chain ? chainAlliases[chain.id] : 'ethereum'
                      }/contract/${row?.tokenData.tokenAddress}/24/icon.png`}
                      alt=""
                    />
                  )}
                  <div className='max-w-[250px]'>
                    <p className='overflow-hidden text-ellipsis whitespace-nowrap'>
                      {row?.type === 'coin' ? NETWORK_COINS[row?.platformId].symbol : `${row?.tokenData.name} (${row?.tokenData.symbol})`}
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  {/* <p>{row.price}</p> */}
                  <p>10.4</p>
                </td>
                <td className="text-right">
                  {/* <p>{row.volume}</p> */}
                  <p>20M</p>
                </td>
                <td className="text-right text-[#23DB9F]">
                  {/* {row.priceChange} */}
                  0.52%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopTokensList;
