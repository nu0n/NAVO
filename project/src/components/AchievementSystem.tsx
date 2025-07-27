import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { achievements, checkAchievementProgress } from '../data/achievements';
import { X, Trophy, Star, Crown, Award, Zap, CheckCircle, Calendar, Camera } from 'lucide-react';
import { TaskManager } from './TaskManager';

interface AchievementSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ isOpen, onClose }) => {
  const { user } = useGameStore();
  const [showTaskManager, setShowTaskManager] = React.useState(false);
  
  if (!user) return null;

  const getRarityTheme = (rarity: string) => {
    switch (rarity) {
      case 'diamond':
        return {
          gradient: 'from-cyan-300 via-blue-400 to-purple-500',
          border: 'border-cyan-300/50',
          glow: 'shadow-cyan-400/50',
          text: 'text-cyan-200'
        };
      case 'platinum':
        return {
          gradient: 'from-gray-300 via-slate-400 to-gray-500',
          border: 'border-gray-300/50',
          glow: 'shadow-gray-400/50',
          text: 'text-gray-200'
        };
      case 'gold':
        return {
          gradient: 'from-yellow-300 via-amber-400 to-orange-500',
          border: 'border-yellow-300/50',
          glow: 'shadow-yellow-400/50',
          text: 'text-yellow-200'
        };
      case 'silver':
        return {
          gradient: 'from-slate-300 via-gray-400 to-slate-500',
          border: 'border-slate-300/50',
          glow: 'shadow-slate-400/50',
          text: 'text-slate-200'
        };
      default: // bronze
        return {
          gradient: 'from-amber-600 via-orange-700 to-red-800',
          border: 'border-amber-600/50',
          glow: 'shadow-amber-600/50',
          text: 'text-amber-200'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'civic': return '🏛️';
      case 'environmental': return '🌱';
      case 'community': return '🤝';
      case 'explorer': return '🗺️';
      case 'creator': return '🎨';
      default: return '🏆';
    }
  };

  const userStats = {
    cleanupCount: user.completedCivicActions.filter(id => id.includes('cleanup')).length,
    petitionCount: user.completedCivicActions.filter(id => id.includes('petition')).length,
    volunteerCount: user.completedCivicActions.filter(id => id.includes('volunteer')).length,
    donationCount: user.completedCivicActions.filter(id => id.includes('donation')).length,
    educationCount: user.completedCivicActions.filter(id => id.includes('education')).length,
    totalCivicActions: user.completedCivicActions.length,
    civicScore: user.avatar.civicScore,
    createdSigns: user.createdSigns.length,
    visitedSigns: 0, // Would track in real app
    likedSigns: user.likedSigns.length
  };

  const achievementsWithProgress = achievements.map(achievement => ({
    ...achievement,
    progress: checkAchievementProgress(achievement, userStats),
    isUnlocked: user.achievements.some(a => a.id === achievement.id)
  }));

  const categories = ['civic', 'environmental', 'community', 'explorer', 'creator'];

  return (
    <AnimatePresence>
      {isOpen && (
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
                  <div className="p-3 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Achievement Vault
                  </h2>
                  <p className="text-sm text-gray-400">Your civic impact journey</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Task Manager Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTaskManager(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl text-white font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Tasks</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-cyan-400">{user.avatar.civicScore}</div>
                <div className="text-xs text-cyan-300">Civic Score</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-green-400">{user.completedCivicActions.length}</div>
                <div className="text-xs text-green-300">Actions Completed</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-yellow-400">{user.achievements.length}</div>
                <div className="text-xs text-yellow-300">Achievements</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-purple-400">{user.completedTasks?.length || 0}</div>
                <div className="text-xs text-purple-300">Tasks Done</div>
              </div>
            </div>

            {/* Task Checklist Callout */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-300 mb-1">Complete Tasks with Photo Verification</h3>
                  <p className="text-sm text-green-200">
                    Break down your achievements into actionable tasks. Take photos to verify completion and earn rewards!
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTaskManager(true)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium"
                >
                  View Tasks
                </motion.button>
              </div>
            </div>

            {/* Categories */}
            {categories.map(category => {
              const categoryAchievements = achievementsWithProgress.filter(a => a.category === category);
              
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <h3 className="text-lg font-bold text-white capitalize">{category}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAchievements.map((achievement, index) => {
                      const theme = getRarityTheme(achievement.rarity);
                      const progressPercent = Math.min((achievement.progress / achievement.requirements.target) * 100, 100);
                      
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative p-4 rounded-2xl border-2 transition-all ${
                            achievement.isUnlocked
                              ? `${theme.border} bg-gradient-to-br ${theme.gradient} bg-opacity-20 ${theme.glow} shadow-lg`
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {/* Achievement Icon */}
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.div 
                              animate={achievement.isUnlocked ? { 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                              } : {}}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                              className={`p-3 rounded-2xl ${
                                achievement.isUnlocked 
                                  ? `bg-gradient-to-br ${theme.gradient}` 
                                  : 'bg-gray-600'
                              } text-white text-lg shadow-lg border border-white/20`}
                            >
                              {achievement.icon}
                            </motion.div>
                            <div className="flex-1">
                              <h4 className={`font-bold text-sm ${achievement.isUnlocked ? theme.text : 'text-gray-400'}`}>
                                {achievement.name}
                              </h4>
                              <div className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${
                                achievement.isUnlocked 
                                  ? `bg-gradient-to-r ${theme.gradient} text-white` 
                                  : 'bg-gray-600 text-gray-300'
                              }`}>
                                {achievement.rarity}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-300 mb-3">{achievement.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Progress</span>
                              <span className={achievement.isUnlocked ? theme.text : 'text-gray-400'}>
                                {achievement.progress}/{achievement.requirements.target}
                              </span>
                            </div>
                            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${
                                  achievement.isUnlocked 
                                    ? `bg-gradient-to-r ${theme.gradient}` 
                                    : 'bg-gray-600'
                                } rounded-full`}
                              />
                            </div>
                          </div>
                          
                          {/* Task Breakdown Hint */}
                          {!achievement.isUnlocked && (
                            <div className="mt-3 p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                              <div className="flex items-center space-x-2 text-xs text-blue-300">
                                <Calendar className="w-3 h-3" />
                                <span>Break into tasks for easier completion</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Rewards */}
                          {achievement.isUnlocked && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 p-2 bg-black/40 rounded-lg border border-white/10"
                            >
                              <div className="flex items-center space-x-2 text-xs">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-300">+{achievement.reward.experience} XP</span>
                                <span className="text-cyan-300">+{achievement.reward.civicScore} Civic</span>
                              </div>
                              {achievement.reward.title && (
                                <div className="flex items-center space-x-1 text-xs mt-1">
                                  <Crown className="w-3 h-3 text-purple-400" />
                                  <span className="text-purple-300">Title: {achievement.reward.title}</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                          
                          {/* Unlock Effect */}
                          {achievement.isUnlocked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20"
                            >
                              <Star className="w-4 h-4 text-white fill-current" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Task Manager Modal */}
            <TaskManager 
              isOpen={showTaskManager} 
              onClose={() => setShowTaskManager(false)} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};