'use client';

import { useState } from 'react';
import { Button } from './index';
import ThemeToggle from '../ThemeToggle';

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
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(t => t.id !== idToClose);
    if (activeTabId === idToClose) {
      const closedIndex = tabs.findIndex(t => t.id === idToClose);
      const nextActive = newTabs[Math.max(0, closedIndex - 1)];
      setActiveTabId(nextActive.id);
    }
    setTabs(newTabs);
  };

  return (
    <div className="flex flex-col h-full w-full flex-1 min-h-0 -mt-6">
      {/* Integrated Pro Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)]/20 px-4 py-2 mb-4 -mx-4 md:-mx-6 backdrop-blur-sm">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          {/* Tool Title */}
          <span className="text-sm font-black uppercase tracking-tighter text-[var(--text)] whitespace-nowrap">
            {tabPrefix === 'Doc' ? 'Markdown' : tabPrefix}
          </span>
          
          <div className="h-4 w-px bg-[var(--border)] mx-1" />

          {/* Pro Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isActive 
                      ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text)] shadow-lg' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]/50'
                  }`}
                >
                  {tab.title}
                  {tabs.length > 1 && (
                    <span 
                      onClick={(e) => handleCloseTab(tab.id, e)}
                      className={`ml-1 flex h-4 w-4 items-center justify-center rounded-md hover:bg-red-500/20 hover:text-red-400 transition-colors ${isActive ? 'text-[var(--text-muted)]' : 'text-transparent group-hover:text-[var(--text-muted)]'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
            <button 
              onClick={handleAddTab}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
              title="New Tab"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        </div>

        {/* Action Portal + Security Badge + Theme Toggle */}
        <div className="flex items-center gap-4">
          <div id="tool-header-actions" className="flex items-center gap-2" />
          
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-500/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-green-400/90 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            STAYS IN BROWSER
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Tool Instances */}
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
