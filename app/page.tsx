'use client';

import { useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import TabContainer from '@/components/TabContainer';
import { Button } from '@/components/ui/button';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuItemClick = (itemName: string) => {
    if (!openTabs.includes(itemName)) {
      setOpenTabs([...openTabs, itemName]);
    }
    setActiveTab(itemName);
  };

  const handleCloseTab = (tabName: string) => {
    const newOpenTabs = openTabs.filter((tab) => tab !== tabName);
    setOpenTabs(newOpenTabs);
    if (activeTab === tabName) {
      setActiveTab(newOpenTabs[newOpenTabs.length - 1] || null);
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F6F9]">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMenuItemClick={handleMenuItemClick}
      />
      <div className="flex flex-col flex-grow">
        <header className="bg-[#0A2647] text-white p-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2 text-white hover:bg-[#144272]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">₺ 34,2401</span>
              <span className="text-red-400">€ 37,1289</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#144272]">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <ThemeToggle />
              <Button variant="ghost" className="text-white hover:bg-[#144272]">
                <span className="mr-2">MN</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow overflow-hidden">
          {openTabs.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Image
                  src="/home.svg"
                  alt="Placeholder"
                  width={400}
                  height={400}
                  className="mx-auto mb-4"
                />
                <p className="text-gray-500">Menüden istediğiniz formu seçerek işlemlerinize başlayabilirsiniz.</p>
              </div>
            </div>
          ) : (
            <TabContainer
              tabs={openTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCloseTab={handleCloseTab}
              sidebarCollapsed={isSidebarCollapsed}
            />
          )}
        </main>
      </div>
    </div>
  );
}