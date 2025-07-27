import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Star, MapPin, Heart, Zap, Crown, Target, Trophy, ListChecks } from 'lucide-react';

const StatBadge = ({ icon: Icon, value, color, label }: {
  icon: React.ComponentType<any>;
  value: number;
  color: string;
  label: string;
}) => (
  <div className={`flex items-center space-x-1 bg-gradient-to-r ${color} px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-sm`}>
    <Icon className="w-3 h-3 text-white" />
    <span className="text-white font-bold text-xs md:text-sm">{value}</span>
  </div>
);

const ProgressBar = ({ progress, className }: { progress: number; className?: string }) => (
  <div className={`relative h-2 md:h-3 bg-black/50 rounded-full overflow-hidden border border-white/10 ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
    />
  </div>
);

const Avatar = ({ user, onClick, size = 'mobile' }: {
  user: any;
  onClick: () => void;
  size?: 'mobile' | 'desktop';
}) => {
  const sizeClasses = size === 'mobile' ? 'w-12 h-12' : 'w-20 h-20';
  const badgeClasses = size === 'mobile' ? 'w-6 h-6 -top-1 -right-1' : 'w-8 h-8 -top-2 -right-2';
  const textSize = size === 'mobile' ? 'text-xl' : 'text-3xl';
  
  return (
    <div onClick={onClick} className="relative cursor-pointer group">
      <div className={`relative ${sizeClasses}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl rotate-45 transform scale-75" />
        <div className="absolute inset-1 md:inset-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl rotate-45 transform scale-75" />
        <div className={`absolute inset-0 flex items-center justify-center ${textSize} z-10`}>
          {user.avatar.customization.emoji || '🚶'}
        </div>
        
        <div className={`absolute ${badgeClasses} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border border-white/20 md:border-2 flex items-center justify-center shadow-lg`}>
          <span className="text-xs font-black text-white">{user.avatar.level}</span>
        </div>
      </div>
    </div>
  );
};

export const PlayerStats: React.FC = () => {
  const { user, setShowAvatarCustomization } = useGameStore();

  const statsData = useMemo(() => {
    if (!user) return null;

    const experienceProgress = (user.avatar.experience % 1000) / 10;
    const nextLevelXP = (user.avatar.level + 1) * 1000;

    return {
      experienceProgress,
      nextLevelXP,
      remainingXP: nextLevelXP - user.avatar.experience
    };
  }, [user?.avatar.experience, user?.avatar.level]);

  if (!user || !statsData) return null;

  const statBadges = [
    { icon: MapPin, value: user.createdSigns.length, color: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30', label: 'Signs' },
    { icon: Heart, value: user.likedSigns.length, color: 'from-pink-500/20 to-red-500/20 border-pink-400/30', label: 'Likes' },
    { icon: Trophy, value: user.completedLifeAchievements?.length || 0, color: 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30', label: 'Achievements' },
    { icon: ListChecks, value: user.completedTasks?.length || 0, color: 'from-green-500/20 to-emerald-500/20 border-green-400/30', label: 'Tasks' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 left-4 right-4 z-10"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl md:rounded-3xl blur-xl" />
        
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500" />
          </div>

          <div className="relative p-3 md:p-4">
            <div className="md:hidden">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar user={user} onClick={() => setShowAvatarCustomization(true)} />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                    {user.username}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    {statBadges.slice(0, 2).map((badge, index) => (
                      <StatBadge key={index} {...badge} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1 text-purple-300">
                    <Crown className="w-3 h-3" />
                    <span className="font-bold">LVL {user.avatar.level}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-cyan-300">
                    <Target className="w-3 h-3" />
                    <span className="font-bold">{statsData.remainingXP} to next</span>
                  </div>
                </div>
                
                <ProgressBar progress={statsData.experienceProgress} />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Avatar user={user} onClick={() => setShowAvatarCustomization(true)} size="desktop" />

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {user.username}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  {statBadges.map((badge, index) => (
                    <StatBadge key={index} {...badge} />
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-1 text-purple-300">
                      <Crown className="w-3 h-3" />
                      <span className="font-bold">LVL {user.avatar.level}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-cyan-300">
                      <Target className="w-3 h-3" />
                      <span className="font-bold">{statsData.remainingXP} to next</span>
                    </div>
                  </div>
                  
                  <ProgressBar progress={statsData.experienceProgress} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};