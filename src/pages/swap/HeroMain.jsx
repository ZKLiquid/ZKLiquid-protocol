import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAccount } from "wagmi";
import WalletsModal from "../../components/WalletsModal";
import faucetContract from "../../contracts/faucet.json";
import { config } from "../../Wagmi";
import { writeContract } from "@wagmi/core";
import { ClipLoader } from "react-spinners";

export default function HeroMain({
  setSubmitHash,
  isProcessing,
  setIsProcessing,
}) {
  const { chain, address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [recipientAddr, setRecipientAddr] = useState(address);

  const faucetAbi = faucetContract.abi;
  const faucetAddress = faucetContract.contracts[chain?.id];

  function handleRequest() {
    async function sendFxn() {
      const result = await writeContract(config, {
        chainId: chain?.id,
        abi: faucetAbi,
        address: faucetAddress,
        functionName: "requestTestTokens",
        args: [],
      });

      setSubmitHash(() => result);
    }

    try {
      setIsProcessing(() => true);
      sendFxn();
      // setIsProcessing(() => false);
    } catch (e) {
      setIsProcessing(() => false);
    }
  }

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

  useEffect(() => {
    setRecipientAddr(() => address);
  }, [address]);
  return (
    <div className="py-12  sm:py-16 lg:py-48  flex ">
      <div className="px-4 max-w-[550px] w-full sm:px-4 lg:px-6">
        <div className="max-w-2xl mx-auto ">
          <h2 className="text-4xl font-bold text-teal-500 font-pj">
            Get some test tokens here
          </h2>
          <p className=" mt-5 text-base font-normal text-gray-100  font-pj">
            Request test USDT and USDC tokens for the chains integrated, just
            connect your wallet and switch to the chain you would like to get
            test tokens in and send a request
          </p>
        </div>

        {recipientAddr && (
          <div className="relative  mt-10">
            <div className="mb-4">
              500 USDT and 500 USDC on {chain?.name} will be sent to:
            </div>

            <div className="absolute -inset-x-2 -inset-y-5"></div>

            <div className="">
              <div className=" w-full mt-5">
                <div className="relative   ">
                  <div className="absolute -inset-x-2 -inset-y-5"></div>

                  <div className="relative flex ">
                    <div className="py-2 px-5 font-bold">{recipientAddr}</div>

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
            </div>
          </div>
        )}

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
            ) : (
              <Button disabled={!recipientAddr} onClick={handleRequest}>
                Send request
              </Button>
            )
          ) : (
            <>
              <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>
              <WalletsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
