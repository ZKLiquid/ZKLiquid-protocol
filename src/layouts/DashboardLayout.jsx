import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

import Header from '../components/Header';
import sidebarLinks from '../constant/sidebarLinks';
import { SidebarContextProvider } from '../context/SidebarContext';

function DashboardLayout() {
  const location = useLocation();

  // Set the default page (swap)
  const [currentPageLinks, setCurrentPageLinks] = useState(sidebarLinks[0]);
  console.log('Dashboard:', sidebarLinks);

  useEffect(() => {
    const currentPath = '/' + location.pathname.split('/')[1];

    // filter links to get the current page
    const currentLinks = sidebarLinks.find((link) => link.path === currentPath);

    // set the current page
    setCurrentPageLinks(currentLinks);
  }, [location]);

  return (
    <SidebarContextProvider>
      <div className="flex bg-black min-h-app ">
        <Sidebar currentPageLinks={currentPageLinks} />
        <Header />
        <div className="px-4 py-6 xl:px-8 mt-12 lg:mt-[66px] md:pl-24 xl:pl-72 w-full">
          <Outlet />
        </div>
      </div>
    </SidebarContextProvider>
  );
}

export default DashboardLayout;
