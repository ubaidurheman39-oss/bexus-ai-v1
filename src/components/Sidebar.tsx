import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  PanelLeftClose, 
  X,
  Sparkles,
  Brain,
  Globe,
  Mic,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { EchoLogo } from './EchoLogo';
import { sounds } from '../services/soundEffects';

export interface SavedChat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    attachments?: any[];
  }>;
}

export interface SavedProjectItem {
  id: string;
  title: string;
  type: 'code' | 'research' | 'model';
  timestamp: number;
  data: any;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: SavedChat[];
  activeChatId: string | null;
  onSelectChat: (chat: SavedChat) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onOpenStudio?: (studioKey: string) => void;
  savedProjects?: SavedProjectItem[];
  onSelectProject?: (proj: any) => void;
  onDeleteProject?: (id: string) => void;
  tier?: 'free' | 'pro';
  tokensUsed?: number;
  tokenLimit?: number;
  onOpenQuotaModal?: () => void;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenStudio,
  savedProjects = [],
  onSelectProject,
  onDeleteProject,
  tier = 'free',
  tokensUsed = 1550,
  tokenLimit = 10000,
  onOpenQuotaModal,
  isLightMode = false,
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats by search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase().trim();
    return chats.filter(chat => 
      chat.title.toLowerCase().includes(q) ||
      chat.messages.some(m => m.content.toLowerCase().includes(q))
    );
  }, [chats, searchQuery]);

  // Format relative timestamp
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const percentage = tier === 'pro' ? 15 : Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isLightMode 
            ? 'bg-white/95 border-r border-slate-200 text-slate-800' 
            : 'bg-[#0e0c17]/95 border-r border-purple-500/20 text-white'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}`}
        style={{
          boxShadow: isOpen 
            ? (isLightMode ? '4px 0 25px rgba(0, 0, 0, 0.08)' : '4px 0 30px rgba(0, 0, 0, 0.6), 1px 0 15px rgba(168, 85, 247, 0.1)') 
            : 'none'
        }}
      >
        {/* 1. TOP: Name of App + Logo + Close Toggle */}
        <div className={`h-16 px-4 flex items-center justify-between border-b shrink-0 ${
          isLightMode ? 'border-slate-100' : 'border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-2.5">
            <EchoLogo size={28} />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide">
                BEXUS <span className="text-purple-500 font-medium">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">

            <button
              onClick={() => {
                sounds.playClick();
                onToggle();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLightMode ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. New Chat Button */}
        <div className="p-3.5 pb-2 shrink-0 space-y-2">
          <button
            onClick={() => {
              sounds.playClick();
              onNewChat();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/45 hover:to-indigo-600/45 border border-purple-500/40 hover:border-purple-400/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span className={isLightMode ? 'text-purple-700 font-semibold' : 'text-white'}>New Chat</span>
          </button>
        </div>

        {/* 3. Search Bar */}
        <div className="px-3.5 py-1.5 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history & files..."
              className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs focus:outline-none transition-colors border ${
                isLightMode
                  ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500'
                  : 'bg-[#141221] border-white/[0.07] text-white placeholder-neutral-500 focus:border-purple-500/40'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>



        {/* 4. Chat History Header */}
        <div className="px-3.5 pt-3 pb-1 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
            Recent Chats
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">({filteredChats.length})</span>
        </div>

        {/* 5. Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <MessageSquare className="w-6 h-6 text-neutral-500 mx-auto mb-2 opacity-50" />
              <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                {searchQuery ? 'No chats match your search' : 'No saved chats yet'}
              </p>
              <p className={`text-[11px] mt-1 ${isLightMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                Start a conversation to save it automatically
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectChat(chat);
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-500/15 border border-purple-500/35 text-purple-600 dark:text-white font-medium'
                      : isLightMode
                      ? 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-transparent'
                      : 'hover:bg-white/[0.04] text-neutral-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <MessageSquare 
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-purple-400' : 'text-neutral-400 group-hover:text-purple-400'
                      }`} 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate leading-tight">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <span className={`text-[10px] block mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {formatTime(chat.updatedAt || chat.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* 6. User Profile & Logout */}
        <div className={`p-4 border-t shrink-0 ${
          isLightMode ? 'border-slate-200 bg-slate-50/80' : 'border-white/[0.06] bg-black/30'
        }`}>
          {currentUser ? (
            <div className="flex items-center justify-between gap-3 group/user">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full border border-purple-500/30 overflow-hidden shrink-0 bg-purple-500/10 flex items-center justify-center">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                    {currentUser.name || 'Bexus User'}
                  </p>
                  <p className="text-[9px] text-purple-400 font-semibold truncate">
                    {currentUser.email ? `${currentUser.email} • Pro Unlimited` : 'Pro Unlimited'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 py-0.5">
              <span className="text-[11px] text-neutral-400">Bexus Workspace</span>
              <span className="text-[10px] font-mono text-neutral-500">v2.5.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
