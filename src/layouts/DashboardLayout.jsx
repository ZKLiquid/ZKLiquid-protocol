import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

import Header from '../components/Header';
import links from '../constant/sidebarLinks';
import { SidebarContextProvider } from '../context/SidebarContext';

function DashboardLayout() {
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Set the default page (defi)
  const [page, setPage] = useState(Object.keys(links)[0]);

  // Gettin and Setting the name of the active page
  useEffect(() => {
    const paths = pathname.split('/');
    const currentPage = paths[1];

    setPage(currentPage);
  }, [pathname]);

  return (
    <SidebarContextProvider>
      <div className="flex bg-black min-h-app ">
        <Sidebar sidebarOpen={sidebarOpen} links={links[page]} />
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          links={Object.keys(links)}
        />
        <div className="px-4 py-6 xl:px-8 mt-12 lg:mt-[66px] md:ml-20 xl:ml-64 w-full">
          <Outlet />
        </div>
      </div>
    </SidebarContextProvider>
  );
}

export default DashboardLayout;
