import { useState, useEffect, useContext, useCallback } from 'react';
import { ArrowDown2, ArrowRight, Repeat, Setting4 } from 'iconsax-react';

import { ClipLoader } from 'react-spinners';

import ModalRight from '../common/ModalRight';
import {
  erc20ABI,
  useBalance,
  useNetwork,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { fetchBalance } from '@wagmi/core';

import Modal from '../common/Modal';
import clsx from 'clsx';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import Button from './Button';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { useDebounce } from 'usehooks-ts';

import { ethers } from 'ethers';
import WalletsModal from './WalletsModal';
import { WagmiContext } from '../context/WagmiContext';
import { NETWORK_COINS } from '../constant/globalConstants';

const chainAlliases = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'matic-network',
};

function SwapCard() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useContext(WagmiContext);

  const [selectedDEX, setSelectedDEX] = useState(null);
  const [DEXs, setDEXs] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTokenToSelected, setTokenToSelected] = useState(false);

  const [tokenSearch, setTokenSearch] = useState('');
  const debouncedTokenSearch = useDebounce(tokenSearch, 500);

  const { chain } = useNetwork();

  const [tokens, setTokens] = useState([]);
  const [tokenWithBalances, setTokenBalances] = useState([]);

  const [filteredTokens, setFilteredTokens] = useState([]);
  const [filteredTokensTo, setFilteredTokensTo] = useState([]);

  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState('');

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);

  const [changeToken, setChangeToken] = useState(1);

  const [toleranceOptions, setToleranceOptions] = useState(null);
  const [trxSpeedOptions, setTrxSpeedOptions] = useState(null);

  const [tolerance, setTolerance] = useState(null);

  const [gasPrice, setGasPrice] = useState(null);

  const debouncedValue = useDebounce(tokenOneAmount, '500');

  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSwapAvailable, setIsSwapAvailable] = useState(false);

  const [approveHash, setApproveHash] = useState('');

  useEffect(() => {
    axios
      .get(
        `https://v001.wallet.syntrum.com/wallet/swapAssets/${
          chain ? chainAlliases[chain.id] : 'ethereum'
        }`
      )
      .then((res) => {
        setTokens(res.data);

        if (res.data.length > 1) {
          setTokenOne(res.data[0]);
        } else {
          setTokenOne(tokens[0]);
        }

        if (res.data.length > 2) {
          setTokenTwo(res.data[1]);
        } else {
          setTokenTwo(tokens[1]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chain]);

  useEffect(() => {
    axios
      .get(
        `https://v001.wallet.syntrum.com/wallet/getSwapSettings/${
          chain ? chainAlliases[chain.id] : 'ethereum'
        }`
      )
      .then((res) => {
        setToleranceOptions(res.data.groups[0].rows[0]);
        setTrxSpeedOptions(res.data.groups[0].rows[1]);

        setTolerance(res.data.groups[0].rows[0].value.default);
        setGasPrice(res.data.groups[0].rows[1].value.default);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateTokenLists = (tempTokenList, tokenOne, tokenTwo) => {
    if(tokenTwo?.type === 'coin') {
      const filteredList = tempTokenList.filter((item) => {
        return !(item.type === 'coin' && item.platformId === tokenTwo?.platformId);
      });
    
      setFilteredTokens(filteredList);
    } else {
      const filteredList = tempTokenList.filter((item) => {
        return !(item.type === 'token' && item.tokenData.tokenAddress === tokenTwo?.tokenData.tokenAddress && item.tokenData.symbol === tokenTwo?.tokenData.symbol);
      });
    
      setFilteredTokens(filteredList);
    }

    if(tokenOne?.type === 'coin') {
      const filteredList = tempTokenList.filter((item) => {
        return !(item.type === 'coin' && item.platformId === tokenOne?.platformId);
      });
    
      setFilteredTokensTo(filteredList);
    } else {
      const filteredList = tempTokenList.filter((item) => {
        return !(item.type === 'token' && item.tokenData.tokenAddress === tokenOne?.tokenData.tokenAddress && item.tokenData.symbol === tokenOne?.tokenData.symbol);
      });
    
      setFilteredTokensTo(filteredList);
    }
  }

  const updateTokenList = useCallback(() => {
    const tempTokenList = tokenWithBalances.filter(tokenInfo => {
      const searchKeyword = tokenInfo.type === 'coin' ? tokenInfo.platformId : `${tokenInfo.tokenData.name}-${tokenInfo.tokenData.symbol}-${tokenInfo.tokenData.tokenAddress}`;
      return searchKeyword.toLowerCase().indexOf(debouncedTokenSearch.toLowerCase()) >= 0;
    });
    if (!tokenOne) {
      if (tempTokenList.length > 1) {
        setTokenOne(tempTokenList[0]);
      } else {
        setTokenOne(tokenWithBalances[0]);
      }
    }
    if (!tokenTwo) {
      if (tempTokenList.length > 2) {
        setTokenTwo(tempTokenList[1]);
      } else {
        setTokenTwo(tokenWithBalances[1]);
      }
    }

    updateTokenLists(tempTokenList, tokenOne, tokenTwo);
  }, [debouncedTokenSearch, tokenWithBalances])

  useEffect(() => {
    updateTokenList();
  }, [debouncedTokenSearch, tokenWithBalances, updateTokenList])

  const handleSettingsSave = () => {
    setIsSettingsModalOpen(false);
  };

  const { data: balance } = useBalance({
    address,
    token:
      tokenOne && tokenOne.type === 'token'
        ? tokenOne.tokenData.tokenAddress
        : null,
  });

  const changeAmountHandler = (e) => {
    if (parseFloat(e.target.value) > 0) {
      getSwapData(e.target.value);
    } else {
      setTokenOneAmount(e.target.value);
    }
  };

  const switchTokensHandler = () => {
    const one = tokenOne;
    const two = tokenTwo;

    setTokenOne(two);
    setTokenTwo(one);

    const oneAmount = tokenOneAmount;
    const twoAmount = tokenTwoAmount;

    if (oneAmount && twoAmount) {
      setTokenOneAmount(twoAmount);
      setTokenTwoAmount(oneAmount);
    }

    updateTokenLists(tokenWithBalances, two, one);
  };

  const openModal = (id) => {
    setChangeToken(id);
    setIsModalOpen(true);

    if (id === 1) {
      setTokenToSelected(false);
    } else {
      setTokenToSelected(true);
    }
  };

  const selectToken = (i) => {
    if (changeToken === 1) {
      setTokenOne(filteredTokens[i]);
    } else {
      setTokenTwo(filteredTokensTo[i]);
    }

    setIsModalOpen(false);
  };

  const getSwapData = (amount) => {
    setTokenOneAmount(amount);

    let tokenOneProp = null;
    let tokenTwoProp = null;

    setIsSwapLoading(true);

    if (tokenOne.type === 'coin') {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
          amount: amount,
        },
      };
    } else {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
          amount: amount,
          tokenData: {
            tokenAddress: tokenOne.tokenData.tokenAddress,
          },
        },
      };
    }

    if (tokenTwo.type === 'coin') {
      tokenTwoProp = {
        to: {
          type: tokenTwo.type,
        },
      };
    } else {
      tokenTwoProp = {
        to: {
          type: tokenTwo.type,
          tokenData: {
            tokenAddress: tokenTwo.tokenData.tokenAddress,
          },
        },
      };
    }

    axios
      .post('https://v001.wallet.syntrum.com/wallet/getSwapData', {
        platform: chain ? chainAlliases[chain.id] : 'ethereum',
        address,
        ...tokenOneProp,
        ...tokenTwoProp,
        advanced: {
          gasPrice: gasPrice || 0.000000000001,
          slippageTolerance: tolerance || 0.5,
        },
      })
      .then(
        (response) => {
          if (!response.data.length) {
            setIsSwapLoading(false);
            setIsSwapAvailable(false);
            return toast.error('No DEXs found');
          }

          let isAvailable = true;

          if (response.data[0].success === false) {
            isAvailable = false;
            toast.error(response.data[0].reason);
          }

          setDEXs(response.data);
          setSelectedDEX(response.data[0]);
          setTokenTwoAmount(response.data[0].toAmount);
          setIsSwapLoading(false);

          isAvailable ? setIsSwapAvailable(true) : setIsSwapAvailable(false);
        },
        (error) => {
          console.log(error);
          setIsSwapLoading(false);
        }
      );
  };

  const getEstimatedSwapData = (amount) => {
    setTokenTwoAmount(amount);

    let tokenOneProp = null;
    let tokenTwoProp = null;

    setIsSwapLoading(true);

    if (tokenOne.type === 'coin') {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
        },
      };
    } else {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
          tokenData: {
            tokenAddress: tokenOne.tokenData.tokenAddress,
          },
        },
      };
    }

    if (tokenTwo.type === 'coin') {
      tokenTwoProp = {
        to: {
          type: tokenTwo.type,
          amount: amount
        },
      };
    } else {
      tokenTwoProp = {
        to: {
          type: tokenTwo.type,
          amount: amount,
          tokenData: {
            tokenAddress: tokenTwo.tokenData.tokenAddress,
          },
        },
      };
    }

    axios
      .post('https://v001.wallet.syntrum.com/wallet/getSwapData', {
        platform: chain ? chainAlliases[chain.id] : 'ethereum',
        address,
        ...tokenOneProp,
        ...tokenTwoProp,
        advanced: {
          gasPrice: gasPrice || 0.000000000001,
          slippageTolerance: tolerance || 0.5,
        },
      })
      .then(
        (response) => {
          if (!response.data.length) {
            setIsSwapLoading(false);
            setIsSwapAvailable(false);
            return toast.error('No DEXs found');
          }

          let isAvailable = true;

          if (response.data[0].success === false) {
            isAvailable = false;
            toast.error(response.data[0].reason);
          }

          setDEXs(response.data);
          setSelectedDEX(response.data[0]);
          setTokenOneAmount(response.data[0].fromAmount);
          setIsSwapLoading(false);

          isAvailable ? setIsSwapAvailable(true) : setIsSwapAvailable(false);
        },
        (error) => {
          console.log(error);
          setIsSwapLoading(false);
        }
      );
  };

  const formatBalance = (number) => {
    if(number == undefined) {
      return number;
    }

    const decimals = number.toString().split(".")[1];
    if (decimals && decimals.length >= 8) {
      return Number(number).toFixed(8);
    } else {
      return number.toString();
    }
  }

  useEffect(() => {
    if (Number(selectedDEX?.toAmount) !== Number(tokenTwoAmount)) {
      setTokenTwoAmount(selectedDEX?.toAmount);
    }

    if (Number(selectedDEX?.fromAmount) !== Number(tokenOneAmount)) {
      setTokenOneAmount(selectedDEX?.fromAmount);
    }
  }, [selectedDEX]);

  const { data, sendTransaction } = useSendTransaction({
    from: address,
    to: selectedDEX?.serviceData?.to,
    data: selectedDEX?.serviceData?.txData,
    value: tokenOne?.type === 'coin' ? parseEther(debouncedValue || '0') : '',
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction completed');
      setTokenOneAmount('');
      setTokenTwoAmount('');
    }
  }, [isSuccess]);

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransaction({
    hash: approveHash,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      setSelectedDEX(prevState => ({ ...prevState, needApprove: false }));
      toast.success('Approved!');
      setIsActionLoading(false);
    }
  }, [isApproveSuccess]);

  const handleTrx = async () => {
    console.log(selectedDEX);

    if (selectedDEX?.needApprove) {
      setIsActionLoading(true);

      const config = await prepareWriteContract({
        address: selectedDEX.serviceData.tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [selectedDEX.serviceData.to, ethers.parseUnits(selectedDEX.fromAmount)],
      });

      const { hash } = await writeContract(config);
      setApproveHash(hash);
    } else {
      sendTransaction?.();
    }
  };

  useEffect(() => {
    if (!isConnected && tokenOneAmount) {
      toast.error('Please connect your wallet');
    }

    if (isConnected && tokenOneAmount && parseFloat(tokenOneAmount) > 0) {
      getSwapData(tokenOneAmount);
    }
  }, [tokenOne, tokenTwo]);

  const handleMaxBalance = () => {
    if (parseFloat(balance?.formatted) > 0) {
      getSwapData(balance?.formatted);
    } else {
      setTokenOneAmount(balance?.formatted);
    }
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          if (token.type === 'token') {
            const balance = await fetchBalance({
              address,
              token: token.tokenData?.tokenAddress
            });

            return { ...token, balance: balance.formatted };
          } else {
            const balance = await fetchBalance({
              address,
            });

            return { ...token, balance: balance.formatted };
          }
        })
      );

      setTokenBalances(updatedTokens);
    }

    if (tokens.length > 1) {
      fetchWalletBalance();
    }
  }, [chain, tokens])

  return (
    <>
      <div className="p-4 bg-dark-400 md:p-6 rounded-xl">
        <div className="grid grid-cols-3">
          <div aria-hidden="true">&nbsp;</div>
          <h3 className="text-xl font-bold text-center text-2">Swap</h3>
          <div className="text-right">
            <button onClick={() => setIsSettingsModalOpen(true)}>
              <Setting4 />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col items-start space-y-3">
            <p className="text-sm font-medium text-dark-100">From</p>
            <input
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              value={formatBalance(tokenOneAmount)}
              onChange={changeAmountHandler}
            />
            <button
              className="text-sm font-semibold text-white uppercase"
              onClick={handleMaxBalance}
            >
              Max
            </button>
          </div>

          <div className="flex-shrink-0 space-y-2 text-right">
            {filteredTokens.length > 0 && (
              <button
                className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
                onClick={() => openModal(1)}
              >
                {tokenOne?.type === 'coin' ? (
                  <img
                    className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${tokenOne.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                ) : (
                  <img
                    className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${tokenOne?.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                )}
                {tokenOne?.type === 'coin' ? (
                  <span className="uppercase">{NETWORK_COINS[tokenOne.platformId].symbol}</span>
                ) : (
                  <span>{tokenOne?.tokenData.symbol}</span>
                )}
                <ArrowDown2
                  size="16"
                  className="flex-shrink-0 -mr-1 text-white"
                  aria-hidden="true"
                />
              </button>
            )}
            {balance && (
              <p className="text-xs font-medium md:text-sm text-dark-100">
                Your {balance?.symbol} balance: {formatBalance(balance?.formatted)}
              </p>
            )}
          </div>
        </div>

        <div className="my-6 relative text-center after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-px after:bg-dark-300 af">
          <button
            className="relative z-10 p-2 rounded-lg bg-dark-300 hover:bg-dark-300/50"
            onClick={switchTokensHandler}
          >
            <Repeat className="rotate-90" />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col items-start space-y-3">
            <p className="text-sm font-medium text-dark-100">To</p>
            <input
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              // disabled={true}
              value={formatBalance(tokenTwoAmount)}
              onChange={(e) => getEstimatedSwapData(e.target.value)}
            />
              {/* {tokenOneAmount ? (
                <div>
                  {tokenTwoAmount ? (
                    formatBalance(tokenTwoAmount)
                  ) : (
                    <span className="text-dark-200">0.00</span>
                  )}
                </div>
              ) : (
                <span className="text-dark-200">0.00</span>
              )}
            </div> */}
          </div>

          <div className="flex-shrink-0 space-y-2 text-right">
            {filteredTokensTo.length > 0 && (
              <button
                className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
                onClick={() => openModal(2)}
              >
                {tokenTwo?.type === 'coin' ? (
                  <img
                    className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${tokenTwo.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                ) : (
                  <img
                    className="flex-shrink-0 w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${tokenTwo?.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                )}
                {tokenTwo?.type === 'coin' ? (
                  <span className="uppercase">{NETWORK_COINS[tokenTwo.platformId].symbol}</span>
                ) : (
                  <span>{tokenTwo?.tokenData.symbol}</span>
                )}
                <ArrowDown2
                  size="16"
                  className="flex-shrink-0 -mr-1 text-white"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>

        {DEXs && !isSwapLoading && (
          <div className="mt-12">
            <RadioGroup value={selectedDEX} onChange={setSelectedDEX}>
              <div className="grid lg:grid-cols-2 gap-x-4 gap-y-10">
                {DEXs.map((dex, index) => (
                  <RadioGroup.Option
                    key={dex.name}
                    value={dex}
                    className={({ checked }) =>
                      `
                      ${
                        checked
                          ? 'bg-greenGradient text-black'
                          : 'bg-dark-300 text-white'
                      }
                      relative flex cursor-pointer rounded-lg p-5 py-6 shadow-md focus:outline-none ${
                        (DEXs.length % 2 == 0 && index < 2) || (DEXs.length % 2 == 1 && index < 1)
                          ? 'lg:col-span-2'
                          : ''
                      }`
                    }
                  >
                    {({ checked }) => (
                      <>
                        <div
                          className={`absolute -top-6 left-2 p-2.5 px-3 rounded-lg ${
                            checked
                              ? 'bg-gradient-light'
                              : 'bg-dark-400 border border-dark-300'
                          }`}
                        >
                          <span className="text-sm font-bold ">
                            Via {dex.name}
                          </span>
                        </div>

                        <div
                          className={`flex w-full justify-between ${
                            (DEXs.length % 2 == 0 && index < 2) || (DEXs.length % 2 == 1 && index < 1)
                              ? 'flex-col md:flex-row' 
                              : 'flex-col'
                          }`}
                        >
                          <p className={`text-xl font-medium`}>
                            {formatBalance(dex.toAmount)}
                          </p>
                          <p className="text-sm font-medium">
                            Est fee: {formatBalance(dex.feeAmount)}
                          </p>
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {isSwapLoading && (
          <div className="flex justify-center py-8">
            <svg
              className="mr-3 -ml-1 text-white animate-spin h-9 w-9"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        <div className="mt-6">
          {isConnected ? (
            (parseFloat(tokenOneAmount) > 0 && isSwapAvailable) ? (
              <Button onClick={handleTrx} disabled={(isLoading || isActionLoading)}>
                {(isLoading || isActionLoading) ? (
                  <>
                    <ClipLoader size={20} color={'#ffffff'} loading={true} className='relative top-[3px]' />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  selectedDEX?.needApprove ? 'Approve' : 'Swap'
                )}
              </Button>
            ) : (
              <Button onClick={handleTrx} disabled={true}>
                Swap
              </Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
          )}
        </div>
      </div>

      <ModalRight
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Select a token"
      >
        <div className="-ml-2 space-y-1 font-medium">
          <input
            type="text"
            className="w-full h-12 px-4 py-0 mb-4 text-base text-white border outline-none bg-purple-bg rounded-2xl border-purple-border shadow-input focus:shadow-input-focus"
            placeholder="Search name or paste address"
            value={tokenSearch}
            onChange={(e) => setTokenSearch(e.target.value)}
          />
          {isTokenToSelected ? (
            filteredTokensTo.length > 0 &&
            filteredTokensTo.map((token, i) =>
              token.type === 'coin' ? (
                <button
                  key={token.platformId}
                  className="flex items-center w-full p-2 transition-colors rounded-lg hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${token.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                  <div className="flex flex-col flex-1 text-left">
                    <div className='text-base'>{NETWORK_COINS[token.platformId].symbol}</div>
                    <div className='text-sm text-gray-400'>{NETWORK_COINS[token.platformId].name}</div>
                  </div>
                  <p className="flex-shrink-0 -mr-1 text-white">
                    {formatBalance(token.balance)}
                  </p>
                </button>
              ) : (
                <button
                  key={token.tokenData.name}
                  className="flex items-center w-full p-2 transition-colors rounded-lg hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${token.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                  <div className="flex flex-col flex-1 text-left">
                    <div className='text-base'>{token.tokenData.symbol}</div>
                    <div className='text-sm text-gray-400'>{token.tokenData.name}</div>
                  </div>
                  <p className="flex-shrink-0 -mr-1 text-white">
                    {formatBalance(token.balance)}
                  </p>
                </button>
              )
            )
          ) : (
            filteredTokens.length > 0 &&
            filteredTokens.map((token, i) =>
              token.type === 'coin' ? (
                <button
                  key={token.platformId}
                  className="flex items-center w-full p-2 transition-colors rounded-lg hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${token.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                  <div className="flex flex-col flex-1 text-left">
                    <div className='text-base'>{NETWORK_COINS[token.platformId].symbol}</div>
                    <div className='text-sm text-gray-400'>{NETWORK_COINS[token.platformId].name}</div>
                  </div>
                  <p className="flex-shrink-0 -mr-1 text-white">
                    {formatBalance(token.balance)}
                  </p>
                </button>
              ) : (
                <button
                  key={token.tokenData.name}
                  className="flex items-center w-full p-2 transition-colors rounded-lg hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="w-6 h-6 mr-2 overflow-hidden rounded-full"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${token.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                  <div className="flex flex-col flex-1 text-left">
                    <div className='text-base'>{token.tokenData.symbol}</div>
                    <div className='text-sm text-gray-400'>{token.tokenData.name}</div>
                  </div>
                  <p className="flex-shrink-0 -mr-1 text-white">
                    {formatBalance(token.balance)}
                  </p>
                </button>
              )
            )
          )}
        </div>
      </ModalRight>

      <Modal
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        heading="Swap Settings"
      >
        <RadioGroup value={tolerance} onChange={setTolerance}>
          <RadioGroup.Label className="font-medium">
            {toleranceOptions?.title}
          </RadioGroup.Label>
          <div className="flex gap-3 mt-3">
            {toleranceOptions &&
              toleranceOptions.value.values.map((option) => (
                <RadioGroup.Option
                  key={option}
                  value={option}
                  className={({ active, checked }) =>
                    clsx(
                      active ? 'ring-1 ring-primary ring-offset-1 ' : '',
                      checked
                        ? 'bg-main text-white'
                        : 'ring-1 ring-inset ring-dark-300 bg-dark-300 text-white hover:bg-dark-300/50',
                      'flex items-center justify-center rounded-lg p-2 text-sm font-semibold flex-1 cursor-pointer'
                    )
                  }
                >
                  <RadioGroup.Label as="span">{option + '%'}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
          </div>
        </RadioGroup>

        <div className="h-px my-6 bg-dark-300"></div>

        <RadioGroup value={gasPrice} onChange={setGasPrice}>
          <RadioGroup.Label className="font-medium">
            Transaction Speed (GWEI)
          </RadioGroup.Label>
          <div className="flex gap-3 mt-3">
            {trxSpeedOptions &&
              trxSpeedOptions.value.values.map((option) => (
                <RadioGroup.Option
                  key={option.name}
                  value={option.price}
                  className={({ active, checked }) =>
                    clsx(
                      active ? 'ring-1 ring-primary ring-offset-1 ' : '',
                      checked
                        ? 'bg-main text-white'
                        : 'ring-1 ring-inset ring-dark-300 bg-dark-300 text-white hover:bg-dark-300/50',
                      'flex items-center justify-center rounded-lg p-2 text-sm font-semibold flex-1 cursor-pointer'
                    )
                  }
                >
                  <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
          </div>
        </RadioGroup>

        <div className="h-px my-6 bg-dark-300"></div>

        <div>
          <label htmlFor="gasPrice" className="block text-dark-100">
            Gas Price (Gwei)
          </label>
          <div className="mt-2">
            <input
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              type="number"
              id="gasPrice"
              className="block w-full px-4 py-3 border rounded-lg shadow-sm outline-none border-dark-300 focus:border-dark-200 placeholder:text-dark-100 sm:text-sm sm:leading-6 bg-dark-400"
              placeholder="0"
            />
          </div>
        </div>

        <button
          className="w-full p-3 mt-6 font-semibold text-white transition-opacity rounded-lg bg-main hover:opacity-90"
          onClick={handleSettingsSave}
        >
          Save
        </button>
      </Modal>

      <WalletsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default SwapCard;
