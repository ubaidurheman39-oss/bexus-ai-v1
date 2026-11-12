import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession, User } from '../../types';
import { sounds } from '../../services/soundEffects';
import { BexusLogo } from '../common/BexusLogo';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Download, 
  PanelLeftClose, 
  Settings, 
  Code, 
  Music, 
  GraduationCap, 
  ImageIcon,
  LogIn,
  Bot,
  Sparkles
} from 'lucide-react';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onUpdateSession: (session: ChatSession) => void;
  user: User;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onOpenUltraModal?: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onUpdateSession,
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenLogin,
  onOpenUltraModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuSessionId, setMenuSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Grouping
  const now = Date.now();
  const oneDay = 86400000;
  const pinnedList = filteredSessions.filter(s => s.isPinned);
  const unpinned = filteredSessions.filter(s => !s.isPinned);

  const todayList = unpinned.filter(s => now - s.updatedAt < oneDay);
  const yesterdayList = unpinned.filter(s => now - s.updatedAt >= oneDay && now - s.updatedAt < 2 * oneDay);
  const last7DaysList = unpinned.filter(s => now - s.updatedAt >= 2 * oneDay && now - s.updatedAt < 7 * oneDay);
  const olderList = unpinned.filter(s => now - s.updatedAt >= 7 * oneDay);

  const handleStartRename = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
    setMenuSessionId(null);
  };

  const handleSaveRename = (session: ChatSession) => {
    if (editTitle.trim()) {
      onUpdateSession({ ...session, title: editTitle.trim() });
    }
    setEditingSessionId(null);
  };

  const handleTogglePin = (session: ChatSession) => {
    sounds.playClick();
    onUpdateSession({ ...session, isPinned: !session.isPinned });
    setMenuSessionId(null);
  };

  const handleExportChat = (session: ChatSession) => {
    sounds.playClick();
    const markdown = `# ${session.title}\n*Exported from Bexus AI - ${new Date(session.createdAt).toLocaleString()}*\n\n` +
      session.messages.map(m => `### ${m.role === 'user' ? user.name : 'Bexus AI'}\n${m.content}\n`).join('\n---\n\n');
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuSessionId(null);
  };

  const renderSessionItem = (session: ChatSession) => {
    const isActive = session.id === currentSessionId;
    const isEditing = editingSessionId === session.id;

    return (
      <div
        key={session.id}
        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg transition-all cursor-pointer ${
          isActive
            ? 'bg-zinc-800/90 text-white font-medium shadow-sm'
            : 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
        }`}
        onClick={() => {
          if (!isEditing) {
            sounds.playClick();
            onSelectSession(session.id);
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1.5">
          {session.isPinned ? (
            <Pin className="w-3.5 h-3.5 text-blue-400 shrink-0 rotate-45" />
          ) : session.category === 'coding' ? (
            <Code className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          ) : session.category === 'music' ? (
            <Music className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          ) : session.category === 'learning' ? (
            <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0 transition-colors" />
          )}

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => handleSaveRename(session)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveRename(session);
                if (e.key === 'Escape') setEditingSessionId(null);
              }}
              autoFocus
              className="w-full bg-zinc-900 border border-blue-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs truncate">{session.title || 'New Chat'}</span>
          )}
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              sounds.playClick();
              setMenuSessionId(menuSessionId === session.id ? null : session.id);
            }}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {menuSessionId === session.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-[#1a1b22] border border-white/[0.1] shadow-2xl p-1 z-30 space-y-0.5"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => handleTogglePin(session)}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.08] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{session.isPinned ? 'Unpin' : 'Pin Chat'}</span>
                </button>
                <button
                  onClick={() => handleStartRename(session)}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.08] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => handleExportChat(session)}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.08] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Export (.md)</span>
                </button>
                <div className="border-t border-white/[0.06] my-1" />
                <button
                  onClick={() => {
                    sounds.playClick();
                    onDeleteSession(session.id);
                    setMenuSessionId(null);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Chat</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 flex flex-col bg-[#0f1015] border-r border-white/[0.08] transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BexusLogo size="md" withGlow={true} />
            <div>
              <div className="font-bold text-sm tracking-tight text-zinc-100">Bexus AI</div>
              <div className="text-[10px] text-zinc-400 font-medium">Workspace Engine</div>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] lg:hidden cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-2.5">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sounds.playClick();
              onNewChat();
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-all text-xs font-semibold group cursor-pointer shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Chat</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">⌘K</span>
          </motion.button>
        </div>

        {/* Gemini Ultra Suite Hub Entry */}
        {onOpenUltraModal && (
          <div className="px-2.5 pb-2">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenUltraModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-500/15 to-orange-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-300 transition-all cursor-pointer shadow-sm group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Ultra Features Suite</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono">
                ULTRA PRO
              </span>
            </button>
          </div>
        )}

        {/* Search */}
        <div className="px-2.5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-900/90 border border-white/[0.08] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/[0.2] transition-all"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-3 py-1 scrollbar-thin">
          {pinnedList.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-2 mb-1 flex items-center gap-1.5">
                <Pin className="w-2.5 h-2.5 rotate-45" />
                <span>Pinned</span>
              </div>
              {pinnedList.map(renderSessionItem)}
            </div>
          )}

          {todayList.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-1 mt-2">
                Today
              </div>
              {todayList.map(renderSessionItem)}
            </div>
          )}

          {yesterdayList.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-1 mt-2">
                Yesterday
              </div>
              {yesterdayList.map(renderSessionItem)}
            </div>
          )}

          {last7DaysList.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-1 mt-2">
                Previous 7 Days
              </div>
              {last7DaysList.map(renderSessionItem)}
            </div>
          )}

          {olderList.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-1 mt-2">
                Older
              </div>
              {olderList.map(renderSessionItem)}
            </div>
          )}

          {filteredSessions.length === 0 && (
            <div className="p-4 text-center text-zinc-500 text-xs">
              No conversations found.
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-white/[0.06] bg-[#0c0d10]">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.1] shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  width={32} 
                  height={32} 
                  loading="lazy" 
                  decoding="async" 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{user.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">Verified Account</div>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLogin();
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Switch Account"
              >
                <LogIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenSettings();
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
