import { useState, Fragment, useEffect } from 'react';
import { ArrowDown2, Repeat, Setting4 } from 'iconsax-react';

import ModalRight from '../common/ModalRight';
import { useAccount, useBalance, useNetwork, useSendTransaction } from 'wagmi';

import Modal from '../common/Modal';
import clsx from 'clsx';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import Button from './Button';
import { toast } from 'react-toastify';
import { parseEther, parseGwei } from 'viem';
import { useDebounce } from 'usehooks-ts';

const chainAlliases = {
  1: 'ethereum',
  137: 'matic-network',
  56: 'binance-smart-chain',
};

const toleranceOptions = [0.1, 0.5, 1, 1.5];
const trxSpeedOptions = ['Default', 'Standard', 'Fast', 'Instant'];

function SwapCard() {
  const { address, isConnected } = useAccount();
  const [selectedDEX, setSelectedDEX] = useState(null);
  const [DEXs, setDEXs] = useState(null);
  // const { data, isError, isLoading } = useToken({
  //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  // });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { chain } = useNetwork();

  const [tokens, setTokens] = useState(null);

  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState('');

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);

  const [changeToken, setChangeToken] = useState(1);

  const [tolerance, setTolerance] = useState(toleranceOptions[1]);
  const [trxSpeed, setTrxSpeed] = useState(trxSpeedOptions[1]);

  const [gasPrice, setGasPrice] = useState(54.197206281);

  const debouncedValue = useDebounce(tokenOneAmount, 500);

  const [isSwapLoading, setIsSwapLoading] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://v001.wallet.syntrum.com/wallet/swapAssets/${
          chain ? chainAlliases[chain.id] : 'ethereum'
        }`
      )
      .then((res) => {
        console.log(res.data);
        setTokens(res.data);
        setTokenOne(res.data[0]);
        setTokenTwo(res.data[1]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chain]);

  const { data: balance } = useBalance({
    address,
    token:
      tokenOne && tokenOne.type === 'token'
        ? tokenOne.tokenData.tokenAddress
        : null,
  });

  const changeAmountHandler = (e) => {
    setTokenOneAmount(e.target.value);
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
  };

  const openModal = (id) => {
    setChangeToken(id);
    setIsModalOpen(true);
  };

  const selectToken = (i) => {
    if (changeToken === 1) {
      setTokenOne(tokens[i]);
    } else {
      setTokenTwo(tokens[i]);
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    if (tokenOneAmount && isConnected) {
      getSwapData();
    }
  }, [tokenOne, tokenTwo]);

  const getSwapData = () => {
    let tokenOneProp = null;
    let tokenTwoProp = null;

    setIsSwapLoading(true);

    if (tokenOne.type === 'coin') {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
          amount: tokenOneAmount,
        },
      };
    } else {
      tokenOneProp = {
        from: {
          type: tokenOne.type,
          amount: tokenOneAmount,
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
          gasPrice: '90.737087652',
          slippageTolerance: 0.5,
        },
      })
      .then(
        (response) => {
          if (!response.data.length) {
            setIsSwapLoading(false);
            return toast.error('No DEXs found');
          }
          if (response.data[0].success === false) {
            setIsSwapLoading(false);
            return toast.error(response.data[0].reason);
          }
          setDEXs(response.data);
          setSelectedDEX(response.data[0]);
          setTokenTwoAmount(response.data[0].toAmount);
          setIsSwapLoading(false);
        },
        (error) => {
          console.log(error);
          setIsSwapLoading(false);
        }
      );
  };

  useEffect(() => {
    setTokenTwoAmount(selectedDEX?.toAmount);
  }, [selectedDEX]);

  const { sendTransaction } = useSendTransaction({
    from: address,
    to: selectedDEX?.serviceData.to,
    data: selectedDEX?.serviceData.txData,
    value: parseEther(debouncedValue),
  });

  const handleTrx = () => {
    sendTransaction?.();
  };

  useEffect(() => {
    // Do fetch here...
    // Triggers when "debouncedValue" changes
    if (isConnected) {
      if (!tokenOneAmount) return;
      getSwapData();
    } else if (tokenOneAmount) {
      toast.error('Please connect your wallet');
    }
  }, [debouncedValue]);

  const handleMaxBalance = () => {
    setTokenOneAmount(balance?.formatted);
  };

  return (
    <>
      <div className="bg-dark-400 p-4 md:p-6 rounded-xl">
        <div className="grid grid-cols-3">
          <div aria-hidden="true">&nbsp;</div>
          <h3 className="text-2 text-xl font-bold text-center">Swap</h3>
          <div className="text-right">
            <button onClick={() => setIsSettingsModalOpen(true)}>
              <Setting4 />
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div className="space-y-3 flex flex-col items-start">
            <p className="text-sm font-medium text-dark-100">From</p>
            <input
              type="number"
              className="bg-transparent text-xl md:text-3xl font-bold text-white border-0 outline-none placeholder:text-dark-200 w-full"
              placeholder="0.00"
              value={tokenOneAmount}
              onChange={changeAmountHandler}
            />
            <button
              className="text-sm text-white uppercase font-semibold"
              onClick={handleMaxBalance}
            >
              Max
            </button>
          </div>

          <div className="space-y-2 text-right flex-shrink-0">
            {tokens && (
              <button
                className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
                onClick={() => openModal(1)}
              >
                {tokenOne.type === 'coin' ? (
                  <img
                    className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${tokenOne.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                ) : (
                  <img
                    className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${tokenOne?.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                )}
                {tokenOne.type === 'coin' ? (
                  <span className="uppercase">{tokenOne.platformId}</span>
                ) : (
                  <span>{tokenOne?.tokenData.name}</span>
                )}
                <ArrowDown2
                  size="16"
                  className="flex-shrink-0 -mr-1 text-white"
                  aria-hidden="true"
                />
              </button>
            )}
            {balance && (
              <p className="text-xs md:text-sm text-dark-100 font-medium">
                Your {balance?.symbol} balance: {balance?.formatted}
              </p>
            )}
          </div>
        </div>

        <div className="my-6 relative text-center after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-px after:bg-dark-300 af">
          <button
            className="bg-dark-300 hover:bg-dark-300/50 rounded-lg p-2 relative z-10"
            onClick={switchTokensHandler}
          >
            <Repeat className="rotate-90" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div className="space-y-3 flex flex-col items-start">
            <p className="text-sm font-medium text-dark-100">To</p>
            <div
              type="number"
              className="bg-transparent text-xl md:text-3xl font-bold text-white border-0 outline-none placeholder:text-dark-200 w-full"
              placeholder="0.00"
              disabled={true}
              value={tokenTwoAmount}
            >
              {tokenOneAmount ? (
                <div>
                  {tokenTwoAmount ? (
                    tokenTwoAmount
                  ) : (
                    <span className="text-dark-200">0.00</span>
                  )}
                </div>
              ) : (
                <span className="text-dark-200">0.00</span>
              )}
            </div>
            <button className="text-xs md:text-sm text-dark-100 font-medium">
              $23,805.00
            </button>
          </div>

          <div className="space-y-2 text-right flex-shrink-0">
            {tokens && (
              <button
                className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
                onClick={() => openModal(2)}
              >
                {tokenTwo?.type === 'coin' ? (
                  <img
                    className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${tokenTwo.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                ) : (
                  <img
                    className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${tokenTwo?.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                )}
                {tokenTwo.type === 'coin' ? (
                  <span className="uppercase">{tokenTwo.platformId}</span>
                ) : (
                  <span>{tokenTwo?.tokenData.name}</span>
                )}
                <ArrowDown2
                  size="16"
                  className="flex-shrink-0 -mr-1 text-white"
                  aria-hidden="true"
                />
              </button>
            )}
            <p className="text-xs md:text-sm text-dark-100 font-medium">
              1 BTC= 60030.6280
            </p>
          </div>
        </div>

        {DEXs && !isSwapLoading && (
          <div className="mt-12">
            <RadioGroup value={selectedDEX} onChange={setSelectedDEX}>
              <div className="grid lg:grid-cols-2 gap-x-4 gap-y-10">
                {DEXs.map((dex, i) => (
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
                      i === 0 ? 'lg:col-span-2' : ''
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
                          className={`flex w-full  justify-between ${
                            i !== 0
                              ? 'flex-col '
                              : 'lg:items-center flex-col md:flex-row'
                          }`}
                        >
                          <p className={`text-xl font-medium`}>
                            {dex.toAmount}
                          </p>
                          <p className="text-sm font-medium">
                            Est fee: {dex.feeAmount}
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

        {/* <div className="bg-gradient-to-b from-[#33ed8d] to-[#09BDBB] rounded-lg relative mt-12 ">
          <div className="bg-gradient-to-b from-[#11C6B3] to-[#7A6CAC] rounded-lg absolute -top-4 left-4 p-3">
            <p className="text-[14px] text-bold leading-[16px] text-[#000]">
              Via Uniswap V3
            </p>
          </div>

          <div className="flex justify-between items-center text-[#000] font-normal px-6 pt-8 pb-6">
            <h3 className="leading-[23px] text-[20px]">6,448.99</h3>
            <p className="leading-[16px] text-[14px]">
              Est fee: 0.004 ETH = $7.88
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-12 gap-4">
          <div className="bg-[#252930] rounded-lg relative w-full">
            <div className="bg-[#171720] rounded-lg absolute -top-4 left-4 p-3">
              <p className="leading-[16px] text-[12px] font-bold text-[#979797]">
                Via Pancakeswap V3
              </p>
            </div>
            <div className="text-[#FFF] font-normal px-8 pt-8 pb-2">
              <h3 className="leading-[23px] text-[20px]">6,448.99 </h3>
              <p className="leading-[16px] text-[11px] pt-1">
                Est fee: 0.004 ETH = $7.88
              </p>
            </div>
          </div>

          <div className="bg-[#252930] rounded-lg relative w-full">
            <div className="bg-[#171720] rounded-lg absolute -top-4 left-4 p-3">
              <p className="leading-[16px] text-[12px] font-bold text-[#979797]">
                Via Uniswap V2
              </p>
            </div>
            <div className="text-[#FFF] font-normal px-8 pt-8 pb-2">
              <h3 className="leading-[23px] text-[20px]">6,448.99</h3>
              <p className="leading-[16px] text-[11px] pt-1">
                Est fee: 0.004 ETH = $7.88
              </p>
            </div>
          </div>
        </div> */}

        {isSwapLoading && (
          <div className="py-8 flex justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-9 w-9 text-white"
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

        <Button
          onClick={handleTrx}
          className={clsx(
            'mt-6',
            !isConnected && 'cursor-not-allowed opacity-60'
          )}
          disabled={!isConnected}
        >
          Approve
        </Button>
      </div>

      <ModalRight
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Select a token"
      >
        <div className="space-y-1 -ml-2 font-medium">
          {tokens &&
            tokens.map((token, i) =>
              token.type === 'coin' ? (
                <button
                  key={token.platformId}
                  className="flex items-center w-full p-2 rounded-lg  transition-colors hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${token.platformId}/currency/24/icon.png`}
                    alt=""
                  />
                  {token.platformId}
                </button>
              ) : (
                <button
                  key={token.tokenData.name}
                  className="flex items-center w-full p-2 rounded-lg  transition-colors hover:bg-dark-300"
                  onClick={() => selectToken(i)}
                >
                  <img
                    className="rounded-full overflow-hidden w-6 h-6 mr-2"
                    src={`https://v001.wallet.syntrum.com/images/${
                      chain ? chainAlliases[chain.id] : 'ethereum'
                    }/contract/${token.tokenData.tokenAddress}/24/icon.png`}
                    alt=""
                  />
                  {token.tokenData.name}
                </button>
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
            Slippage Tolerance
          </RadioGroup.Label>
          <div className="flex gap-3 mt-3">
            {toleranceOptions.map((option) => (
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

        <div className="my-6 h-px bg-dark-300"></div>

        <RadioGroup value={trxSpeed} onChange={setTrxSpeed}>
          <RadioGroup.Label className="font-medium">
            Transaction Speed (GWEI)
          </RadioGroup.Label>
          <div className="flex gap-3 mt-3">
            {trxSpeedOptions.map((option) => (
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
                <RadioGroup.Label as="span">{option}</RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div className="my-6 h-px bg-dark-300"></div>

        <div>
          <label htmlFor="gasPrice" className="block  font-medium">
            Gas Price (Gwei)
          </label>
          <div className="mt-2">
            <input
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              type="number"
              id="gasPrice"
              className="block w-full rounded-lg border border-dark-300  outline-none focus:border-dark-200 px-4 py-3 shadow-sm  placeholder:text-dark-100 sm:text-sm sm:leading-6 bg-dark-400"
              placeholder="0"
            />
          </div>
        </div>

        <button className="bg-main text-white font-semibold rounded-lg w-full p-3 transition-opacity hover:opacity-90 mt-6">
          Save
        </button>
      </Modal>
    </>
  );
}

export default SwapCard;
