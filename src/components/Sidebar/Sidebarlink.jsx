import { NavLink, useLocation } from 'react-router-dom';
import navIcons from '@/assets/images/navIcons/icons.svg';
import { SidebarContext } from '../../context/SidebarContext';
import clsx from 'clsx';
import { useContext } from 'react';

function SidebarLink({ link }) {
  const location = useLocation();
  const active = location.pathname === link.path;

  const { isOpen } = useContext(SidebarContext);

  return (
    <NavLink
      to={link.path}
      className={`flex items-center gap-2 py-3 px-4 hover:text-white transition-colors font-medium ${
        active ? 'text-white bg-dark-300' : 'text-dark-100'
      }`}
    >
      <svg
        className={clsx(
          'w-6 h-6 transition-all flex-shrink-0',
          active && 'text-primary',
          isOpen ? 'ml-0' : 'ml-3 xl:ml-0'
        )}
      >
        <use xlinkHref={navIcons + link.icon}></use>
      </svg>
      <span
        className={clsx(
          'transition-opacity whitespace-nowrap',
          isOpen ? 'md:opacity-100' : 'md:opacity-0 xl:opacity-100'
        )}
      >
        {link.title}
      </span>
    </NavLink>
  );
}

export default SidebarLink;
