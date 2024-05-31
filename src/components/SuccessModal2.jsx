import { CloseCircle } from "iconsax-react";
import React, { useRef, useEffect } from "react";

const SuccessModal = ({ onClose, hashUrl }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const BASE_CCIP_URL = "https://ccip.chain.link/msg";
  const handleCCIPOpen = () => {
    window.open(`${BASE_CCIP_URL}/${hashUrl}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className=" w-full max-w-sm bg-white shadow-lg rounded-xl"
      >
        <button
          onClick={() => onClose()}
          className="w-full justify-end items-end flex p-1"
        >
          {" "}
          <CloseCircle size="32" color="#555555" />
        </button>
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="mt-5 text-xl font-bold text-gray-900">
              Test tokens successfully sent
            </p>

            <div className="mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
