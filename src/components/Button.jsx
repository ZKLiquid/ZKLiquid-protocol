// button component
import React from "react";

function Button({ children, className, onClick, disabled, ...rest }) {
  return (
    <button
      // className={`${
      //   disabled
      //     ? "bg-gray-500 cursor-not-allowed"
      //     : "bg-gradient-to-r from-[#DC40A4] to-[#6749D5]"
      // } w-full rounded-lg py-3 ${className}`}
      className={`${
        disabled
          ? "bg-gray-500 cursor-not-allowed"
          : " text-black font-bold bg-teal-400"
      } w-full rounded-lg py-3 ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
