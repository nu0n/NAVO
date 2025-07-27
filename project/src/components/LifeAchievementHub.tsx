import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { lifeAchievements, getAchievementsByAge, getPersonalizedAchievements } from '../data/lifeAchievements';
import { getPersonalizedProfessionalAchievements, detectProfessionFromRole } from '../data/professionalAchievements';
import { LifeAchievement } from '../types';
import { X, Trophy, Clock, Star, Zap, Target, Brain, Heart, CheckCircle, Lock, Briefcase, Stethoscope, Gavel, AlertTriangle, Trash2, Info as InfoIcon } from 'lucide-react';
import { AchievementOnboarding } from './AchievementOnboarding';

interface LifeAchievementHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LifeAchievementHub: React.FC<LifeAchievementHubProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    completeLifeAchievement, 
    startLifeAchievement, 
    removeLifeAchievement 
  } = useGameStore();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | LifeAchievement['category'] | 'professional'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<LifeAchievement | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementToOnboard, setAchievementToOnboard] = useState<LifeAchievement | null>(null);
  
  if (!user) return null;

  const userAge = user.currentAge || 25;
  const detectedProfession = user.careerProfile?.currentRole 
    ? detectProfessionFromRole(user.careerProfile.currentRole)
    : null;
  
  const availableAchievements = useMemo(() => {
    if (selectedCategory === 'all') {
      return getPersonalizedAchievements(
        userAge,
        user.interests || [],
        user.personality || {},
        user.goals || [],
        user.healthProfile,
        user.careerProfile
      );
    } else if (selectedCategory === 'professional') {
      return getPersonalizedProfessionalAchievements(user);
    } else {
      return lifeAchievements.filter(a => 
        a.category === selectedCategory && 
        userAge >= a.ageRange.min && 
        userAge <= a.ageRange.max
      );
    }
  }, [userAge, user.interests, user.personality, user.goals, user.healthProfile, user.careerProfile, selectedCategory]);

  const completedAchievements = user.completedLifeAchievements || [];
  const currentAchievements = user.currentLifeAchievements || [];

  const getCategoryIcon = (category: LifeAchievement['category'] | 'professional') => {
    switch (category) {
      case 'financial': return '💰';
      case 'education': return '📚';
      case 'travel': return '🌍';
      case 'health': return '💪';
      case 'relationships': return '❤️';
      case 'career': return '👔';
      case 'personal': return '🌱';
      case 'civic': return '🏛️';
      case 'creative': return '🎨';
      case 'spiritual': return '🧘';
      case 'professional': return '🏆';
      default: return '⭐';
    }
  };

  const getProfessionIcon = (profession: string) => {
    switch (profession) {
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'lawyer': return <Gavel className="w-4 h-4" />;
      case 'engineer': return '⚙️';
      case 'teacher': return '👨‍🏫';
      case 'mayor': return '🏛️';
      case 'congressman': return '🗳️';
      case 'entrepreneur': return '🚀';
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getDifficultyTheme = (difficulty: LifeAchievement['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return {
          gradient: 'from-green-400 to-emerald-500',
          border: 'border-green-400/50',
          glow: 'shadow-green-500/50',
          text: 'text-green-300'
        };
      case 'medium':
        return {
          gradient: 'from-yellow-400 to-orange-500',
          border: 'border-yellow-400/50',
          glow: 'shadow-yellow-500/50',
          text: 'text-yellow-300'
        };
      case 'hard':
        return {
          gradient: 'from-red-400 to-pink-500',
          border: 'border-red-400/50',
          glow: 'shadow-red-500/50',
          text: 'text-red-300'
        };
      case 'legendary':
        return {
          gradient: 'from-purple-400 via-pink-500 to-cyan-500',
          border: 'border-purple-400/50',
          glow: 'shadow-purple-500/50',
          text: 'text-purple-300'
        };
    }
  };

  const isAchievementLocked = (achievement: LifeAchievement) => {
    if (!achievement.prerequisites) return false;
    return !achievement.prerequisites.every(prereq => completedAchievements.includes(prereq));
  };

  const isAchievementCompleted = (achievement: LifeAchievement) => {
    return completedAchievements.includes(achievement.id);
  };

  const isAchievementInProgress = (achievement: LifeAchievement) => {
    return currentAchievements.includes(achievement.id);
  };

  const getAgeAppropriatenessColor = (achievement: LifeAchievement) => {
    const ageDiff = Math.abs(userAge - achievement.ageRange.optimal);
    if (ageDiff <= 2) return 'text-green-400';
    if (ageDiff <= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const categories = [
    { id: 'all', name: 'Recommended', icon: '🎯' },
    ...(detectedProfession ? [{ id: 'professional', name: 'Professional', icon: '🏆' }] : []),
    { id: 'financial', name: 'Financial', icon: '💰' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'travel', name: 'Travel', icon: '🌍' },
    { id: 'health', name: 'Health', icon: '💪' },
    { id: 'relationships', name: 'Relationships', icon: '❤️' },
    { id: 'career', name: 'Career', icon: '👔' },
    { id: 'personal', name: 'Personal', icon: '🌱' },
    { id: 'civic', name: 'Civic', icon: '🏛️' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'spiritual', name: 'Spiritual', icon: '🧘' }
  ];

  const handleStartAchievement = (achievementId: string) => {
    setStartError(null);
    
    // Check if we've reached the maximum number of achievements
    if (currentAchievements.length >= 15) {
      setStartError("You've reached the maximum of 15 active achievements. Complete or remove some before starting new ones.");
      return;
    }
    
    // Find the achievement
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Show onboarding experience
    setAchievementToOnboard(achievement);
    setShowOnboarding(true);
    
    // Call the startLifeAchievement function
    startLifeAchievement(achievementId);
    
    // Close the achievement detail modal
    setSelectedAchievement(null);
  };

  const handleRemoveAchievement = (achievementId: string) => {
    removeLifeAchievement(achievementId);
    setShowRemoveConfirm(null);
    setSelectedAchievement(null);
  };

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
            className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
                  <div className="p-3 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Life Achievement Hub
                  </h2>
                  <p className="text-sm text-gray-400">
                    Your personalized life journey at age {userAge}
                    {detectedProfession && (
                      <span className="ml-2 inline-flex items-center space-x-1 px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-300">
                        {getProfessionIcon(detectedProfession)}
                        <span className="capitalize">{detectedProfession}</span>
                      </span>
                    )}
                  </p>
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

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-green-400">{completedAchievements.length}</div>
                <div className="text-xs text-green-300">Completed</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-yellow-400">{currentAchievements.length}</div>
                <div className="text-xs text-yellow-300">In Progress</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-blue-400">{availableAchievements.length}</div>
                <div className="text-xs text-blue-300">Available</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-purple-400">{user.avatar.lifeScore || 0}</div>
                <div className="text-xs text-purple-300">Life Score</div>
              </div>
            </div>

            {/* Achievement Limits Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <InfoIcon className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-300">Achievement Management</h3>
              </div>
              <p className="text-sm text-gray-400">
                You can have up to 15 achievements in progress at once. You can remove an achievement at any time, but you'll lose half your current level as a penalty.
              </p>
            </div>

            {/* Professional Achievement Notice */}
            {selectedCategory === 'professional' && detectedProfession && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  {getProfessionIcon(detectedProfession)}
                  <h3 className="font-bold text-blue-300 capitalize">
                    {detectedProfession} Professional Achievements
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  These achievements are specifically designed for your profession and career goals. 
                  Complete them to advance your professional standing and make a positive impact in your field.
                </p>
              </div>
            )}

            {/* Error Message */}
            {startError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-sm font-bold text-red-300">{startError}</p>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-4 py-2 rounded-2xl border-2 transition-all text-sm font-bold ${
                    selectedCategory === category.id
                      ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  {category.id === 'professional' && detectedProfession && (
                    <span className="ml-1 text-xs opacity-75">({detectedProfession})</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAchievements.map((achievement, index) => {
                const theme = getDifficultyTheme(achievement.difficulty);
                const isCompleted = isAchievementCompleted(achievement);
                const isInProgress = isAchievementInProgress(achievement);
                const isLocked = isAchievementLocked(achievement);
                const isProfessional = achievement.profession;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isCompleted
                        ? 'border-green-400/50 bg-green-500/20'
                        : isInProgress
                        ? 'border-yellow-400/50 bg-yellow-500/20'
                        : isLocked
                        ? 'border-gray-600/50 bg-gray-800/20 opacity-60'
                        : `${theme.border} hover:${theme.border.replace('/50', '/70')} bg-black/40 hover:bg-black/60`
                    }`}
                    onClick={() => !isLocked && setSelectedAchievement(achievement)}
                  >
                    {/* Remove Confirmation */}
                    {showRemoveConfirm === achievement.id && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 p-4">
                        <div className="text-center">
                          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                          <h4 className="text-red-400 font-bold mb-2">Remove Achievement?</h4>
                          <p className="text-sm text-gray-300 mb-4">
                            Removing this achievement will lose all progress and cost you half your current level.
                          </p>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowRemoveConfirm(null);
                              }}
                              className="flex-1 py-2 bg-gray-700 rounded-lg text-white"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveAchievement(achievement.id);
                              }}
                              className="flex-1 py-2 bg-red-600 rounded-lg text-white"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Achievement Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      <motion.div 
                        animate={!isLocked ? { 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className={`p-3 rounded-2xl ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : isInProgress
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : isLocked
                            ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                            : `bg-gradient-to-br ${theme.gradient}`
                        } text-white text-lg shadow-lg border border-white/20`}
                      >
                        {isLocked ? <Lock className="w-5 h-5" /> : achievement.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-sm mb-1">{achievement.name}</h3>
                          {isInProgress && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowRemoveConfirm(achievement.id);
                              }}
                              className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${
                            isCompleted 
                              ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                              : isInProgress
                              ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50'
                              : isLocked
                              ? 'bg-gray-600/30 text-gray-400 border border-gray-500/50'
                              : `bg-gradient-to-r ${theme.gradient} bg-opacity-30 ${theme.text} border ${theme.border}`
                          }`}>
                            {achievement.difficulty}
                          </span>
                          {isProfessional && (
                            <span className="text-xs px-2 py-1 rounded-full font-bold bg-blue-500/30 text-blue-300 border border-blue-400/50">
                              Professional
                            </span>
                          )}
                          <div className={`flex items-center space-x-1 text-xs ${getAgeAppropriatenessColor(achievement)}`}>
                            <Target className="w-3 h-3" />
                            <span>Age {achievement.ageRange.optimal}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 mb-3 line-clamp-2">{achievement.description}</p>

                    {/* Achievement Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{achievement.timeToComplete}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Zap className="w-3 h-3" />
                          <span>+{achievement.rewards.lifeScore} Life Score</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <span className="capitalize">{getCategoryIcon(achievement.category)} {achievement.category}</span>
                        {isProfessional && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="capitalize">{getProfessionIcon(achievement.profession!)} {achievement.profession}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Indicators */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20"
                      >
                        <CheckCircle className="w-4 h-4 text-white fill-current" />
                      </motion.div>
                    )}

                    {isInProgress && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20"
                      >
                        <Star className="w-4 h-4 text-white" />
                      </motion.div>
                    )}

                    {isLocked && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border-2 border-white/20">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Achievement Detail Modal */}
            <AnimatePresence>
              {selectedAchievement && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-xl z-60 flex items-center justify-center p-4"
                  onClick={() => setSelectedAchievement(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{selectedAchievement.name}</h3>
                        <motion.button
                          whileHover={{ scale: 1.05, rotate: 90 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAchievement(null)}
                          className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </motion.button>
                      </div>
                      
                      <p className="text-gray-300">{selectedAchievement.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                          <div className="text-lg font-bold text-blue-400">Age {selectedAchievement.ageRange.optimal}</div>
                          <div className="text-xs text-blue-300">Optimal Age</div>
                        </div>
                        <div className="text-center p-3 bg-purple-500/20 border border-purple-400/30 rounded-2xl">
                          <div className="text-lg font-bold text-purple-400">{selectedAchievement.timeToComplete}</div>
                          <div className="text-xs text-purple-300">Time Needed</div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-2xl">
                        <div className="text-sm font-bold text-green-300 mb-2">Rewards</div>
                        <div className="text-sm text-green-200 space-y-1">
                          <div>+{selectedAchievement.rewards.experience} Experience</div>
                          <div>+{selectedAchievement.rewards.lifeScore} Life Score</div>
                          {selectedAchievement.rewards.careerScore && (
                            <div>+{selectedAchievement.rewards.careerScore} Career Score</div>
                          )}
                          {selectedAchievement.rewards.title && (
                            <div>Title: {selectedAchievement.rewards.title}</div>
                          )}
                        </div>
                      </div>

                      {selectedAchievement.profession && (
                        <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                          <div className="flex items-center space-x-2 mb-2">
                            {getProfessionIcon(selectedAchievement.profession)}
                            <div className="text-sm font-bold text-blue-300 capitalize">
                              {selectedAchievement.profession} Achievement
                            </div>
                          </div>
                          <div className="text-sm text-blue-200">
                            This achievement is specifically designed for professionals in your field and will help advance your career.
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        {isAchievementInProgress(selectedAchievement) ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowRemoveConfirm(selectedAchievement.id)}
                              className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Remove</span>
                              </div>
                            </motion.button>
                          </>
                        ) : (
                          !isAchievementCompleted(selectedAchievement) && !isAchievementLocked(selectedAchievement) && (
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStartAchievement(selectedAchievement.id)}
                              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white font-bold rounded-2xl"
                            >
                              Start This Achievement
                            </motion.button>
                          )
                        )}
                      </div>
                      
                      {/* Remove Confirmation */}
                      {showRemoveConfirm === selectedAchievement.id && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10 p-6">
                          <div className="p-6 bg-black/90 rounded-2xl border border-red-500/50 max-w-sm">
                            <div className="flex items-center space-x-2 mb-3">
                              <AlertTriangle className="w-6 h-6 text-red-500" />
                              <h4 className="text-lg text-red-400 font-bold">Remove Achievement?</h4>
                            </div>
                            <p className="text-gray-300 mb-4">
                              Removing this achievement will lose all progress and cost you half your current level. This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowRemoveConfirm(null)}
                                className="flex-1 py-3 bg-gray-700 rounded-xl text-white"
                              >
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemoveAchievement(selectedAchievement.id)}
                                className="flex-1 py-3 bg-red-600 rounded-xl text-white font-bold"
                              >
                                Remove
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Achievement Onboarding */}
            {achievementToOnboard && (
              <AchievementOnboarding
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                achievement={achievementToOnboard}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};