import { useState, useEffect, useContext, useCallback } from "react";
import { ArrowDown2, ArrowRight, Repeat, Setting4 } from "iconsax-react";
import USDT from "../assets/svg/usdt.svg";

import { ClipLoader } from "react-spinners";

import ModalRight from "../common/ModalRight";
import { erc20Abi } from "viem";
import { useBalance, useAccount, useSendTransaction } from "wagmi";
import { writeContract, readContract } from "@wagmi/core";
import { avalancheFuji, sepolia } from "viem/chains";

import Modal from "../common/Modal";
import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";

import Button from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "viem";
import { useDebounce, useMediaQuery } from "usehooks-ts";

import { ethers } from "ethers";
import WalletsModal from "./WalletsModal";
import { WagmiContext } from "../context/WagmiContext";
import { NETWORK_COINS, chainAlliases } from "../constant/globalConstants";
import SyntrumToast from "./SyntrumToast";

import poolContract from "../contracts/pool.json";
import { config } from "../Wagmi";
import SwitchNetworkDropdown from "./SwitchNetworkDropdownSwapcard";
import DestinationChainDropdown from "./DestinationChainDropdown";
import { tokensSelector } from "../contracts/destination-selector";
import SwitchSourceToken from "./SwitchSourceToken";
import DestinationToken from "./DestinationToken";

function SwapCard({ selectedToken }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTokenToSelected, setTokenToSelected] = useState(false);

  const { chain, address, isConnected } = useAccount();

  const [tokens, setTokens] = useState([]);
  const [tokenWithBalances, setTokenBalances] = useState([]);

  const [filteredTokens, setFilteredTokens] = useState([]);
  const [filteredTokensTo, setFilteredTokensTo] = useState([]);

  const [tokenOne, setTokenOne] = useState(null);
  const [tokenTwo, setTokenTwo] = useState(null);

  const [changeToken, setChangeToken] = useState(1);

  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSwapAvailable, setIsSwapAvailable] = useState(false);

  const [errorMessage, setErrorMessage] = useState("Swap");

  const poolAbi = poolContract.abi;
  const [selectedId, setSelectedId] = useState();
  const [switchToken, setSwitchToken] = useState("USDT");
  const isMobile = useMediaQuery("(max-width: 375px)");

  useEffect(() => {
    if (selectedToken?.type !== tokenTwo?.type) {
      setTokenOne(selectedToken);
    } else {
      if (selectedToken?.type === "token") {
        if (
          selectedToken?.tokenData.tokenAddress !==
          tokenTwo?.tokenData.tokenAddress
        ) {
          setTokenOne(selectedToken);
        }
      }
    }
  }, [selectedToken]);

  const handleSettingsSave = () => {
    setIsSettingsModalOpen(false);
  };

  const { data: balance } = useBalance({
    address,
    token:
      tokenOne && tokenOne.type === "token"
        ? tokenOne.tokenData.tokenAddress
        : null,
  });

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

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          if (token.type === "token") {
            const balance = await fetchBalance({
              address,
              token: token.tokenData?.tokenAddress,
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
    };

    if (tokens.length > 0) {
      fetchWalletBalance();
    }
  }, [chain, tokens]);

  const contractAddress = "0x2B5474bCCCae8C9cce8D70Ed0e24B8D3797b2BAD";

  async function handleRead() {
    const result = await readContract(config, {
      chainId: sepolia.id,
      abi: poolAbi,
      address: contractAddress,
      functionName: "getRouter",
    });
    console.log("Last Received Message", result);
  }

  async function handleApprove() {
    const res = await writeContract(config, {
      chainId: avalancheFuji.id,
      abi: erc20Abi,
      address: "0x17d6e28C673974Ce04a183f1195F6f03b6Fccc24",
      functionName: "approve",
      args: ["0x96120cBa6C7D933e06C290cC0BBE41ce17194c1F", parseEther("10000")],
    });
  }

  function handleTransfer() {
    async function sendFxn() {
      const result = await writeContract(config, {
        chainId: avalancheFuji.id,
        abi: poolAbi,
        address: "0x96120cBa6C7D933e06C290cC0BBE41ce17194c1F",
        functionName: "sendTokenPayLINK",
        args: [
          "16015286601757825753",
          "0x2B5474bCCCae8C9cce8D70Ed0e24B8D3797b2BAD",
          "0x17d6e28C673974Ce04a183f1195F6f03b6Fccc24",
          parseEther("999"),
          "0x121334F7E1f17d76eA29fA49Ba82582BdB03eCcF",
        ],
      });

      setHashIn(() => result);
    }

    try {
      sendFxn();
    } catch (e) {
      setProcessing(() => false);
    }
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
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
            />
            <button className="text-sm font-semibold text-white uppercase">
              Max
            </button>
          </div>
        </div>

        <div className="my-6 relative text-center after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-px after:bg-dark-300 af">
          <button
            className="relative z-10 p-2 rounded-lg bg-dark-300 hover:bg-dark-300/50"
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
              type="number"
              className="w-full text-xl font-bold text-white bg-transparent border-0 outline-none md:text-3xl placeholder:text-dark-200"
              placeholder="0.00"
              // disabled={true}
              // value={formatBalance(tokenTwoAmount, 8)}
              onChange={(e) => getEstimatedSwapData(e.target.value)}
            />
          </div>
        </div>

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
            isSwapAvailable ? (
              <Button disabled={isActionLoading}>
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
          {/* <button onClick={handleTransfer}>Buy now</button> */}
        </div>
      </div>

      <WalletsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default SwapCard;
