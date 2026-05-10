'use client';

import { useState } from 'react';
import { Button } from './index';

interface TabbedToolViewerProps {
  /** The React component representing the tool */
  toolComponent: React.ComponentType;
  /** Title prefix for new tabs, e.g. "Card" -> "Card 1" */
  tabPrefix?: string;
}

export default function TabbedToolViewer({ toolComponent: ToolComponent, tabPrefix = "Card" }: TabbedToolViewerProps) {
  const [tabs, setTabs] = useState([{ id: 1, title: `${tabPrefix} 1` }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const handleAddTab = () => {
    const newTab = { id: nextId, title: `${tabPrefix} ${nextId}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextId);
    setNextId(nextId + 1);
  };

  const handleCloseTab = (idToClose: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking tab
    if (tabs.length === 1) return; // Don't close the last tab
    
    const newTabs = tabs.filter(t => t.id !== idToClose);
    if (activeTabId === idToClose) {
      // switch to the previous tab or the first one available
      const closedIndex = tabs.findIndex(t => t.id === idToClose);
      const nextActive = newTabs[Math.max(0, closedIndex - 1)];
      setActiveTabId(nextActive.id);
    }
    setTabs(newTabs);
  };

  return (
    <div className="flex flex-col h-full w-full flex-1 min-h-0">
      {/* Tab Bar — must not grow/shrink so tool instance fills remaining space */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 mb-3 border-b border-[var(--border)] pb-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors border-b-2 -mb-[10px] ${
                isActive 
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {tab.title}
              {tabs.length > 1 && (
                <span 
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full hover:bg-[var(--bg)]/50 ${isActive ? 'text-[var(--accent)] hover:text-white' : 'text-[var(--text-muted)]'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </span>
              )}
            </button>
          );
        })}
        <Button variant="secondary" onClick={handleAddTab} className="ml-2 !py-1 !px-2 flex items-center gap-1 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New {tabPrefix}
        </Button>
      </div>

      {/* Tool Instances — fill all remaining height */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`flex-1 min-h-0 flex-col overflow-hidden ${tab.id === activeTabId ? 'flex' : 'hidden'}`}
          >
            <ToolComponent />
          </div>
        ))}
      </div>
    </div>
  );
}
