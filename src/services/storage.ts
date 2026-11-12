import { User, ChatSession, Message, ModelId } from '../types/index.ts';

const USERS_KEY = 'bexus_users_v2';
const CURRENT_USER_KEY = 'bexus_current_user_v2';
const SESSIONS_KEY_PREFIX = 'bexus_chats_v2_';

export const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces&auto=format&q=65',
];

export const INITIAL_WELCOME_CHAT = (userId: string, userName: string): ChatSession => ({
  id: 'chat_welcome_' + Date.now(),
  userId,
  title: `Welcome, ${userName}!`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  model: 'bexus-v1',
  isPinned: true,
  category: 'general',
  tags: ['Welcome', 'Workspace'],
  messages: [
    {
      id: 'msg_welcome_ai_' + Date.now(),
      role: 'assistant',
      content: `### Welcome to Bexus AI Workspace, **${userName}**! ⚡

Aapka account ready hai! You can talk to me in **English**, **Roman Urdu** (اردو), or any language of your choice — I will automatically respond in the exact language you use.

Key capabilities at your fingertips:
- 🧠 **Deep Reasoning & Code**: Instant coding, debugging, logic & problem solving.
- 🎨 **Image Studio**: High-definition concept art & photorealistic visuals.
- 🎵 **Music Studio**: Ambient synth loops, chords & generative audio.
- ⚡ **Live Canvas**: Real-time frontend HTML/React preview sandbox.

Ask a question in English or Urdu below to begin!`,
      timestamp: Date.now(),
      thinkingSteps: [
        'Initialized secure personal user workspace',
        'Enabled automatic dynamic language detection (English / Roman Urdu / Urdu)',
        'System ready for user prompts'
      ],
      thinkingTimeSec: 0.5
    }
  ]
});

// Storage Methods
export const StorageService = {
  // Clear all previous legacy accounts completely
  purgeOldAccounts(): void {
    try {
      localStorage.removeItem('bexus_users_v1');
      localStorage.removeItem('bexus_current_user_v1');
      // Also clear legacy session keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('bexus_chats_v1_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
  },

  // Authentication
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUser(user: User): void {
    const users = this.getUsers().filter(u => u.id !== user.id);
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    try {
      // Always purge old version storage on check
      this.purgeOldAccounts();
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      this.saveUser(user);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  clearAllAccounts(): void {
    try {
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(SESSIONS_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error(e);
    }
  },

  // Chat Sessions
  getSessions(userId: string): ChatSession[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY_PREFIX + userId);
      if (data) {
        const sessions: ChatSession[] = JSON.parse(data);
        return sessions.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  saveSessions(userId: string, sessions: ChatSession[]): void {
    try {
      localStorage.setItem(SESSIONS_KEY_PREFIX + userId, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage:', e);
    }
  },

  createSession(userId: string, title: string = 'New Conversation', model: ModelId = 'bexus-v1'): ChatSession {
    const newSession: ChatSession = {
      id: 'bexus_chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model,
      isPinned: false,
      messages: [],
      tags: [],
    };
    const sessions = this.getSessions(userId);
    const updated = [newSession, ...sessions];
    this.saveSessions(userId, updated);
    return newSession;
  },

  updateSession(userId: string, updatedSession: ChatSession): void {
    const sessions = this.getSessions(userId);
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
      sessions[index] = updatedSession;
      this.saveSessions(userId, sessions);
    }
  },

  deleteSession(userId: string, sessionId: string): void {
    const sessions = this.getSessions(userId);
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(userId, filtered);
  },

  clearAllSessions(userId: string): void {
    this.saveSessions(userId, []);
  },

  // Export / Import
  exportData(userId: string): string {
    const sessions = this.getSessions(userId);
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return JSON.stringify({
      version: '2.0',
      exportedAt: Date.now(),
      user,
      sessions,
    }, null, 2);
  },

  importData(userId: string, jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        this.saveSessions(userId, parsed.sessions);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
