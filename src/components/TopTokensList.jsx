import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { WagmiContext } from '../context/WagmiContext';
import { NETWORK_COINS, chainAlliases } from '@/constant/globalConstants';
import SearchBar from '@/components/SearchBar';

import { useNetwork } from 'wagmi';

import download from '@/assets/svg/download.svg';

function TopTokensList({ onTokenSelect }) {
  const { address, isConnected } = useContext(WagmiContext);
  const { chain } = useNetwork();
  const [tokens, setTokens] = useState([]);
  const [tokensWithPrice, setTokensWithPrice] = useState([]);
  const [keyword, setKeyword] = useState('')
  const [isTokenList, setTokenListSelect] = useState(true);
  const [tradeHistory, setTradeHistory] = useState([]);

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

  const formatNumberToMillion = (number) => {
    const million = Math.floor(number / 1000000);
    const decimal = Math.round((number % 1000000) / 100000);
    
    return `${million.toLocaleString()}.${decimal}M`;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString("en-US", { hour12: false });
    const formattedDate = date.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });

    return `${time} ${formattedDate}`;
  }

  const shortenAddress = (address) => {
    return address.slice(0, 8) + '...';
  }

  const parseData = (data, value) => {
    const parsedData = JSON.parse(data, true);

    return parsedData[value] === undefined ? '' : parsedData[value];
  }

  const convertToCSV = (arr) => {
    const headers = ["Date", "From -> To", "Gas", "Transaction ID"];
    const csvRows = [];

    csvRows.push(headers.join(","));

    arr.forEach(row => {
      const rowData = [formatDate(row.txTimestamp), formatBalance(parseData(row.data, 'fromAmount'), 2) + ' ' + parseData(row.data, 'fromToken') + ' -> ' + formatBalance(parseData(row.data, 'toAmount'), 2) + ' ' + parseData(row.data, 'toToken'), formatBalance(parseData(row.data, 'gasUsed'), 4) + ' ' + NETWORK_COINS[chainAlliases[chain?.id]].symbol, parseData(row.data, 'transactionHash')]
      csvRows.push(rowData.join(","));
    });

    const csv = csvRows.join("\n");

    return csv;
  }

  const downloadFile = () => {
    const csv = convertToCSV(tradeHistory);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = 'tradeHistory.csv';
    link.click();

    URL.revokeObjectURL(url);
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
  }, [chain, keyword, address]);

  useEffect(() => {
    const platformId = chain ? chainAlliases[chain.id] : 'ethereum';

    axios
      .get(
        `https://v001.wallet.syntrum.com/wallet/swap/tx?platformId=${platformId}&address=${address}`
      )
      .then((res) => {
        setTradeHistory(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chain, address]);

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
            className={`text-[#FFFFFF] text-[16px] px-[15px] py-[10px] rounded-full font-bold ${isTokenList ? '' : 'hover:bg-dark-300'}`}
            style={isTokenList ?
              { background: 'linear-gradient(135.01deg, rgba(31, 247, 253, 0.7) -57.3%, rgba(179, 59, 246, 0.7) 34.9%, rgba(255, 132, 76, 0.7) 101.62%, rgba(255, 132, 75, 0.7) 130.58%)' }
              : null
            }
            onClick={() => setTokenListSelect(true)}
          >
            Top Tokens
          </button>
          <button 
            className={`text-[#FFFFFF] text-[16px] px-[15px] py-[10px] rounded-full font-bold ${isTokenList ? 'hover:bg-dark-300' : ''}`}
            style={!isTokenList ?
              { background: 'linear-gradient(135.01deg, rgba(31, 247, 253, 0.7) -57.3%, rgba(179, 59, 246, 0.7) 34.9%, rgba(255, 132, 76, 0.7) 101.62%, rgba(255, 132, 75, 0.7) 130.58%)' }
              : null
            }
            onClick={() => setTokenListSelect(false)}
          >
            Trade History
          </button>
        </div>
        {isTokenList && (
          <SearchBar onChangeKeyword={onChangeKeyword} />
        )}
      </div>

      <div className="border border-b-[1px] border-[#20212C] my-4"></div>

      <div className="px-6 py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl pb-14">
        {isTokenList ? (
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
        ) : (isConnected ? (
              tradeHistory.length > 0 ? (
                <>
                  <table className="min-w-full mt-2">
                    <thead className="text-[12px] font-bold px-2 py-3 text-[#FFF] capitalize">
                      <tr>
                        <th scope="col" className="text-left max-w-[100px]">
                          Date
                        </th>
                        <th scope="col" className="text-right">
                          {"From -> To"}
                        </th>
                        <th scope="col" className="text-right">
                          Gas
                        </th>
                        
                        <th scope="col" className="text-right">
                          Transaction ID
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap">
                      {tradeHistory.map((row, index) => (
                        <tr key={index} className="border-b-[2px] border-[#20212C] cursor-pointer hover:bg-dark-300">
                          <td className="py-4 text-left">
                            {formatDate(row?.txTimestamp)}
                          </td>
                          <td className="text-right">
                            {`${formatBalance(parseData(row?.data, 'fromAmount'), 2)} ${parseData(row?.data, 'fromToken')} -> ${formatBalance(parseData(row?.data, 'toAmount'), 2)} ${parseData(row?.data, 'toToken')}`}
                          </td>
                          <td className="text-right text-[10px]">
                            {formatBalance(parseData(row?.data, 'gasUsed'), 4)} {NETWORK_COINS[chainAlliases[chain?.id]].symbol}
                          </td>
                          <td className='text-right'>
                            {shortenAddress(parseData(row?.data, 'transactionHash'))}
                            <a href={`${NETWORK_COINS[chainAlliases[chain?.id]]?.explorer}tx/${parseData(row?.data, 'transactionHash')}`} target='_blank' className='ml-1 text-[#4C9BE8]'>
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className='text-center pt-[52px] text-[18px]'>
                  There is no trade history. Please swap tokens.
                </div>
              )
            ) : (
              <div className='text-center pt-[52px] text-[18px]'>
                Please connect your wallet to see your trade history.
              </div>
            )
        )}
      </div>

      {!isTokenList && isConnected && tradeHistory.length > 0 && (
        <div className='bg-[#191A1F] py-[10px] mt-[10px] rounded-xl'>
          <div className='mx-auto max-w-[480px]'>
            <p className='text-[18px]'>Download your transaction history anytime</p>
            <div className='flex items-center justify-between gap-[40px] pt-[10px]'>
              <img src={download}></img>
              <div className='text-left text-[12px]'>
                <p>File Type: CSV</p>
                <p>Download Cost: 0.1 BNB</p>
              </div>
              <button className='bg-[#1F3E85] rounded-xl p-3 text-[14px]' onClick={() => downloadFile()}>
                Download Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopTokensList;
