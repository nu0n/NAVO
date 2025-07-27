import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { p2pSocial, PeerUser, Challenge } from '../services/p2pSocial';
import { 
  X, 
  Users, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Crown,
  UserPlus,
  Heart,
  Star,
  Zap,
  Target,
  Award,
  Camera,
  Send,
  Wifi,
  Bluetooth,
  Signal,
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Activity
} from 'lucide-react';

interface SocialFeaturesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialFeatures: React.FC<SocialFeaturesProps> = ({ isOpen, onClose }) => {
  const { user } = useGameStore();
  const [activeTab, setActiveTab] = useState<'nearby' | 'connected' | 'challenges' | 'messages'>('nearby');
  const [nearbyUsers, setNearbyUsers] = useState<PeerUser[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<PeerUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'discovering' | 'connected'>('disconnected');

  // Initialize P2P service when component mounts
  useEffect(() => {
    if (isOpen && user) {
      const peerUser: PeerUser = {
        id: user.id,
        username: user.username,
        avatar: user.avatar.customization.emoji,
        level: user.avatar.level,
        civicScore: user.avatar.civicScore,
        lifeScore: user.avatar.lifeScore || 0,
        lastSeen: new Date(),
        isConnected: false
      };

      p2pSocial.setLocalUser(peerUser);
      setIsDiscovering(true);
      setConnectionStatus('discovering');

      // Listen for user discovery events
      const handleUserDiscovered = (event: CustomEvent) => {
        updateNearbyUsers();
      };

      window.addEventListener('p2p-user-discovered', handleUserDiscovered as EventListener);

      // Set up message handlers
      p2pSocial.onMessage('friend_request', (message) => {
        console.log('Friend request received:', message);
        // Handle friend request UI
      });

      p2pSocial.onMessage('challenge_invite', (message) => {
        console.log('Challenge invite received:', message);
        // Handle challenge invite UI
      });

      p2pSocial.onMessage('achievement', (message) => {
        console.log('Achievement shared:', message);
        // Handle shared achievement UI
      });

      // Initial update
      updateNearbyUsers();
      updateConnectedUsers();
      generateMockChallenges();

      return () => {
        window.removeEventListener('p2p-user-discovered', handleUserDiscovered as EventListener);
      };
    }
  }, [isOpen, user]);

  const updateNearbyUsers = () => {
    const discovered = p2pSocial.getDiscoveredUsers();
    setNearbyUsers(discovered);
  };

  const updateConnectedUsers = () => {
    const connected = p2pSocial.getConnectedUsers();
    setConnectedUsers(connected);
    setConnectionStatus(connected.length > 0 ? 'connected' : 'discovering');
  };

  const generateMockChallenges = () => {
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge-1',
        title: '7-Day Fitness Streak',
        description: 'Complete a workout for 7 consecutive days',
        type: 'fitness',
        participants: [user?.id || '', 'user-nearby-1'],
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reward: 500,
        difficulty: 'medium',
        isActive: true,
        createdBy: 'user-nearby-1'
      },
      {
        id: 'challenge-2',
        title: 'Community Impact Week',
        description: 'Complete 3 civic actions in one week',
        type: 'civic',
        participants: [user?.id || '', 'user-nearby-2'],
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        reward: 300,
        difficulty: 'hard',
        isActive: true,
        createdBy: user?.id || ''
      }
    ];
    setChallenges(mockChallenges);
  };

  const handleConnectToUser = async (userId: string) => {
    const success = await p2pSocial.connectToUser(userId);
    if (success) {
      updateNearbyUsers();
      updateConnectedUsers();
    }
  };

  const handleSendFriendRequest = (userId: string) => {
    const success = p2pSocial.sendFriendRequest(userId);
    if (success) {
      console.log('Friend request sent to:', userId);
    }
  };

  const handleShareAchievement = (userId: string, achievement: any) => {
    const success = p2pSocial.shareAchievement(userId, achievement);
    if (success) {
      console.log('Achievement shared with:', userId);
    }
  };

  const handleCreateChallenge = () => {
    const newChallenge = p2pSocial.createChallenge({
      title: 'Daily Steps Challenge',
      description: 'Walk 10,000 steps every day for a week',
      type: 'fitness',
      participants: [user?.id || ''],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      reward: 400,
      difficulty: 'medium',
      isActive: true
    });
    
    setChallenges(prev => [...prev, newChallenge]);
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-5 h-5 text-green-400" />;
      case 'discovering':
        return <Signal className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return <Bluetooth className="w-5 h-5 text-gray-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return `Connected to ${connectedUsers.length} user${connectedUsers.length !== 1 ? 's' : ''}`;
      case 'discovering':
        return 'Discovering nearby users...';
      default:
        return 'Not connected';
    }
  };

  const getSignalIcon = (signal?: string) => {
    switch (signal) {
      case 'strong':
        return <div className="flex space-x-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 bg-green-400 rounded-full" style={{ height: `${4 + i * 2}px` }} />
          ))}
        </div>;
      case 'medium':
        return <div className="flex space-x-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 bg-yellow-400 rounded-full" style={{ height: `${4 + i * 2}px` }} />
          ))}
          <div className="w-1 bg-gray-600 rounded-full" style={{ height: '10px' }} />
        </div>;
      case 'weak':
        return <div className="flex space-x-0.5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-1 bg-red-400 rounded-full" style={{ height: `${4 + i * 2}px` }} />
          ))}
          {[...Array(2)].map((_, i) => (
            <div key={i + 2} className="w-1 bg-gray-600 rounded-full" style={{ height: `${8 + i * 2}px` }} />
          ))}
        </div>;
      default:
        return <Signal className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!user || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
              >
                <div className="p-3 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  P2P Social Hub
                </h2>
                <div className="flex items-center space-x-2">
                  {getConnectionIcon()}
                  <p className="text-sm text-gray-400">{getConnectionText()}</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Connection Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Bluetooth className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-blue-300">Peer-to-Peer Connection</h3>
            </div>
            <p className="text-sm text-gray-400">
              Connect directly with nearby users via Bluetooth or WiFi. No servers needed - just like the old Tamagotchi days!
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6 bg-black/40 p-2 rounded-2xl">
            {[
              { id: 'nearby', name: 'Nearby', icon: <MapPin className="w-4 h-4" />, count: nearbyUsers.length },
              { id: 'connected', name: 'Connected', icon: <Users className="w-4 h-4" />, count: connectedUsers.length },
              { id: 'challenges', name: 'Challenges', icon: <Trophy className="w-4 h-4" />, count: challenges.length },
              { id: 'messages', name: 'Messages', icon: <MessageCircle className="w-4 h-4" />, count: 0 }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-black/30 text-xs">{tab.count}</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'nearby' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Nearby Users</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>Scanning...</span>
                  </div>
                </div>

                {nearbyUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Signal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400 mb-2">No users nearby</h3>
                    <p className="text-gray-500">Make sure Bluetooth/WiFi is enabled and other users are using CIVIL</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {nearbyUsers.map((nearbyUser, index) => (
                      <motion.div
                        key={nearbyUser.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-2xl border border-white/10"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-xl">
                              {nearbyUser.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{nearbyUser.username}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>Level {nearbyUser.level}</span>
                              <span>•</span>
                              <span>{nearbyUser.distance}m away</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSignalIcon(nearbyUser.signal)}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleConnectToUser(nearbyUser.id)}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium"
                            >
                              Connect
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div className="text-center p-2 bg-cyan-500/20 rounded-lg">
                            <div className="font-bold text-cyan-400">{nearbyUser.civicScore}</div>
                            <div className="text-gray-400">Civic</div>
                          </div>
                          <div className="text-center p-2 bg-purple-500/20 rounded-lg">
                            <div className="font-bold text-purple-400">{nearbyUser.lifeScore}</div>
                            <div className="text-gray-400">Life</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'connected' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Connected Friends</h3>
                  <div className="text-sm text-gray-400">{connectedUsers.length} connected</div>
                </div>

                {connectedUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400 mb-2">No connected friends</h3>
                    <p className="text-gray-500">Connect with nearby users to start sharing achievements and challenges</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connectedUsers.map((connectedUser, index) => (
                      <motion.div
                        key={connectedUser.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/30"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                              {connectedUser.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{connectedUser.username}</h4>
                            <p className="text-sm text-gray-400">Level {connectedUser.level} • Connected</p>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{scale: 0.95}}
                              className="p-2 bg-purple-500/20 rounded-lg text-purple-300 hover:bg-purple-500/30"
                              onClick={() => handleShareAchievement(connectedUser.id, user.achievements[0])}
                            >
                              <Trophy className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{scale: 0.95}}
                              className="p-2 bg-pink-500/20 rounded-lg text-pink-300 hover:bg-pink-500/30"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-green-500/20 rounded-lg">
                            <div className="font-bold text-green-400">{connectedUser.civicScore}</div>
                            <div className="text-gray-400">Civic</div>
                          </div>
                          <div className="text-center p-2 bg-blue-500/20 rounded-lg">
                            <div className="font-bold text-blue-400">{connectedUser.lifeScore}</div>
                            <div className="text-gray-400">Life</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">P2P Challenges</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateChallenge}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-2xl border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {challenge.type === 'fitness' ? '💪' : 
                             challenge.type === 'civic' ? '🏛️' : 
                             challenge.type === 'career' ? '💼' : '📚'}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{challenge.title}</h4>
                            <p className="text-sm text-gray-400">{challenge.description}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          challenge.difficulty === 'easy' ? 'text-green-400 border-green-400/30 bg-green-500/20' :
                          challenge.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20' :
                          'text-red-400 border-red-400/30 bg-red-500/20'
                        }`}>
                          {challenge.difficulty.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">{challenge.participants.length}</div>
                          <div className="text-xs text-gray-400">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{challenge.reward}</div>
                          <div className="text-xs text-gray-400">XP Reward</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">
                            {Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-xs text-gray-400">Days Left</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400 flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>Created by {challenge.createdBy === user.id ? 'you' : 'friend'}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white text-sm font-medium"
                        >
                          {challenge.createdBy === user.id ? 'Invite' : 'Join'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}

                  {challenges.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-400 mb-2">No active challenges</h3>
                      <p className="text-gray-500">Create a challenge or wait for friends to invite you</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">P2P Messages</h3>
                
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No messages yet</h3>
                  <p className="text-gray-500">Connect with nearby users to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Bluetooth className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-blue-300">P2P Privacy & Security</span>
            </div>
            <p className="text-sm text-gray-400">
              All connections are direct between devices with no central server. Your data stays on your device and is only shared with users you explicitly connect with.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};