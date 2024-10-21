"use client";

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import Image from 'next/image';

interface TabContainerProps {
  tabs: string[];
  activeTab: string | null;
  onTabChange: (tabName: string) => void;
  onCloseTab: (tabName: string) => void;
  sidebarCollapsed: boolean;
}

const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onCloseTab,
  sidebarCollapsed,
}) => {
  const [tabsHeight, setTabsHeight] = useState(0);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLayout = () => {
      if (tabsListRef.current && containerRef.current) {
        const tabsListElement = tabsListRef.current;
        const tabElements = tabsListElement.querySelectorAll('[role="tab"]');
        
        if (tabElements.length > 0) {
          const firstTabRect = tabElements[0].getBoundingClientRect();
          const lastTabRect = tabElements[tabElements.length - 1].getBoundingClientRect();
          const rowCount = Math.ceil((lastTabRect.bottom - firstTabRect.top) / firstTabRect.height);
          
          const newTabsHeight = rowCount * firstTabRect.height;
          setTabsHeight(newTabsHeight);
          
          // Adjust the main content's top padding to start from the bottom of the tabs
          const contentElement = containerRef.current.querySelector('.tab-content') as HTMLElement;
          if (contentElement) {
            contentElement.style.paddingTop = `${newTabsHeight}px`;
          }
          
          // Set the height of the TabsList container
          tabsListElement.style.height = `${newTabsHeight}px`;
        }
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, [tabs]);

  return (
    <div ref={containerRef} className="h-full flex flex-col relative">
      <Tabs value={activeTab || undefined} onValueChange={onTabChange} className="flex-grow flex flex-col">
        <div 
          ref={tabsListRef} 
          className="w-full border-b bg-muted absolute top-0 left-0 z-10 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <TabsList className="flex flex-wrap items-start justify-start p-0 bg-muted">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative border-r last:border-r-0 h-10"
              >
                {tab}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab);
                  }}
                  className="ml-2 rounded-full hover:bg-background p-0.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex-grow overflow-auto tab-content">
          {tabs.length === 0 ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Image
                  src="/home.svg"
                  alt="Placeholder"
                  width={400}
                  height={400}
                  className="mx-auto mb-4"
                />
                <p className="text-muted-foreground">Menüden istediğiniz formu seçerek işlemlerinize başlayabilirsiniz.</p>
              </div>
            </div>
          ) : (
            tabs.map((tab) => (
              <TabsContent key={tab} value={tab} className="h-full">
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">{tab}</h2>
                  <p className="text-muted-foreground">Content for {tab} goes here.</p>
                </div>
              </TabsContent>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default TabContainer;