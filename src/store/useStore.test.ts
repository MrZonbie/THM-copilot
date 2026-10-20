import { useStore } from './useStore';
import type { RoomInfo } from '../types';

describe('Zustand Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    useStore.setState({ sessions: [], activeSessionId: null });
  });

  it('should create a new session', () => {
    const roomInfo: RoomInfo = {
      name: 'Test Room',
      description: 'A test room',
      objective: 'Find the flag',
    };

    useStore.getState().createSession(roomInfo);

    const state = useStore.getState();
    expect(state.sessions.length).toBe(1);
    expect(state.sessions[0].title).toBe('Test Room');
    expect(state.activeSessionId).toBe(state.sessions[0].id);
  });

  it('should add a message to an active session', () => {
    const roomInfo: RoomInfo = {
      name: 'Test Room',
      description: 'A test room',
      objective: 'Find the flag',
    };

    useStore.getState().createSession(roomInfo);
    const sessionId = useStore.getState().activeSessionId;

    if (sessionId) {
      useStore.getState().addMessage(sessionId, {
        role: 'user',
        content: 'Hello AI',
      });

      const session = useStore.getState().getActiveSession();
      expect(session?.messages.length).toBe(1);
      expect(session?.messages[0].content).toBe('Hello AI');
    } else {
      expect(sessionId).not.toBeNull();
    }
  });

  it('should delete a session', () => {
    const roomInfo: RoomInfo = {
      name: 'Test Room',
      description: 'A test room',
      objective: 'Find the flag',
    };

    useStore.getState().createSession(roomInfo);
    const sessionId = useStore.getState().activeSessionId;

    if (sessionId) {
      useStore.getState().deleteSession(sessionId);
      const state = useStore.getState();
      expect(state.sessions.length).toBe(0);
      expect(state.activeSessionId).toBeNull();
    } else {
      expect(sessionId).not.toBeNull();
    }
  });
});
