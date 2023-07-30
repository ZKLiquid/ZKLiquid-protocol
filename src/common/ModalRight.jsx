import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function ModalRight({ open, onClose, heading, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-end text-center overflow-x-clip">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative transform overflow-hidden  bg-dark-400 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-xs sm:max-w-sm sm:p-6 text-dark-50">
                {heading && (
                  <div className="border-b border-dark-300 pb-5">
                    <h3 className="text-xl font-medium">{heading}</h3>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-white hover:text-dark-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className={heading ? 'mt-5' : 'mt-12'}>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ModalRight;
