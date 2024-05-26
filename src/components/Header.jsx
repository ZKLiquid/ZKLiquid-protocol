import clsx from "clsx";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logo from "../assets/images/ZKLiquidLogo.svg";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { ArrowSquareRight, HambergerMenu } from "iconsax-react";

import { SidebarContext } from "../context/SidebarContext";

import { useAccount } from "wagmi";
import WalletButton from "./WalletButton";

import SwitchNetworkDropdown from "./SwitchNetworkDropdown";
import { AnimatePresence, motion } from "framer-motion";

import sidebarLinks from "../constant/sidebarLinks.jsx";

function Header() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 xl:left-64 right-0 px-4 py-3 transition-all bg-black xl:px-8 xl:py-4 z-20",
        isOpen ? "md:left-64" : "md:left-20"
      )}
    >
      <div className="flex justify-between lg:hidden">
        <button onClick={() => setIsOpen((prev) => !prev)}>
          <HambergerMenu size="24" color="#fff" />
        </button>

        <Link to="/">
          <img src={logo} alt="ZKLiquid" className="h-[24px] w-auto" />
        </Link>

        <button onClick={() => setIsMobilePopupOpen((prev) => !prev)}>
          <EllipsisHorizontalIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="items-center justify-between hidden lg:flex">
        <div className="flex gap-4">
          <button
            className={clsx("xl:hidden pr-4 border-r border-dark-300")}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ArrowSquareRight
              className={isOpen ? "rotate-180" : ""}
              size="24"
              color="#4C9BE8"
            />
          </button>

          <div className="flex gap-2.5">
            {/* <h1 className="heading-primary">Liquidity Protocol</h1> */}
            {/* {sidebarLinks.map((link) => (
              <NavLink
                className={({ isActive }) => {
                  const navClasses =
                    "py-1.5 px-5 inline-block rounded-md transition-colors hover:bg-dark-400";
                  return isActive ? `!bg-[#2769E4] ${navClasses}` : navClasses;
                }}
                key={link.path}
                to={link.path}
              >
                <span className="text-sm font-semibold capitalize">
                  {link.title}
                </span>
              </NavLink>
            ))} */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <WalletButton />
          {isConnected && <SwitchNetworkDropdown />}
        </div>
      </div>

      <div className="lg:hidden">
        <AnimatePresence>
          {isMobilePopupOpen && (
            <motion.div
              key="mobile-popup"
              initial={{ y: "-100%" }}
              animate={{ y: 0, transition: { ease: "easeOut", duration: 0.2 } }}
              exit={{
                y: "-100%",
                transition: { ease: "easeIn", duration: 0.2 },
              }}
              className={clsx(
                "fixed top-0 left-0 w-full p-3 z-20 bg-dark-500 py-4 space-y-3",
                isOpen ? "md:left-64" : "md:left-20"
              )}
            >
              <WalletButton width="full" />
              {isConnected && <SwitchNetworkDropdown width="full" />}
            </motion.div>
          )}

          {isMobilePopupOpen && (
            <motion.div
              key="overlay"
              className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black/70 min-h-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobilePopupOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Header;
