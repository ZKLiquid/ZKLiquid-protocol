import { Fragment, useEffect, useState, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAccount, useSwitchChain } from "wagmi";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ArrowDown2 } from "iconsax-react";
import { toast } from "react-toastify";
import { config } from "../Wagmi";
import { destinationSelectors } from "../contracts/destination-selector";
import { SidebarContext } from "../context/SidebarContext";

function DestinationChainDropdown({
  width,
  selectedId,
  setSelectedId,
  isMobile,
}) {
  const { chain } = useAccount();
  const { chains, error, isLoading, pendingChainId, switchChain } =
    useSwitchChain();
  const { isXLM } = useContext(SidebarContext);

  const XLM_Chain = { name: "FUTURENET", id: 2024 };

  const allChains = isXLM ? chains : [XLM_Chain, ...chains];

  const selectedDestinationChain =
    selectedId && allChains.filter((x) => x.id === selectedId);

  const nameLength = isMobile ? 10 : 14;

  function handleSelectXLM() {
    setSelectedId(() => 2024);
  }
  useEffect(() => {
    setSelectedId();
  }, [isXLM]);
  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Menu
      as="div"
      className={clsx(
        "relative inline-block text-left",
        width === "full" && "w-full"
      )}
    >
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              "flex gap-2 items-center p-1 pr-2.5 rounded-full text-sm  w-full lg:w-[185px] font-medium border border-gray-400 transition-colors hover:bg-dark-300",
              width === "full" && "w-full",
              open ? "bg-dark-300" : "bg-dark-400"
            )}
          >
            {selectedId ? (
              <>
                <div className="bg-[#101115] p-1 rounded-full">
                  <img
                    className="w-6 h-6"
                    src={`/cryptoIcons/${selectedDestinationChain[0]?.id}.svg`}
                    alt=""
                  />
                </div>

                <span className="lg:hidden xl:inline">
                  {selectedDestinationChain[0]?.name.length > nameLength
                    ? selectedDestinationChain[0]?.name.slice(
                        0,
                        nameLength - 3
                      ) + "..."
                    : selectedDestinationChain[0]?.name}
                </span>
              </>
            ) : (
              <>
                {" "}
                <div className="bg-[#101115] p-1 rounded-full">
                  <img
                    className="w-6 h-6"
                    src={`/cryptoIcons/select.svg`}
                    alt=""
                  />
                </div>
                <span className="lg:hidden xl:inline">
                  {isMobile ? "Select..." : "Select Network"}
                </span>
              </>
            )}
            <ArrowDown2
              size="16"
              color="#fff"
              className={clsx(
                "transition-transform will-change-transform ml-auto",
                open && "rotate-180"
              )}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 z-10 w-56 py-1 mt-2 origin-top-right border rounded-md shadow-lg bg-dark-400 border-dark-300 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {allChains.map((x) => (
                <Menu.Item key={x.id}>
                  <button
                    key={x.id}
                    disabled={!switchChain || x.id === chain?.id}
                    // onClick={() => switchChain?.(x.id)}
                    onClick={() => setSelectedId(x.id)}
                    className={clsx(
                      "px-4 py-2 text-sm transition-colors flex items-center gap-2 w-full text-left hover:bg-dark-300",
                      !switchChain || (x.id === chain?.id && "!hidden")
                    )}
                  >
                    <img
                      className="w-6 h-6"
                      src={`/cryptoIcons/${x.id}.svg`}
                      alt=""
                    />
                    {x.name}
                    {isLoading && pendingChainId === x.id && " (switching)"}
                  </button>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default DestinationChainDropdown;
