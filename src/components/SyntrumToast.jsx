import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { NETWORK_COINS } from "../constant/globalConstants";

const SyntrumToast = ({ title, platformId, transactionId = null, content = '' }) => {
  const shortenAddress = (address) => {
    return address.slice(0, 8) + '...';
  }

  return (
    <div>
      <p className="text-[18px]">{title}</p>
      <div className="text-[14px]">
        {transactionId !== null ? (
          <>
            <span>View on {NETWORK_COINS[platformId].scan}: </span>
            <a href={`${NETWORK_COINS[platformId].explorer}tx/${transactionId}`} target="_blank" className="ml-1 text-[#4C9BE8]">
              <span className="text-white">{shortenAddress(transactionId)}</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </>
        ) : (
          <p>{content}</p>
        )}
        
      </div>
    </div>
  );
};

export default SyntrumToast;