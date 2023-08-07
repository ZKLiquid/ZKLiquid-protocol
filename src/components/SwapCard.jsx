import { useState, Fragment, useEffect } from 'react';
import { ArrowDown2, Repeat, Setting4 } from 'iconsax-react';

import { ReactComponent as MoreSvg } from '@/assets/svg/more.svg';

import ModalRight from '../common/ModalRight';
import { useBalance, useNetwork } from 'wagmi';

import Modal from '../common/Modal';
import clsx from 'clsx';
import { RadioGroup } from '@headlessui/react';

const chainAlliases = {
  1: 'ethereum',
  137: 'matic-network',
  56: 'binance-smart-chain',
};

const toleranceOptions = [0.1, 0.5, 1, 1.5];
const trxSpeedOptions = ['Default', 'Standard', 'Fast', 'Instant'];

function SwapCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { chain } = useNetwork();

  const tokensURL = `https://v001.wallet.syntrum.com/wallet/swapAssets/${
    chainAlliases[chain.id]
  }`;

  const [tokens, setTokens] = useState(null);

  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState('');

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);

  const [changeToken, setChangeToken] = useState(1);

  const [tolerance, setTolerance] = useState(toleranceOptions[1]);
  const [trxSpeed, setTrxSpeed] = useState(trxSpeedOptions[1]);

  const [gasPrice, setGasPrice] = useState(54.197206281);

  useEffect(() => {
    const fetchData = async () => {
      fetch(tokensURL)
        .then((res) => res.json())
        .then((data) => {
          setTokens(data);
          setTokenOne(data[1]);
          setTokenTwo(data[2]);
        });
    };

    fetchData();
  }, [chain]);

  // const { data, isError, isLoading } = useBalance({
  //   address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  // });

  const changeAmountHandler = (e) => {
    setTokenOneAmount(e.target.value);
  };

  const switchTokensHandler = () => {
    const one = tokenOne;
    const two = tokenTwo;

    setTokenOne(two);
    setTokenTwo(one);
  };

  const openModal = (id) => {
    setChangeToken(id);
    setIsModalOpen(true);
  };

  const modifyToken = (i) => {
    if (changeToken === 1) {
      setTokenOne(tokens[i]);
    } else {
      setTokenTwo(tokens[i]);
    }

    setIsModalOpen(false);
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
            <button className="text-sm text-white uppercase font-semibold">
              Max
            </button>
          </div>

          <div className="space-y-2 text-right flex-shrink-0">
            <button
              className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
              onClick={() => openModal(1)}
            >
              {tokens && (
                <img
                  className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                  src={`https://v001.wallet.syntrum.com/images/${
                    chainAlliases[chain.id]
                  }/contract/${tokenOne.tokenData.tokenAddress}/32/icon.png`}
                  alt=""
                />
              )}
              {tokens && tokenOne.tokenData.name}
              <ArrowDown2
                size="16"
                className="flex-shrink-0 -mr-1 text-white"
                aria-hidden="true"
              />
            </button>
            <p className="text-xs md:text-sm text-dark-100 font-medium">
              Your BTC balance: 0.6280
            </p>
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
            <input
              type="number"
              className="bg-transparent text-xl md:text-3xl font-bold text-white border-0 outline-none placeholder:text-dark-200 w-full"
              placeholder="0.00"
              disabled={true}
            />
            <button className="text-xs md:text-sm text-dark-100 font-medium">
              $23,805.00
            </button>
          </div>

          <div className="space-y-2 text-right flex-shrink-0">
            <button
              className="inline-flex items-center justify-center gap-x-1.5 rounded-lg bg-dark-300 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-dark-300/50 whitespace-nowrap"
              onClick={() => openModal(2)}
            >
              {tokens && (
                <img
                  className="flex-shrink-0 rounded-full overflow-hidden w-6 h-6 mr-2"
                  src={`https://v001.wallet.syntrum.com/images/${
                    chainAlliases[chain.id]
                  }/contract/${tokenTwo.tokenData.tokenAddress}/32/icon.png`}
                  alt=""
                />
              )}
              {tokens && tokenTwo.tokenData.name}
              <ArrowDown2
                size="16"
                className="flex-shrink-0 -mr-1 text-white"
                aria-hidden="true"
              />
            </button>
            <p className="text-xs md:text-sm text-dark-100 font-medium">
              1 BTC= 60030.6280
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#33ed8d] to-[#09BDBB] rounded-lg relative mt-12 ">
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
        </div>

        <p className="flex cursor-pointer items-center gap-3 justify-center pt-8 text-[#33ED8D] text-[16px] font-medium">
          View More DEXs <MoreSvg />
        </p>

        <button className="text-[16px] bg-gradient-to-r from-[#DC40A4] to-[#6749D5] w-full rounded-lg mt-6 py-3">
          Approve
        </button>
      </div>

      <ModalRight
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Select a token"
      >
        <div className="space-y-1 -ml-2 font-medium">
          {tokens &&
            tokens.map(
              (token, i) =>
                token.type === 'token' && (
                  <button
                    key={token.tokenData.name}
                    className="flex items-center w-full p-2 rounded-lg  transition-colors hover:bg-dark-300"
                    onClick={() => modifyToken(i)}
                  >
                    <img
                      className="rounded-full overflow-hidden w-6 h-6 mr-2"
                      src={`https://v001.wallet.syntrum.com/images/${
                        chainAlliases[chain.id]
                      }/contract/${token.tokenData.tokenAddress}/32/icon.png`}
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
