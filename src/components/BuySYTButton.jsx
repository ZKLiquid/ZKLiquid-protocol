import clsx from 'clsx';
import syntrumImg from '@/assets/svg/syntrum-coin.svg';

function BuySYTButton({ width }) {
  return (
    <>
      <a
        href='https://syntrum.com/syntrum-token.html'
        target="_blank"
        className={clsx(
          'flex gap-2 items-center p-1 pr-3 rounded-full text-sm font-medium border border-dark-300 transition-colors bg-dark-400 hover:bg-dark-300',
          width === 'full' && 'w-full'
        )}
      >
        <img src={syntrumImg} className="flex-shrink-0 w-8 h-8" alt="" />
        Buy SYT Token
      </a>
    </>
  );
}

export default BuySYTButton;
