import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { lifeAchievements } from '../data/lifeAchievements';
import { generateTasksForAchievement } from '../data/taskTemplates';
import { LifeAchievement, TaskItem } from '../types';
import { 
  X, 
  Trophy, 
  Clock, 
  Star, 
  Zap, 
  Target, 
  CheckCircle, 
  Calendar, 
  Camera, 
  Heart, 
  Briefcase, 
  Activity, 
  User, 
  AlertTriangle, 
  Trash2,
  Filter,
  Search,
  ListChecks,
  ArrowRight,
  Info as InfoIcon
} from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { ProfessionalVerification } from './ProfessionalVerification';
import { AchievementOnboarding } from './AchievementOnboarding';

interface AchievementTaskHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementTaskHub: React.FC<AchievementTaskHubProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    completeTask, 
    startLifeAchievement, 
    removeLifeAchievement,
    syncTasksWithAchievements
  } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'in-progress' | 'available' | 'completed'>('in-progress');
  const [selectedAchievement, setSelectedAchievement] = useState<LifeAchievement | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [showProfessionalVerification, setShowProfessionalVerification] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startError, setStartError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementToOnboard, setAchievementToOnboard] = useState<LifeAchievement | null>(null);
  
  if (!user) return null;

  const userAge = user.currentAge || 25;
  const completedAchievements = user.completedLifeAchievements || [];
  const currentAchievements = user.currentLifeAchievements || [];
  const completedTasks = user.completedTasks || [];
  
  // Get achievement details
  const inProgressAchievements = lifeAchievements.filter(achievement => 
    currentAchievements.includes(achievement.id)
  );
  
  const completedAchievementDetails = lifeAchievements.filter(achievement => 
    completedAchievements.includes(achievement.id)
  );
  
  const availableAchievements = lifeAchievements.filter(achievement => 
    !completedAchievements.includes(achievement.id) && 
    !currentAchievements.includes(achievement.id) &&
    userAge >= achievement.ageRange.min && 
    userAge <= achievement.ageRange.max
  );
  
  // Filter achievements based on search and category
  const filteredAchievements = useMemo(() => {
    let filtered = activeTab === 'in-progress' 
      ? inProgressAchievements 
      : activeTab === 'completed'
      ? completedAchievementDetails
      : availableAchievements;
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(a => a.category === filterCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) || 
        a.description.toLowerCase().includes(search) ||
        a.category.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [activeTab, inProgressAchievements, completedAchievementDetails, availableAchievements, filterCategory, searchTerm]);
  
  // Get tasks for an achievement
  const getTasksForAchievement = (achievementId: string) => {
    return generateTasksForAchievement(achievementId, user.id);
  };
  
  // Calculate achievement progress
  const calculateProgress = (achievementId: string): number => {
    const tasks = getTasksForAchievement(achievementId);
    if (tasks.length === 0) return 0;
    
    const completedCount = tasks.filter(task => 
      completedTasks.includes(task.id)
    ).length;
    
    return Math.round((completedCount / tasks.length) * 100);
  };
  
  // Get time remaining text
  const getTimeRemainingText = (achievementId: string): string => {
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    if (!achievement) return '';
    
    const startDate = user.achievementStartDates?.[achievementId];
    if (!startDate) return '';
    
    const minDays = {
      'easy': 1,
      'medium': 3,
      'hard': 7,
      'legendary': 14
    };
    
    const requiredDays = minDays[achievement.difficulty];
    const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, requiredDays - daysSinceStart);
    
    if (daysRemaining === 0) return 'Ready to complete!';
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
  };
  
  const getCategoryIcon = (category: LifeAchievement['category']) => {
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
      default: return '⭐';
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
  
  const getAgeAppropriatenessColor = (achievement: LifeAchievement) => {
    const ageDiff = Math.abs(userAge - achievement.ageRange.optimal);
    if (ageDiff <= 2) return 'text-green-400';
    if (ageDiff <= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };
  
  const isAchievementLocked = (achievement: LifeAchievement) => {
    if (!achievement.prerequisites) return false;
    return !achievement.prerequisites.every(prereq => completedAchievements.includes(prereq));
  };
  
  const handleTaskComplete = (task: TaskItem) => {
    if (task.verificationMethod === 'photo' || task.verificationMethod === 'selfie') {
      setSelectedTask(task);
      setShowPhotoCapture(true);
    } else if (task.verificationMethod === 'career_milestone' && selectedAchievement?.profession) {
      setShowProfessionalVerification(true);
    } else {
      completeTask(task.id);
    }
  };
  
  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
    setShowPhotoCapture(false);
  };
  
  const handlePhotoSubmit = () => {
    if (selectedTask && capturedPhoto) {
      completeTask(selectedTask.id, capturedPhoto);
      setSelectedTask(null);
      setCapturedPhoto(null);
    }
  };
  
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
  
  const categories = [
    { id: 'all', name: 'All Categories', icon: <Trophy className="w-4 h-4" /> },
    { id: 'health', name: 'Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'career', name: 'Career', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'civic', name: 'Civic', icon: <Heart className="w-4 h-4" /> },
    { id: 'personal', name: 'Personal', icon: <User className="w-4 h-4" /> },
    { id: 'financial', name: 'Financial', icon: <div className="w-4 h-4 flex items-center justify-center">💰</div> },
    { id: 'education', name: 'Education', icon: <div className="w-4 h-4 flex items-center justify-center">📚</div> }
  ];
  
  // Render achievement card
  const renderAchievementCard = (achievement: LifeAchievement, isInProgress: boolean = false, isCompleted: boolean = false) => {
    const theme = getDifficultyTheme(achievement.difficulty);
    const progress = isInProgress ? calculateProgress(achievement.id) : 0;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`p-4 rounded-2xl border-2 transition-all ${
          isCompleted
            ? 'border-green-400/50 bg-green-500/20'
            : isInProgress
            ? 'border-yellow-400/50 bg-yellow-500/20'
            : `${theme.border} hover:${theme.border.replace('/50', '/70')} bg-black/40 hover:bg-black/60`
        }`}
        onClick={() => setSelectedAchievement(achievement)}
      >
        {/* Achievement Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className={`p-3 rounded-2xl ${
            isCompleted 
              ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
              : isInProgress
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : `bg-gradient-to-br ${theme.gradient}`
          } text-white text-lg shadow-lg border border-white/20`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">{achievement.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${
                isCompleted 
                  ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                  : isInProgress
                  ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50'
                  : `bg-gradient-to-r ${theme.gradient} bg-opacity-30 ${theme.text} border ${theme.border}`
              }`}>
                {achievement.difficulty}
              </span>
              <div className={`flex items-center space-x-1 text-xs ${getAgeAppropriatenessColor(achievement)}`}>
                <Target className="w-3 h-3" />
                <span>Age {achievement.ageRange.optimal}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 mb-3 line-clamp-2">{achievement.description}</p>

        {/* Progress Bar (for in-progress achievements) */}
        {isInProgress && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="text-yellow-300">{progress}%</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Achievement Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{achievement.timeToComplete}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Zap className="w-3 h-3" />
              <span>+{achievement.rewards.lifeScore} Life</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span className="capitalize">{getCategoryIcon(achievement.category)} {achievement.category}</span>
          </div>
        </div>

        {/* Action Button */}
        {!isCompleted && !isInProgress && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleStartAchievement(achievement.id);
            }}
            className="w-full mt-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium"
          >
            Start Achievement
          </motion.button>
        )}

        {/* Status Indicators */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20">
            <CheckCircle className="w-4 h-4 text-white fill-current" />
          </div>
        )}

        {isInProgress && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
            <Star className="w-4 h-4 text-white" />
          </div>
        )}
      </motion.div>
    );
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
                  <div className="p-3 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl shadow-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Achievement Task Hub
                  </h2>
                  <p className="text-sm text-gray-400">Track your achievements and complete tasks</p>
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
                <div className="text-2xl font-black text-blue-400">{completedTasks.length}</div>
                <div className="text-xs text-blue-300">Tasks Completed</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-purple-400">{user.avatar.lifeScore || 0}</div>
                <div className="text-xs text-purple-300">Life Score</div>
              </div>
            </div>

            {/* Error Message */}
            {startError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-sm font-bold text-red-300">{startError}</p>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search achievements..."
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-400/50"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'thin' }}>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all whitespace-nowrap ${
                      filterCategory === category.id
                        ? 'border-yellow-400/50 bg-yellow-500/20 text-yellow-300'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6 bg-black/40 p-2 rounded-2xl">
              {[
                { id: 'in-progress', name: 'In Progress', count: inProgressAchievements.length },
                { id: 'available', name: 'Available', count: availableAchievements.length },
                { id: 'completed', name: 'Completed', count: completedAchievementDetails.length }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/30 text-xs">{tab.count}</span>
                </motion.button>
              ))}
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className="relative">
                    {activeTab === 'in-progress' && (
                      renderAchievementCard(achievement, true, false)
                    )}
                    {activeTab === 'completed' && (
                      renderAchievementCard(achievement, false, true)
                    )}
                    {activeTab === 'available' && (
                      renderAchievementCard(achievement, false, false)
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No achievements found</h3>
                  <p className="text-gray-500">
                    {activeTab === 'in-progress' 
                      ? 'Start some achievements to see them here!' 
                      : activeTab === 'completed'
                      ? 'Complete achievements to see them here!'
                      : 'No available achievements match your filters.'}
                  </p>
                </div>
              )}
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
                    className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-6">
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
                      
                      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        {/* Achievement Details */}
                        <div className="md:w-1/3 space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${getDifficultyTheme(selectedAchievement.difficulty).gradient} text-white text-2xl shadow-lg border border-white/20`}>
                              {selectedAchievement.icon}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${
                                  getDifficultyTheme(selectedAchievement.difficulty).text
                                } border ${getDifficultyTheme(selectedAchievement.difficulty).border} bg-black/40`}>
                                  {selectedAchievement.difficulty}
                                </span>
                                <div className={`flex items-center space-x-1 text-xs ${getAgeAppropriatenessColor(selectedAchievement)}`}>
                                  <Target className="w-3 h-3" />
                                  <span>Age {selectedAchievement.ageRange.optimal}</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 capitalize">
                                {getCategoryIcon(selectedAchievement.category)} {selectedAchievement.category}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-300">{selectedAchievement.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                              <div className="text-lg font-bold text-blue-400">{selectedAchievement.timeToComplete}</div>
                              <div className="text-xs text-blue-300">Time Needed</div>
                            </div>
                            <div className="text-center p-3 bg-purple-500/20 border border-purple-400/30 rounded-2xl">
                              <div className="text-lg font-bold text-purple-400">+{selectedAchievement.rewards.lifeScore}</div>
                              <div className="text-xs text-purple-300">Life Score</div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          {currentAchievements.includes(selectedAchievement.id) ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowRemoveConfirm(selectedAchievement.id)}
                              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Remove Achievement</span>
                              </div>
                            </motion.button>
                          ) : !completedAchievements.includes(selectedAchievement.id) && !isAchievementLocked(selectedAchievement) && (
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStartAchievement(selectedAchievement.id)}
                              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white font-bold"
                            >
                              Start This Achievement
                            </motion.button>
                          )}
                        </div>
                        
                        {/* Tasks List */}
                        <div className="md:w-2/3 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white">Achievement Tasks</h4>
                            {currentAchievements.includes(selectedAchievement.id) && (
                              <div className="flex items-center space-x-2">
                                <div className="text-sm text-yellow-300">
                                  {calculateProgress(selectedAchievement.id)}% Complete
                                </div>
                                <div className="text-sm text-gray-400">
                                  {getTimeRemainingText(selectedAchievement.id)}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Progress Bar */}
                          {currentAchievements.includes(selectedAchievement.id) && (
                            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateProgress(selectedAchievement.id)}%` }}
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                              />
                            </div>
                          )}
                          
                          {/* Tasks */}
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                            {getTasksForAchievement(selectedAchievement.id).map((task) => {
                              const isTaskCompleted = completedTasks.includes(task.id);
                              
                              return (
                                <div 
                                  key={task.id}
                                  className={`p-3 rounded-xl border transition-all ${
                                    isTaskCompleted
                                      ? 'border-green-400/50 bg-green-500/20'
                                      : 'border-white/20 bg-black/40'
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                                      isTaskCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'border-2 border-gray-500'
                                    }`}>
                                      {isTaskCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <span className="text-xs text-gray-500">•</span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`font-bold text-sm ${isTaskCompleted ? 'text-green-300' : 'text-white'}`}>
                                        {task.title}
                                      </h5>
                                      <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                      
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                          <Clock className="w-3 h-3" />
                                          <span>{task.estimatedTime}</span>
                                          
                                          <span className="mx-1">•</span>
                                          
                                          <div className="flex items-center space-x-1">
                                            <Camera className="w-3 h-3" />
                                            <span>{task.verificationMethod.replace('_', ' ')}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1 text-xs text-yellow-400">
                                          <Zap className="w-3 h-3" />
                                          <span>+{task.rewards.experience} XP</span>
                                        </div>
                                      </div>
                                      
                                      {!isTaskCompleted && currentAchievements.includes(selectedAchievement.id) && (
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => handleTaskComplete(task)}
                                          className="w-full mt-2 py-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-xs text-white font-medium"
                                        >
                                          Complete Task
                                        </motion.button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
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

            {/* Camera Capture Component */}
            {selectedTask && (
              <CameraCapture
                isOpen={showPhotoCapture}
                onClose={() => setShowPhotoCapture(false)}
                onCapture={handlePhotoCapture}
                prompt={selectedTask.verificationPrompt}
              />
            )}

            {/* Photo Review */}
            <AnimatePresence>
              {capturedPhoto && selectedTask && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-2 sm:p-4"
                  onClick={() => setCapturedPhoto(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-2 sm:p-6 max-w-full sm:max-w-lg w-full shadow-2xl border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg sm:text-xl font-bold text-white">Review & Submit</h3>
                        <motion.button
                          whileHover={{ scale: 1.05, rotate: 90 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCapturedPhoto(null)}
                          className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </motion.button>
                      </div>
                      
                      <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                        <h4 className="font-bold text-blue-300 mb-2">{selectedTask.title}</h4>
                        <p className="text-sm text-blue-200 mb-3">{selectedTask.verificationPrompt}</p>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                        <img 
                          src={capturedPhoto} 
                          alt="Verification" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-2xl text-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-green-300 font-bold">Photo Captured!</p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCapturedPhoto(null);
                              setShowPhotoCapture(true);
                            }}
                            className="flex-1 py-3 bg-gray-600 rounded-xl text-white font-medium"
                          >
                            Retake
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePhotoSubmit}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Submit</span>
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Professional Verification */}
            {selectedAchievement?.profession && (
              <ProfessionalVerification
                isOpen={showProfessionalVerification}
                onClose={() => setShowProfessionalVerification(false)}
                profession={selectedAchievement.profession}
                achievementId={selectedAchievement.id}
              />
            )}

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