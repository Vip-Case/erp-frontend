"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
  return (
    <Tabs value={activeTab || undefined} onValueChange={onTabChange} className="h-full flex flex-col">
      <ScrollArea className="w-full">
        <TabsList className={`inline-flex h-10 items-center justify-start rounded-none border-b bg-background p-0 transition-all duration-300 ease-in-out`}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative"
            >
              {tab}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab);
                }}
                className="ml-2 rounded-full hover:bg-muted p-0.5 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="flex-grow overflow-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{tab}</h2>
            <p>Content for {tab} goes here.</p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabContainer;