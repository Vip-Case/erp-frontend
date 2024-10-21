'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TabContainer from '@/components/TabContainer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

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
    <div className="flex h-screen bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMenuItemClick={handleMenuItemClick}
      />
      <div className="flex flex-col flex-grow">
        <header className="bg-primary text-primary-foreground p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Next.js DevExtreme App</h1>
        </header>
        <main
          className={`flex-grow overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'ml-16' : 'ml-16'
          }`}
        >
          <TabContainer
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCloseTab={handleCloseTab}
            sidebarCollapsed={isSidebarCollapsed}
          />
        </main>
      </div>
    </div>
  );
}
