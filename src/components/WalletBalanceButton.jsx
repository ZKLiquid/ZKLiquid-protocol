import { useState } from 'react';
import { ReactComponent as WalletSvg } from '../assets/svg/wallet-balance.svg';
import ModalRight from '../common/ModalRight';

import { useAccount, useBalance } from 'wagmi';
import clsx from 'clsx';

function WalletBalanceButton({ width }) {
  const [isOpenBalanceModal, setIsOpenBalanceModal] = useState(false);

  const { address } = useAccount();

  const { data } = useBalance({ address });

  return (
    <>
      <button
        onClick={() => setIsOpenBalanceModal(true)}
        className={clsx(
          'flex gap-2 items-center p-1 pr-3 rounded-full text-sm font-medium border border-dark-300 transition-colors bg-dark-400 hover:bg-dark-300',
          width === 'full' && 'w-full'
        )}
      >
        <WalletSvg />
        Wallet Balance
      </button>

      <ModalRight
        open={isOpenBalanceModal}
        onClose={() => setIsOpenBalanceModal(false)}
        heading="Wallet Balance"
      >
        <div className="space-y-3 text-sm font-medium">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                className="w-6 h-6"
                src={`/cryptoIcons/${data?.symbol.toLowerCase()}.svg`}
                alt=""
              />
              {data?.symbol}
            </div>{' '}
            {data?.formatted}
          </div>
        </div>
      </ModalRight>
    </>
  );
}

export default WalletBalanceButton;
