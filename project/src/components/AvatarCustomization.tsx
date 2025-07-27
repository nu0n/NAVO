import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { X, User, Palette, Shirt, Crown, Sparkles, Zap, Star } from 'lucide-react';

export const AvatarCustomization: React.FC = () => {
  const { 
    user, 
    showAvatarCustomization, 
    setShowAvatarCustomization, 
    updatePlayerAvatar 
  } = useGameStore();

  const [newlyUnlockedAvatars, setNewlyUnlockedAvatars] = useState<string[]>([]);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const [celebratingAvatar, setCelebratingAvatar] = useState<any>(null);

  const avatarEmojis = [
    { id: 'walk', emoji: '🚶', name: 'Walker', rarity: 'common', levelRequired: 1 },
    { id: 'run', emoji: '🏃', name: 'Runner', rarity: 'common', levelRequired: 1 },
    { id: 'bike', emoji: '🚴', name: 'Cyclist', rarity: 'uncommon', levelRequired: 3 },
    { id: 'car', emoji: '🚗', name: 'Driver', rarity: 'uncommon', levelRequired: 4 },
    { id: 'explore', emoji: '🧭', name: 'Explorer', rarity: 'rare', levelRequired: 6 },
    { id: 'hike', emoji: '🥾', name: 'Hiker', rarity: 'common', levelRequired: 2 },
    { id: 'camera', emoji: '📸', name: 'Photographer', rarity: 'uncommon', levelRequired: 5 },
    { id: 'map', emoji: '🗺️', name: 'Navigator', rarity: 'rare', levelRequired: 7 },
    { id: 'backpack', emoji: '🎒', name: 'Traveler', rarity: 'common', levelRequired: 2 },
    { id: 'compass', emoji: '🧭', name: 'Guide', rarity: 'rare', levelRequired: 8 },
    { id: 'star', emoji: '⭐', name: 'Star', rarity: 'epic', levelRequired: 10 },
    { id: 'rocket', emoji: '🚀', name: 'Adventurer', rarity: 'epic', levelRequired: 12 },
    { id: 'mountain', emoji: '⛰️', name: 'Mountaineer', rarity: 'rare', levelRequired: 9 },
    { id: 'beach', emoji: '🏖️', name: 'Beach Explorer', rarity: 'uncommon', levelRequired: 6 },
    { id: 'city', emoji: '🏙️', name: 'City Walker', rarity: 'common', levelRequired: 1 },
    { id: 'forest', emoji: '🌲', name: 'Forest Guide', rarity: 'uncommon', levelRequired: 5 },
    { id: 'ascii-1', emoji: '⊂(◉‿◉)つ', name: 'Hugger', rarity: 'rare', levelRequired: 15 },
    { id: 'ascii-2', emoji: '•`_´•', name: 'Stoic', rarity: 'uncommon', levelRequired: 17 },
    { id: 'ascii-3', emoji: '(¬‿¬)', name: 'Smirk', rarity: 'rare', levelRequired: 20 },
    { id: 'ascii-4', emoji: '(づ｡◕‿‿◕｡)づ', name: 'Cuddle', rarity: 'epic', levelRequired: 25 },
    { id: 'ascii-5', emoji: '(☞ﾟヮﾟ)☞', name: 'Pointer', rarity: 'epic', levelRequired: 30 },
    { id: 'ascii-6', emoji: 'ʕ•ᴥ•ʔ', name: 'Bear', rarity: 'legendary', levelRequired: 40 },
    { id: 'ascii-7', emoji: '༼ つ ◕_◕ ༽つ', name: 'Summoner', rarity: 'epic', levelRequired: 32 },
    { id: 'ascii-8', emoji: '(ง •̀_•́)ง', name: 'Fighter', rarity: 'rare', levelRequired: 18 },
    { id: 'ascii-9', emoji: '(ᵔᴥᵔ)', name: 'Puppy', rarity: 'uncommon', levelRequired: 13 },
    { id: 'ascii-10', emoji: '(☞⌐■_■)☞', name: 'Cool', rarity: 'epic', levelRequired: 28 },
    { id: 'ascii-11', emoji: '(✿◠‿◠)', name: 'Blossom', rarity: 'rare', levelRequired: 22 },
    { id: 'ascii-12', emoji: '(｡♥‿♥｡)', name: 'Lover', rarity: 'epic', levelRequired: 26 },
    { id: 'ascii-13', emoji: '(ʘ‿ʘ)', name: 'Stare', rarity: 'rare', levelRequired: 19 },
    { id: 'ascii-14', emoji: '(☞ﾟ∀ﾟ)☞', name: 'Wink', rarity: 'rare', levelRequired: 21 },
    { id: 'ascii-15', emoji: '(づ￣ ³￣)づ', name: 'Kiss', rarity: 'epic', levelRequired: 27 },
    { id: 'ascii-16', emoji: '(ノಠ益ಠ)ノ', name: 'Rage', rarity: 'epic', levelRequired: 29 },
    { id: 'ascii-17', emoji: '(¬_¬")', name: 'Skeptic', rarity: 'rare', levelRequired: 23 },
    { id: 'ascii-18', emoji: '(☞ ͡° ͜ʖ ͡°)☞', name: 'Lenny', rarity: 'epic', levelRequired: 31 },
    { id: 'ascii-19', emoji: '(ಥ﹏ಥ)', name: 'Cry', rarity: 'rare', levelRequired: 24 },
    { id: 'ascii-20', emoji: '(づ｡◕‿‿◕｡)づ', name: 'Snuggle', rarity: 'epic', levelRequired: 33 },
    { id: 'emoji-rare-1', emoji: '🦄', name: 'Unicorn', rarity: 'epic', levelRequired: 35 },
    { id: 'emoji-rare-2', emoji: '👾', name: 'Alien', rarity: 'rare', levelRequired: 22 },
    { id: 'emoji-rare-3', emoji: '🦸‍♂️', name: 'Hero', rarity: 'epic', levelRequired: 28 },
    { id: 'emoji-rare-4', emoji: '🧙‍♂️', name: 'Wizard', rarity: 'epic', levelRequired: 32 },
    { id: 'emoji-rare-5', emoji: '🐉', name: 'Dragon', rarity: 'legendary', levelRequired: 50 },
    { id: 'emoji-rare-6', emoji: '🦊', name: 'Fox', rarity: 'rare', levelRequired: 16 },
    { id: 'emoji-rare-7', emoji: '🦁', name: 'Lion', rarity: 'epic', levelRequired: 36 },
    { id: 'emoji-rare-8', emoji: '🦋', name: 'Butterfly', rarity: 'rare', levelRequired: 14 },
    { id: 'emoji-rare-9', emoji: '🦕', name: 'Dino', rarity: 'epic', levelRequired: 38 },
    { id: 'emoji-rare-10', emoji: '🦚', name: 'Peacock', rarity: 'epic', levelRequired: 39 },
    { id: 'emoji-rare-11', emoji: '🦩', name: 'Flamingo', rarity: 'epic', levelRequired: 41 },
    { id: 'emoji-rare-12', emoji: '🦄', name: 'Rainbow Unicorn', rarity: 'legendary', levelRequired: 55 },
    { id: 'emoji-rare-13', emoji: '🧛‍♂️', name: 'Vampire', rarity: 'epic', levelRequired: 42 },
    { id: 'emoji-rare-14', emoji: '🧞‍♂️', name: 'Genie', rarity: 'epic', levelRequired: 43 },
    { id: 'emoji-rare-15', emoji: '🧟‍♂️', name: 'Zombie', rarity: 'epic', levelRequired: 44 },
    { id: 'emoji-rare-16', emoji: '🧚‍♂️', name: 'Fairy', rarity: 'epic', levelRequired: 45 },
    { id: 'emoji-rare-17', emoji: '🧜‍♂️', name: 'Merman', rarity: 'epic', levelRequired: 46 },
    { id: 'emoji-rare-18', emoji: '🧝‍♂️', name: 'Elf', rarity: 'epic', levelRequired: 47 },
    { id: 'emoji-rare-19', emoji: '🧙‍♀️', name: 'Sorceress', rarity: 'epic', levelRequired: 48 },
    { id: 'emoji-rare-20', emoji: '🧞‍♀️', name: 'Genie Girl', rarity: 'epic', levelRequired: 49 },
    { id: 'emoji-rare-21', emoji: '🦸‍♀️', name: 'Heroine', rarity: 'epic', levelRequired: 51 },
    { id: 'emoji-rare-22', emoji: '🦹‍♂️', name: 'Villain', rarity: 'epic', levelRequired: 52 },
    { id: 'emoji-rare-23', emoji: '🦹‍♀️', name: 'Villainess', rarity: 'epic', levelRequired: 53 },
    { id: 'emoji-rare-24', emoji: '🧙‍♂️', name: 'Grand Wizard', rarity: 'legendary', levelRequired: 54 },
    { id: 'emoji-rare-25', emoji: '🦄', name: 'Galactic Unicorn', rarity: 'legendary', levelRequired: 56 },
    { id: 'emoji-rare-26', emoji: '🦅', name: 'Eagle', rarity: 'epic', levelRequired: 37 },
    { id: 'emoji-rare-27', emoji: '🦓', name: 'Zebra', rarity: 'epic', levelRequired: 34 },
    { id: 'emoji-rare-28', emoji: '🦔', name: 'Hedgehog', rarity: 'epic', levelRequired: 57 },
    { id: 'emoji-rare-29', emoji: '🦦', name: 'Otter', rarity: 'epic', levelRequired: 58 },
    { id: 'emoji-rare-30', emoji: '🦥', name: 'Sloth', rarity: 'epic', levelRequired: 59 },
    { id: 'emoji-rare-31', emoji: '🦨', name: 'Skunk', rarity: 'epic', levelRequired: 60 },
  ];

  // Check for newly unlocked avatars when component mounts or user level changes
  useEffect(() => {
    if (!user) return;
    
    const currentUnlockedAvatars = avatarEmojis
      .filter(avatar => user.avatar.level >= avatar.levelRequired)
      .map(avatar => avatar.id);
    
    // Get previously unlocked avatars from localStorage
    const previouslyUnlockedAvatars = JSON.parse(localStorage.getItem('unlockedAvatars') || '[]');
    
    // Find newly unlocked avatars
    const newlyUnlocked = currentUnlockedAvatars.filter(
      avatarId => !previouslyUnlockedAvatars.includes(avatarId)
    );
    
    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedAvatars(newlyUnlocked);
      const newAvatar = avatarEmojis.find(avatar => avatar.id === newlyUnlocked[0]);
      if (newAvatar) {
        setCelebratingAvatar(newAvatar);
        setShowUnlockCelebration(true);
      }
    }
    
    // Update localStorage with current unlocked avatars
    localStorage.setItem('unlockedAvatars', JSON.stringify(currentUnlockedAvatars));
  }, [user?.avatar.level]);

  const getRarityTheme = (rarity: string) => {
    switch (rarity) {
      case 'epic':
        return {
          gradient: 'from-purple-500 via-pink-500 to-orange-500',
          border: 'border-purple-400/50',
          glow: 'shadow-purple-500/50',
          text: 'text-purple-300'
        };
      case 'rare':
        return {
          gradient: 'from-blue-500 via-cyan-500 to-teal-500',
          border: 'border-blue-400/50',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-300'
        };
      case 'uncommon':
        return {
          gradient: 'from-green-500 via-emerald-500 to-teal-500',
          border: 'border-green-400/50',
          glow: 'shadow-green-500/50',
          text: 'text-green-300'
        };
      default:
        return {
          gradient: 'from-gray-500 via-slate-500 to-gray-600',
          border: 'border-gray-400/50',
          glow: 'shadow-gray-500/50',
          text: 'text-gray-300'
        };
    }
  };

  const handleEmojiChange = (emojiId: string, emoji: string) => {
    if (!user) return;
    updatePlayerAvatar({
      customization: {
        ...user.avatar.customization,
        emoji: emoji,
        emojiId: emojiId
      }
    });
  };

  // Early return after all hooks
  if (!user || !showAvatarCustomization) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={() => setShowAvatarCustomization(false)}
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`bg-particle-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-pink-400/20 rounded-3xl"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            {/* Header with Futuristic Design */}
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
                  <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-purple-400 rounded-2xl"
                  />
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(34, 211, 238, 0.5)",
                        "0 0 20px rgba(168, 85, 247, 0.5)",
                        "0 0 10px rgba(236, 72, 153, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Avatar Nexus
                  </motion.h2>
                  <p className="text-sm text-gray-400">Express your digital identity</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarCustomization(false)}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Current Avatar Preview with Holographic Effect */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer Glow Ring */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-lg"
                />
                
                {/* Main Avatar Container */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/20">
                  {user.avatar.customization.emoji || '🚶'}
                  
                  {/* Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`avatar-particle-${i}`}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        x: [0, Math.cos(i * 60 * Math.PI / 180) * 25],
                        y: [0, Math.sin(i * 60 * Math.PI / 180) * 25],
                        opacity: [1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
                
                {/* Level Badge with Neon Effect */}
                <motion.div
                  animate={{ 
                    y: [0, -3, 0],
                    boxShadow: [
                      "0 0 10px rgba(34, 211, 238, 0.5)",
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                      "0 0 10px rgba(236, 72, 153, 0.5)"
                    ]
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white/20 flex items-center justify-center shadow-lg"
                >
                  <span className="text-sm font-black text-white">{user.avatar.level}</span>
                </motion.div>
              </div>
            </div>

            {/* Avatar Selection Grid with Rarity System */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Select Your Avatar</span>
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {avatarEmojis.map((avatar) => {
                  const theme = getRarityTheme(avatar.rarity);
                  const isSelected = user.avatar.customization.emoji === avatar.emoji;
                  const isUnlocked = user.avatar.level >= avatar.levelRequired;
                  
                  return (
                    <motion.button
                      key={avatar.id}
                      whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      onClick={isUnlocked ? () => handleEmojiChange(avatar.id, avatar.emoji) : undefined}
                      disabled={!isUnlocked}
                      className={`relative p-4 rounded-2xl border-2 transition-all select-none focus:outline-none ${
                        isSelected && isUnlocked
                          ? `${theme.border} bg-gradient-to-br ${theme.gradient} ${theme.glow} shadow-xl`
                          : isUnlocked
                            ? 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60'
                            : 'border-gray-700 bg-gray-900 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Rarity Glow */}
                      {avatar.rarity !== 'common' && isUnlocked && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-2xl blur-lg opacity-20`} />
                      )}
                      <div className="relative flex flex-col items-center">
                        <motion.div
                          className={`mb-2 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl
                            ${avatar.id.startsWith('ascii') ? 'font-mono font-extrabold tracking-tight text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}
                            ${isUnlocked ? '' : 'grayscale opacity-60'}
                            ${isUnlocked && avatar.rarity !== 'common' ? 'drop-shadow-[0_0_16px_rgba(0,255,255,0.7)]' : ''}
                            ${isUnlocked && avatar.rarity === 'legendary' ? 'animate-gradient-x' : ''}
                          `}
                          style={{
                            textShadow: isUnlocked
                              ? '0 0 12px #0ff, 0 0 24px #f0f, 0 0 32px #0ff'
                              : '0 0 8px #888',
                            background: isUnlocked && avatar.rarity !== 'common'
                              ? 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(168,85,247,0.15) 100%)'
                              : 'rgba(0,0,0,0.2)'
                          }}
                          animate={isUnlocked && avatar.rarity !== 'common' ? { scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {avatar.emoji}
                        </motion.div>
                        <div className={`text-xs font-medium mb-1 ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{avatar.name}</div>
                        {/* Rarity Badge */}
                        <motion.div
                          animate={avatar.rarity === 'epic' && isUnlocked ? { 
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${
                            avatar.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' :
                            avatar.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' :
                            avatar.rarity === 'uncommon' ? 'bg-green-500/30 text-green-300 border border-green-400/50' :
                            'bg-gray-500/30 text-gray-300 border border-gray-400/50'
                          } ${!isUnlocked ? 'opacity-60' : ''}`}
                        >
                          {avatar.rarity}
                        </motion.div>
                        {/* Selection Indicator */}
                        {isSelected && isUnlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20"
                          >
                            <Star className="w-3 h-3 text-white fill-current" />
                          </motion.div>
                        )}
                        {/* Locked Overlay */}
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl">
                            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
                            <span className="text-xs text-gray-300 font-semibold text-center px-1">Unlock at Level {avatar.levelRequired}</span>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Stats Display with Neon Design */}
            <div className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(34, 211, 238, 0.5)",
                        "0 0 20px rgba(34, 211, 238, 0.8)",
                        "0 0 10px rgba(34, 211, 238, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl font-black text-cyan-400"
                  >
                    {user.avatar.level}
                  </motion.div>
                  <div className="text-xs text-gray-400 font-medium">Level</div>
                </div>
                <div className="relative">
                  <motion.div
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(168, 85, 247, 0.5)",
                        "0 0 20px rgba(168, 85, 247, 0.8)",
                        "0 0 10px rgba(168, 85, 247, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-2xl font-black text-purple-400"
                  >
                    {user.createdSigns.length}
                  </motion.div>
                  <div className="text-xs text-gray-400 font-medium">Signs Created</div>
                </div>
                <div className="relative">
                  <motion.div
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(236, 72, 153, 0.5)",
                        "0 0 20px rgba(236, 72, 153, 0.8)",
                        "0 0 10px rgba(236, 72, 153, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="text-2xl font-black text-pink-400"
                  >
                    {user.likedSigns.length}
                  </motion.div>
                  <div className="text-xs text-gray-400 font-medium">Likes Given</div>
                </div>
              </div>
            </div>

            {/* Footer with Holographic Save Button */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                <p className="font-medium flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{user.avatar.experience} XP</span>
                </p>
                <p>Keep exploring to level up!</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvatarCustomization(false)}
                className="relative group"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-lg" />
                
                <div className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold transition-all shadow-lg border border-white/20">
                  <motion.span
                    animate={{ 
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.5)",
                        "0 0 20px rgba(255,255,255,0.8)",
                        "0 0 10px rgba(255,255,255,0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Save Avatar
                  </motion.span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Unlock Celebration Modal */}
      <AnimatePresence>
        {showUnlockCelebration && celebratingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4"
            onClick={() => setShowUnlockCelebration(false)}
          >
            {/* Confetti Animation */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, -200],
                    x: [0, Math.random() * 100 - 50],
                    opacity: [1, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Holographic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-transparent to-cyan-400/30 rounded-3xl"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative">
                {/* Unlock Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Avatar Display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white/20"
                >
                  {celebratingAvatar.emoji}
                </motion.div>

                {/* Celebration Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.h2 
                    className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(251, 191, 36, 0.5)",
                        "0 0 20px rgba(251, 191, 36, 0.8)",
                        "0 0 10px rgba(251, 191, 36, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    NEW AVATAR UNLOCKED!
                  </motion.h2>
                  <h3 className="text-xl font-bold text-white mb-2">{celebratingAvatar.name}</h3>
                  <p className="text-gray-300 mb-4">You've reached Level {celebratingAvatar.levelRequired}!</p>
                  
                  {/* Rarity Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className={`inline-block text-sm px-4 py-2 rounded-full font-bold capitalize mb-6 ${
                      celebratingAvatar.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' :
                      celebratingAvatar.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' :
                      celebratingAvatar.rarity === 'uncommon' ? 'bg-green-500/30 text-green-300 border border-green-400/50' :
                      'bg-gray-500/30 text-gray-300 border border-gray-400/50'
                    }`}
                  >
                    {celebratingAvatar.rarity} AVATAR
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex space-x-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleEmojiChange(celebratingAvatar.id, celebratingAvatar.emoji);
                      setShowUnlockCelebration(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold transition-all shadow-lg border border-white/20"
                  >
                    Equip Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUnlockCelebration(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-bold transition-all border border-white/20"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};