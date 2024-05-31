import React, { useEffect, useState } from "react";
import HeroMain from "./HeroMain";
import SuccessModal from "../../components/SuccessModal2";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount } from "wagmi";
import { config } from "../../Wagmi";

function Bridge() {
  const [hashUrl, setHashUrl] = useState("");
  const [submitHash, setSubmitHash] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { chain } = useAccount();
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function awaitTransactionConfirmation(trxHash) {
      const confirmHash = await waitForTransactionReceipt(config, {
        chainId: chain.id,
        hash: trxHash,
      });

      setIsProcessing(() => false);
      setIsModalOpen(() => true);
    }

    if (submitHash !== "") {
      awaitTransactionConfirmation(submitHash);
    }
  }, [submitHash]);
  return (
    <div className="flex justify-center items-center">
      {isModalOpen && (
        <div className="bg-gray-200 px-6 py-2 rounded-lg shadow-lg">
          <SuccessModal onClose={handleCloseModal} hashUrl={hashUrl} />
        </div>
      )}
      <HeroMain
        setSubmitHash={setSubmitHash}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}

export default Bridge;
