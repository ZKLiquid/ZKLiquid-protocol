import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { WagmiContext } from '../context/WagmiContext';
import { NETWORK_COINS } from '@/constant/globalConstants';
import SearchBar from '@/components/SearchBar';

import { useNetwork } from 'wagmi';

const chainAlliases = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'matic-network',
};

function TopTokensList({ onTokenSelect }) {
  const { isConnected } = useContext(WagmiContext);
  const { chain } = useNetwork();
  const [tokens, setTokens] = useState([]);
  const [tokensWithPrice, setTokensWithPrice] = useState([]);
  const [keyword, setKeyword] = useState('');

  const handleTokenClick = (token) => {
    onTokenSelect(token);
  }

  const onChangeKeyword = (keyword) => {
    setKeyword(keyword);
  }

  const formatBalance = (number, decimal) => {
    if(number == undefined) {
      return number;
    }

    const decimals = number.toString().split(".")[1];
    if (decimals && decimals.length >= decimal) {
      return Number(number).toFixed(decimal);
    } else {
      return number.toString();
    }
  }

  function formatNumberToMillion(number) {
    const million = Math.floor(number / 1000000);
    const decimal = Math.round((number % 1000000) / 100000);
    
    return `${million.toLocaleString()}.${decimal}M`;
  }

  function shortenAddress(address) {
    return address.slice(0, 8) + '...';
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

  useEffect(() => {
    const getTokensWithPrice = async () => {
      const platformId = chain ? chainAlliases[chain.id] : 'ethereum';
      
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          if (token.type === 'token') {
            const priceData = await axios.get(`https://v001.wallet.syntrum.com/wallet/tokenPrices/${platformId}?contract_addresses=${token.tokenData.tokenAddress}&vs_currencies=usd`);

            return { ...token, priceData: priceData.data[token.tokenData.tokenAddress] };
          } else {
            const priceData = await axios.get(`https://v001.wallet.syntrum.com/wallet/coinPrices/?platform_ids=${platformId}&vs_currencies=usd`);

            return { ...token, priceData: priceData.data[platformId] };
          }
        })
      );

      setTokensWithPrice(updatedTokens);
    }

    if(tokens.length > 0) {
      getTokensWithPrice();
    }
  }, [tokens])

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
              <th scope="col" className="text-right">
                View On Explorer
              </th>
            </tr>
          </thead>

          <tbody className="text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap">
            {tokensWithPrice.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-b-[2px] border-[#20212C] cursor-pointer hover:bg-dark-300" onClick={() => handleTokenClick(row)}>
                <td className="py-4 flex items-center gap-2 text-[14px]">
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
                    {row?.type === 'coin' ? NETWORK_COINS[row?.platformId].symbol : `${row?.tokenData.symbol}`}
                </td>
                <td className="text-right">
                  ${formatBalance(row?.priceData['usd'], 4)}
                </td>
                <td className="text-right">
                  {formatNumberToMillion(row?.priceData['usd_24h_vol'])}
                </td>
                <td className={`text-right ${row?.priceData['usd_24h_change'] > 0 ? 'text-[#23DB9F]' : 'text-[#FB4848]'}`}>
                  {Number(row?.priceData['usd_24h_change']).toFixed(2)}%
                </td>
                <td className='text-right'>
                  {row?.type === 'coin' ? (
                    NETWORK_COINS[row?.platformId].symbol + ' coin'
                  ) : (
                    <>
                      {shortenAddress(row?.tokenData.tokenAddress)}
                      <a href={isConnected ? `${NETWORK_COINS[chainAlliases[chain?.id]]?.explorer}address/${row?.tokenData.tokenAddress}` : `https://etherscan.io/address/${row?.tokenData.tokenAddress}`} target='_blank' className='ml-1 text-[#4C9BE8]'>
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </>
                  )}
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
