export interface PeerUser {
  id: string;
  username: string;
  avatar: string;
  level: number;
  civicScore: number;
  lifeScore: number;
  lastSeen: Date;
  isConnected: boolean;
  distance?: number; // in meters
  signal?: 'weak' | 'medium' | 'strong';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'fitness' | 'civic' | 'career' | 'learning';
  participants: string[];
  deadline: Date;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdBy: string;
  progress?: Record<string, number>; // userId -> progress percentage
}

export interface P2PMessage {
  id: string;
  type: 'friend_request' | 'challenge_invite' | 'achievement' | 'chat' | 'status_update';
  from: string;
  to: string;
  content: any;
  timestamp: Date;
  isRead: boolean;
}

class P2PSocialService {
  private localUser: PeerUser | null = null;
  private discoveredUsers: Map<string, PeerUser> = new Map();
  private connectedUsers: Map<string, PeerUser> = new Map();
  private messages: P2PMessage[] = [];
  private messageHandlers: Map<string, (message: P2PMessage) => void> = new Map();
  private isDiscovering = false;
  private discoveryInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeP2P();
  }

  private initializeP2P() {
    // Simulate WebRTC/Bluetooth discovery using localStorage and periodic checks
    // In a real implementation, this would use WebRTC DataChannels or Web Bluetooth API
    
    // Listen for storage events to detect other users
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    
    // Simulate periodic discovery of nearby users
    this.startDiscovery();
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key?.startsWith('p2p_user_')) {
      const userData = event.newValue;
      if (userData) {
        try {
          const user: PeerUser = JSON.parse(userData);
          if (user.id !== this.localUser?.id) {
            this.discoveredUsers.set(user.id, user);
            this.dispatchUserDiscovered(user);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }

  private startDiscovery() {
    if (this.discoveryInterval) return;
    
    this.isDiscovering = true;
    
    // Broadcast our presence every 5 seconds
    this.discoveryInterval = setInterval(() => {
      if (this.localUser) {
        this.broadcastPresence();
        this.simulateNearbyUsers();
      }
    }, 5000);
  }

  private stopDiscovery() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
    this.isDiscovering = false;
  }

  private broadcastPresence() {
    if (!this.localUser) return;
    
    const presenceData = {
      ...this.localUser,
      lastSeen: new Date(),
      timestamp: Date.now()
    };
    
    localStorage.setItem(`p2p_user_${this.localUser.id}`, JSON.stringify(presenceData));
    
    // Clean up old presence data (older than 30 seconds)
    const cutoff = Date.now() - 30000;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('p2p_user_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && data.timestamp < cutoff) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  private simulateNearbyUsers() {
    // Simulate discovering nearby users with random data
    const mockUsers: Partial<PeerUser>[] = [
      {
        id: 'user-nearby-1',
        username: 'HealthyMike',
        avatar: '💪',
        level: 12,
        civicScore: 850,
        lifeScore: 1200,
        distance: Math.floor(Math.random() * 100) + 10,
        signal: 'strong'
      },
      {
        id: 'user-nearby-2',
        username: 'EcoWarrior',
        avatar: '🌱',
        level: 8,
        civicScore: 1200,
        lifeScore: 900,
        distance: Math.floor(Math.random() * 200) + 50,
        signal: 'medium'
      },
      {
        id: 'user-nearby-3',
        username: 'TechLeader',
        avatar: '🚀',
        level: 15,
        civicScore: 600,
        lifeScore: 1800,
        distance: Math.floor(Math.random() * 300) + 100,
        signal: 'weak'
      }
    ];

    // Randomly add/remove users to simulate movement
    mockUsers.forEach(userData => {
      if (Math.random() > 0.3) { // 70% chance to be discovered
        const user: PeerUser = {
          ...userData,
          lastSeen: new Date(),
          isConnected: this.connectedUsers.has(userData.id!)
        } as PeerUser;
        
        if (!this.discoveredUsers.has(user.id)) {
          this.discoveredUsers.set(user.id, user);
          this.dispatchUserDiscovered(user);
        } else {
          // Update existing user
          this.discoveredUsers.set(user.id, user);
        }
      }
    });
  }

  private dispatchUserDiscovered(user: PeerUser) {
    const event = new CustomEvent('p2p-user-discovered', { detail: user });
    window.dispatchEvent(event);
  }

  setLocalUser(user: PeerUser) {
    this.localUser = user;
    this.broadcastPresence();
  }

  getDiscoveredUsers(): PeerUser[] {
    return Array.from(this.discoveredUsers.values())
      .filter(user => user.id !== this.localUser?.id)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  getConnectedUsers(): PeerUser[] {
    return Array.from(this.connectedUsers.values());
  }

  async connectToUser(userId: string): Promise<boolean> {
    const user = this.discoveredUsers.get(userId);
    if (!user) return false;

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 1000));

    user.isConnected = true;
    this.connectedUsers.set(userId, user);
    
    // Send connection established message
    this.sendMessage(userId, 'status_update', { type: 'connected' });
    
    return true;
  }

  disconnectFromUser(userId: string): boolean {
    const user = this.connectedUsers.get(userId);
    if (!user) return false;

    user.isConnected = false;
    this.connectedUsers.delete(userId);
    
    return true;
  }

  sendMessage(toUserId: string, type: P2PMessage['type'], content: any): boolean {
    if (!this.localUser) return false;

    const message: P2PMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type,
      from: this.localUser.id,
      to: toUserId,
      content,
      timestamp: new Date(),
      isRead: false
    };

    this.messages.push(message);
    
    // In a real implementation, this would send via WebRTC DataChannel
    // For simulation, we'll store in localStorage
    const messageKey = `p2p_message_${toUserId}_${message.id}`;
    localStorage.setItem(messageKey, JSON.stringify(message));
    
    return true;
  }

  onMessage(type: P2PMessage['type'], handler: (message: P2PMessage) => void) {
    this.messageHandlers.set(type, handler);
  }

  sendFriendRequest(userId: string): boolean {
    return this.sendMessage(userId, 'friend_request', {
      username: this.localUser?.username,
      avatar: this.localUser?.avatar,
      level: this.localUser?.level
    });
  }

  sendChallengeInvite(userId: string, challenge: Challenge): boolean {
    return this.sendMessage(userId, 'challenge_invite', challenge);
  }

  shareAchievement(userId: string, achievement: any): boolean {
    return this.sendMessage(userId, 'achievement', {
      achievement,
      sharedBy: this.localUser?.username
    });
  }

  createChallenge(challenge: Omit<Challenge, 'id' | 'createdBy'>): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge-${Date.now()}`,
      createdBy: this.localUser?.id || 'unknown'
    };

    // Broadcast challenge to connected users
    this.connectedUsers.forEach((user, userId) => {
      this.sendChallengeInvite(userId, newChallenge);
    });

    return newChallenge;
  }

  getMessages(): P2PMessage[] {
    return this.messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  markMessageAsRead(messageId: string) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.isRead = true;
    }
  }

  cleanup() {
    this.stopDiscovery();
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    
    // Clean up our presence data
    if (this.localUser) {
      localStorage.removeItem(`p2p_user_${this.localUser.id}`);
    }
  }
}

export const p2pSocial = new P2PSocialService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  p2pSocial.cleanup();
});