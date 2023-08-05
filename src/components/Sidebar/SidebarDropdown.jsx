import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import SidebarLink from './Sidebarlink';
import clsx from 'clsx';
import { SidebarContext } from '../../context/SidebarContext';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

function SidebarDropdown({ link }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isOpen } = useContext(SidebarContext);

  const location = useLocation();

  const hasActiveChildLink = Boolean(
    link.children.find((link) => link.path === location.pathname)
  );

  useEffect(() => {
    hasActiveChildLink && setIsDropdownOpen(hasActiveChildLink);
  }, [location]);

  return (
    <div
      className={`transition-colors ${
        isDropdownOpen || hasActiveChildLink ? 'bg-dark-400' : 'bg-transparent'
      }`}
    >
      <button
        className={`flex items-center gap-2 py-3 px-4 w-full text-dark-100 hover:text-white transition-colors font-medium`}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span
          style={{ transition: 'margin .2s ease' }}
          className={clsx(isOpen ? 'ml-0' : 'ml-3 xl:ml-0')}
        >
          {link.icon}
        </span>
        <span
          className={clsx(
            'transition-opacity whitespace-nowrap',
            isOpen ? 'md:opacity-100' : 'md:opacity-0 xl:opacity-100'
          )}
        >
          {link.title}
        </span>

        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 ml-auto transition-transform',
            isDropdownOpen && '-rotate-180'
          )}
        />
      </button>

      <motion.div
        className="overflow-hidden"
        animate={
          isDropdownOpen ? { height: link.children.length * 48 } : { height: 0 }
        }
        transition={{ duration: 0.2 }}
        initial={{ height: 0 }}
      >
        {link.children.map((childLink) => (
          <SidebarLink key={childLink.path} link={childLink} />
        ))}
      </motion.div>
    </div>
  );
}

export default SidebarDropdown;
