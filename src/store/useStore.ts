import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, Message, Evidence, RoomInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  sessions: Session[];
  activeSessionId: string | null;

  // Actions
  createSession: (roomInfo: RoomInfo) => void;
  setActiveSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  addEvidence: (sessionId: string, evidence: Omit<Evidence, 'id'>) => void;
  updateRoomInfo: (sessionId: string, info: Partial<RoomInfo>) => void;
  deleteSession: (id: string) => void;

  // Selectors/Computed (using state)
  getActiveSession: () => Session | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (roomInfo) => {
        const newSession: Session = {
          id: uuidv4(),
          title: roomInfo.name || 'Untitled Investigation',
          roomInfo,
          messages: [],
          evidence: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: newSession.id,
        }));
      },

      setActiveSession: (id) => {
        set({ activeSessionId: id });
      },

      addMessage: (sessionId, messageData) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              const newMessage: Message = {
                ...messageData,
                id: uuidv4(),
                timestamp: Date.now(),
              };
              return {
                ...session,
                messages: [...session.messages, newMessage],
                updatedAt: Date.now(),
              };
            }
            return session;
          }),
        }));
      },

      addEvidence: (sessionId, evidenceData) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              const newEvidence: Evidence = {
                ...evidenceData,
                id: uuidv4(),
              };
              return {
                ...session,
                evidence: [...session.evidence, newEvidence],
                updatedAt: Date.now(),
              };
            }
            return session;
          }),
        }));
      },

      updateRoomInfo: (sessionId, info) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                roomInfo: { ...session.roomInfo, ...info },
                updatedAt: Date.now(),
              };
            }
            return session;
          }),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
        }));
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId);
      },
    }),
    {
      name: 'thm-copilot-storage', // name of the item in the storage (must be unique)
    }
  )
);
