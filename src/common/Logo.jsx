import { ReactComponent as LogoSvg } from '../assets/svg/Logo.svg';

function Logo({ iconOnly }) {
  return (
    <div className='flex items-center gap-1 pt-1'>
      <LogoSvg />
      {!iconOnly && (
        <img
          alt='logo'
          src='https://app.syntrum.com/images/svg-icons/logo-syntrum-text.svg'
        />
      )}
    </div>
  );
}

export default Logo;
