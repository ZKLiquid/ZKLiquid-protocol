import { useState, useEffect, useContext, useCallback } from "react";
import { ArrowDown2, ArrowRight, Repeat, Setting4 } from "iconsax-react";

import { ClipLoader } from "react-spinners";

import { erc20Abi, formatEther } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import {
  writeContract,
  readContract,
  waitForTransactionReceipt,
} from "@wagmi/core";

import Button from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "viem";
import { useDebounce, useMediaQuery } from "usehooks-ts";

import WalletsModal from "./WalletsModal";

import poolContract from "../contracts/pool.json";
import { config } from "../Wagmi";
import SwitchNetworkDropdown from "./SwitchNetworkDropdownSwapcard";
import DestinationChainDropdown from "./DestinationChainDropdown";
import {
  tokensSelector,
  destinationSelectors,
} from "../contracts/destination-selector";
import SwitchSourceToken from "./SwitchSourceToken";
import DestinationToken from "./DestinationToken";

function SwapCard({ setMessageId, messageId }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { chain, address, isConnected } = useAccount();
  const { chains } = useSwitchChain();

  const [amount, setAmount] = useState(null);
  const [recipientAddr, setRecipientAddr] = useState(address);
  const [curAllowance, setCurAllowance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxHash, setTrxHash] = useState("");
  const [isTransfer, setIsTransfer] = useState(false);

  const poolAbi = poolContract.abi;
  const poolContracts = poolContract.contracts;
  const [selectedId, setSelectedId] = useState();
  const [switchToken, setSwitchToken] = useState(tokensSelector[0]);

  // Storage key is the connected address

  const STORAGE_KEY = address;
  const MAX_ITEMS = 5;

  const isMobile = useMediaQuery("(max-width: 375px)");

  const needApproval = parseFloat(curAllowance) < parseFloat(amount);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text.length > 0) {
        setRecipientAddr(() => text);
      }
    } catch (err) {
      console.error("Failed to reac contents");
    }
  }

  const formatBalance = (number, decimal) => {
    if (number == undefined) {
      return number;
    }

    const decimals = number.toString().split(".")[1];
    if (decimals && decimals.length >= decimal) {
      return Number(number).toFixed(decimal);
    } else {
      return number.toString();
    }
  };

  const spender = poolContracts[chain?.id];

  useEffect(() => {
    async function fetchBalance(addr) {
      const result = await readContract(config, {
        chainId: chain?.id,
        abi: erc20Abi,
        address: switchToken[chain?.id],
        functionName: "balanceOf",
        args: [addr],
      });
      setBalance(() => formatEther(result));
    }
    if (address) {
      fetchBalance(address);
    }
  }, [address, chain, switchToken, isTransfer]);

  useEffect(() => {
    if (!address) {
      return;
    }

    async function fetchAllowance(addr) {
      const result = await readContract(config, {
        chainId: chain?.id,
        abi: erc20Abi,
        address: switchToken[chain?.id],
        functionName: "allowance",
        args: [addr, spender],
      });

      setCurAllowance(() => formatEther(result));
    }

    async function fetchBalance(addr) {
      const balRes = await readContract(config, {
        chainId: chain?.id,
        abi: erc20Abi,
        address: switchToken[chain?.id],
        functionName: "balanceOf",
        args: [addr],
      });
    }

    try {
      fetchAllowance(address);

      fetchBalance(address);
    } catch (e) {}
  }, [address, chain, switchToken, isProcessing]);

  useEffect(() => {
    async function awaitTransactionConfirmation(hashIn) {
      const confirmHash = await waitForTransactionReceipt(config, {
        chainId: chain.id,
        hash: trxHash,
      });

      console.log("the block hash is", confirmHash);
      const msgId =
        confirmHash.logs.length > 5
          ? confirmHash.logs.at(5).topics.at(1)
          : confirmHash.logs.at(-1).topics.at(1);

      setIsProcessing(() => false);
      if (isTransfer) {
        setMessageId(() => msgId);
        setAmount(() => 0);
        setSelectedId();
        setRecipientAddr(() => address);
        const trxData = {
          // details: `${amount} ${switchToken.name}: ${chain.name} to ${
          //   chains.find((chain) => chain.id === selectedId).name // Assuming each chain object has a name property
          // }`,
          amount: amount,
          from: chain.id,
          to: selectedId,
          name: switchToken.name,
          id: msgId,
          time: new Date().toLocaleDateString(),
        };
        // setTransferData(() => ({
        //   details: `${amount} ${switchToken.name}: ${chain.name} to ${
        //     chains.find((chain) => chain.id === selectedId).name // Assuming each chain object has a name property
        //   }`,
        //   id: confirmHash.logs.at(-1).topics.at(1), // Use the same value as for setting messageId
        // }));

        saveTransferData(trxData);
      }

      setIsTransfer(false);
    }

    if (trxHash !== "") {
      awaitTransactionConfirmation(trxHash);
    }
  }, [trxHash]);

  async function handleApprove() {
    setIsProcessing(() => true);
    const res = await writeContract(config, {
      chainId: chain?.id,
      abi: erc20Abi,
      address: switchToken[chain?.id],
      functionName: "approve",
      args: [spender, parseEther(amount.toString())],
    });
    setTrxHash(() => res);
  }
  const receiverContract = poolContracts[selectedId];
  function handleTransfer() {
    async function sendFxn() {
      const result = await writeContract(config, {
        chainId: chain?.id,
        abi: poolAbi,
        address: spender,
        functionName: "sendTokenPayLINK",
        args: [
          destinationSelectors[selectedId].toString(),
          receiverContract,
          switchToken[chain?.id],
          parseEther(amount.toString()), //ammount
          recipientAddr, //recipient
        ],
      });

      setTrxHash(() => result);
    }

    try {
      setIsTransfer(() => true);
      setIsProcessing(() => true);
      sendFxn();
    } catch (e) {
      setIsProcessing(() => false);
    }
  }

  function saveTransferData(newData) {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (data.length >= MAX_ITEMS) {
      data.shift();
    }

    data.push(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function handleMax() {
    setAmount(() => balance);
  }

  return (
    <>
      <div className="p-4 bg-[#04131F]  md:p-6 rounded-xl ">
        <div className="grid grid-cols-3">
          <div aria-hidden="true">&nbsp;</div>
          <h3 className="text-xl font-bold text-center text-2">Swap/Bridge</h3>
          <div className="text-right">
            <button onClick={() => setIsSettingsModalOpen(true)}>
              <Setting4 />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col items-start space-y-3">
            <p className="text-sm font-medium text-dark-100">From</p>

            {isConnected && (
              <div className="flex items-end gap-4 ">
                <SwitchNetworkDropdown isMobile={isMobile} />

                <SwitchSourceToken
                  switchToken={switchToken}
                  setSwitchToken={setSwitchToken}
                />
              </div>
            )}
            <input
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              value={!!amount && formatBalance(amount, 8)}
            />
            <button
              className="text-sm font-semibold text-white uppercase"
              onClick={handleMax}
            >
              Max
            </button>
          </div>

          <div className="flex-shrink-0 space-y-2 text-right">
            {balance && (
              <p className="text-xs font-medium md:text-sm text-gray-200">
                Balance: {formatBalance(balance, 2)} {switchToken.name}
              </p>
            )}
          </div>
        </div>

        <div className="my-3  relative text-center after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-px after:bg-dark-300 af">
          <button
            className="relative z-10 p-1 rounded-lg bg-dark-300 hover:bg-dark-300/50"
            // onClick={switchTokensHandler}
          >
            <Repeat className="rotate-90" />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col items-start space-y-3">
            <p className="text-sm font-medium text-dark-100">To</p>
            {isConnected && (
              <div className="flex items-end gap-4 ">
                <DestinationChainDropdown
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  isMobile={isMobile}
                />

                <DestinationToken switchToken={switchToken} />
              </div>
            )}
            <input
              disabled={true}
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              // disabled={true}
              value={!!amount && formatBalance(amount, 8)}
              // onChange={(e) => getEstimatedSwapData(e.target.value)}
            />
          </div>
        </div>
        {selectedId && amount > 0 && (
          <div className=" w-full mt-5">
            <div className="relative   ">
              <div className="absolute -inset-x-2 -inset-y-5"></div>

              <div className="relative w-full">
                <input
                  onChange={(e) => setRecipientAddr(() => e.target.value)}
                  type="text"
                  name=""
                  id=""
                  placeholder="Paste recipient here"
                  className="block w-full px-5 h-[50px] text-lg font-normal text-black placeholder-gray-600 bg-white border border-gray-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black font-pj focus:outline-none"
                  value={recipientAddr}
                />

                <div
                  className="mt-0 absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer "
                  onClick={handlePaste}
                >
                  <svg
                    className="h-10 w-auto "
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M40 22V10C40 7.794 38.206 6 36 6H30C30 5.46957 29.7893 4.96086 29.4142 4.58579C29.0391 4.21071 28.5304 4 28 4H16C15.4696 4 14.9609 4.21071 14.5858 4.58579C14.2107 4.96086 14 5.46957 14 6H8C5.794 6 4 7.794 4 10V36C4 38.206 5.794 40 8 40H22C22 42.206 23.794 44 26 44H40C42.206 44 44 42.206 44 40V26C44 23.794 42.206 22 40 22ZM22 26V36H8V10H14V14H30V10H36V22H26C23.794 22 22 23.794 22 26ZM26 40V26H40L40.002 40H26Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {isSwapLoading && (
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
        )} */}

        <div className="mt-6">
          {isConnected ? (
            isProcessing ? (
              <Button>
                <>
                  <ClipLoader
                    size={20}
                    color={"#ffffff"}
                    loading={true}
                    className="relative top-[3px]"
                  />
                  <span className="ml-2">Processing...</span>
                </>
              </Button>
            ) : needApproval ? (
              <Button disabled={!amount || !selectedId} onClick={handleApprove}>
                Approve
              </Button>
            ) : (
              <Button
                disabled={!amount || !selectedId}
                onClick={handleTransfer}
              >
                Transfer Now
              </Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
          )}
        </div>

        {/* <div className="mt-6">
          {isConnected ? (
            isSwapAvailable ? (
              <Button>
                {isActionLoading ? (
                  <>
                    <ClipLoader
                      size={20}
                      color={"#ffffff"}
                      loading={true}
                      className="relative top-[3px]"
                    />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            ) : (
              <Button disabled={true}>{errorMessage}</Button>
            )
          ) : (
            <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
          )}
          <button onClick={handleTransfer}>Buy now</button>
        </div> */}
      </div>

      <WalletsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default SwapCard;
