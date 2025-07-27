import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Trophy, 
  Target,
  ArrowRight,
  X,
  ListChecks,
  Trash2,
  AlertTriangle,
  MapPin,
  Camera
} from 'lucide-react';
import { lifeAchievements } from '../data/lifeAchievements';
import { generateTasksForAchievement } from '../data/taskTemplates';
import { civicActions } from '../data/civicActions';
import { CameraCapture } from './CameraCapture';

export const ProgressTab: React.FC = () => {
  const { 
    user, 
    completeTask, 
    removeLifeAchievement,
    syncTasksWithAchievements,
    getTasksForAchievement: getStoreTasksForAchievement,
    getAchievementProgress,
    debugCurrentState,
    userLocation
  } = useGameStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'tasks' | 'civic'>('achievements');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  // Close tab when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.progress-tab') && !target.closest('.progress-tab-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const inProgressAchievements = user.currentLifeAchievements || [];
  const completedTasks = user.completedTasks || [];
  const currentTasks = user.currentTasks || [];
  const achievementStartDates = user.achievementStartDates || {};
  const completedCivicActions = user.completedCivicActions || [];

  // Get achievement details
  const currentAchievements = lifeAchievements.filter(achievement => 
    inProgressAchievements.includes(achievement.id)
  ).slice(0, 5);

  // Get tasks for achievements using the store function
  const getTasksForAchievement = (achievementId: string) => {
    return getStoreTasksForAchievement(achievementId);
  };

  // Get all incomplete tasks across all achievements
  const allIncompleteTasks = inProgressAchievements.flatMap(achievementId => 
    getTasksForAchievement(achievementId)
  ).filter(task => !completedTasks.includes(task.id)).slice(0, 5);

  // Get active civic actions
  const activeCivicActions = civicActions.filter(action => 
    !completedCivicActions.includes(action.id) && action.isActive
  ).slice(0, 3);

  // Calculate achievement progress using the store function
  const calculateProgress = (achievementId: string): number => {
    const progress = getAchievementProgress(achievementId);
    return progress.progress;
  };

  // Get time remaining text
  const getTimeRemainingText = (achievementId: string): string => {
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    if (!achievement) return '';
    
    const startDate = achievementStartDates[achievementId];
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

  // Handle task completion
  const handleTaskComplete = (task: any) => {
    if (task.verificationMethod === 'photo' || task.verificationMethod === 'selfie') {
      setSelectedTask(task);
      setShowPhotoCapture(true);
    } else {
      completeTask(task.id);
      
      // Check if this completes any achievements
      setTimeout(() => {
        syncTasksWithAchievements();
      }, 500);
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
      
      // Check if this completes any achievements
      setTimeout(() => {
        syncTasksWithAchievements();
      }, 500);
    }
  };

  // Handle achievement removal
  const handleRemoveAchievement = (achievementId: string) => {
    removeLifeAchievement(achievementId);
    setShowRemoveConfirm(null);
  };

  // Open the unified achievement hub
  const openUnifiedHub = () => {
    setIsOpen(false);
    const gameUI = document.querySelector('.menu-base');
    if (gameUI) {
      const achievementButton = gameUI.querySelector('button[data-id="unified"]');
      if (achievementButton) {
        (achievementButton as HTMLButtonElement).click();
      }
    }
  };

  // Open the civic action hub
  const openCivicHub = () => {
    setIsOpen(false);
    const gameUI = document.querySelector('.menu-base');
    if (gameUI) {
      const civicButton = gameUI.querySelector('button[data-id="civic"]');
      if (civicButton) {
        (civicButton as HTMLButtonElement).click();
      }
    }
  };

  // Get distance to civic action (if location is available)
  const getDistanceText = (action: any): string => {
    if (!userLocation || !action.location) return 'Location varies';
    
    // Calculate distance (simplified)
    const distance = Math.sqrt(
      Math.pow(userLocation[0] - action.location[0], 2) + 
      Math.pow(userLocation[1] - action.location[1], 2)
    ) * 111000; // Rough conversion to meters
    
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    } else {
      return `${(distance / 1000).toFixed(1)}km away`;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, x: isOpen ? 0 : -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="progress-tab-toggle fixed left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-r-xl shadow-lg z-40"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-white" />
        ) : (
          <div className="flex flex-col items-center">
            <ListChecks className="w-5 h-5 text-white" />
            <div className="mt-1 text-xs font-bold text-white">Tasks</div>
          </div>
        )}
      </motion.button>

      {/* Progress Tab Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="progress-tab fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 shadow-2xl z-40 overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Current Progress
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex mt-4 bg-black/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'achievements' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'tasks' 
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('civic')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'civic' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Civic
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'achievements' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Current Achievements</h3>
                    <div className="text-xs text-gray-400">{inProgressAchievements.length}/15</div>
                  </div>
                  
                  {currentAchievements.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No achievements in progress</p>
                      <p className="text-xs text-gray-500 mt-2">Start an achievement from the Achievement tab</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentAchievements.map(achievement => (
                        <div 
                          key={achievement.id}
                          className="p-3 bg-black/50 border border-white/10 rounded-xl relative"
                        >
                          {showRemoveConfirm === achievement.id && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 p-3">
                              <div className="text-center">
                                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <p className="text-xs text-red-300 mb-3">Remove achievement? You'll lose half your level!</p>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => setShowRemoveConfirm(null)}
                                    className="flex-1 py-1 bg-gray-700 rounded-lg text-white text-xs"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveAchievement(achievement.id)}
                                    className="flex-1 py-1 bg-red-600 rounded-lg text-white text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-lg">
                              {achievement.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-white truncate">{achievement.name}</h4>
                                <button 
                                  onClick={() => setShowRemoveConfirm(achievement.id)}
                                  className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                                  {achievement.difficulty}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {calculateProgress(achievement.id)}% complete
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="mt-2 h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${calculateProgress(achievement.id)}%` }}
                                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                />
                              </div>
                              
                              {/* Time Remaining */}
                              <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{getTimeRemainingText(achievement.id)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Next Task */}
                          {getTasksForAchievement(achievement.id)[0] && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center space-x-1 text-xs text-gray-400 mb-2">
                                <Target className="w-3 h-3" />
                                <span>Next Task:</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex-shrink-0" />
                                <p className="text-xs text-white line-clamp-1">
                                  {getTasksForAchievement(achievement.id)[0].title}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTaskComplete(getTasksForAchievement(achievement.id)[0])}
                                className="w-full mt-2 py-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-xs text-white font-medium"
                              >
                                Complete Task
                              </motion.button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'tasks' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Current Tasks</h3>
                    <div className="text-xs text-gray-400">
                      {allIncompleteTasks.length} pending
                    </div>
                  </div>
                  
                  {allIncompleteTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">All tasks completed!</p>
                      <p className="text-xs text-gray-500 mt-2">Start new achievements to get more tasks</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allIncompleteTasks.map(task => {
                        const achievement = lifeAchievements.find(a => a.id === task.linkedAchievementId);
                        
                        return (
                          <div 
                            key={task.id}
                            className="p-3 bg-black/50 border border-white/10 rounded-xl"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="mt-0.5">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">•</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white">{task.title}</h4>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{task.estimatedTime}</span>
                                  </div>
                                  
                                  {achievement && (
                                    <div className="flex items-center space-x-1 text-xs text-yellow-500">
                                      <Trophy className="w-3 h-3" />
                                      <span className="truncate max-w-[100px]">{achievement.name}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleTaskComplete(task)}
                                  className="w-full mt-2 py-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-xs text-white font-medium"
                                >
                                  <div className="flex items-center justify-center space-x-2">
                                    {task.verificationMethod === 'photo' ? (
                                      <Camera className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    <span>Complete Task</span>
                                  </div>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'civic' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Civic Actions</h3>
                    <div className="text-xs text-gray-400">
                      {activeCivicActions.length} available
                    </div>
                  </div>
                  
                  {activeCivicActions.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No civic actions available</p>
                      <p className="text-xs text-gray-500 mt-2">Check the Civic Action Hub for more</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeCivicActions.map(action => (
                        <div 
                          key={action.id}
                          className="p-3 bg-black/50 border border-white/10 rounded-xl"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg text-lg">
                              {action.type === 'cleanup' ? '🧹' : 
                               action.type === 'petition' ? '📝' : 
                               action.type === 'volunteer' ? '🤝' : 
                               action.type === 'donation' ? '💝' : 
                               action.type === 'education' ? '🎓' : '📢'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white">{action.title}</h4>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{action.description}</p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{action.timeEstimate}</span>
                                </div>
                                
                                <div className="flex items-center space-x-1 text-xs text-green-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>{getDistanceText(action)}</span>
                                </div>
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={openCivicHub}
                                className="w-full mt-2 py-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-xs text-white font-medium"
                              >
                                Join This Action
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* View All Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={openUnifiedHub}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-medium"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>View All in Achievement Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            </div>
            
            {/* Daily Streak */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Daily Streak</div>
                  <div className="text-lg font-bold text-white">{user.civicStreak || 0} days</div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < (user.civicStreak || 0) % 7
                          ? 'bg-gradient-to-r from-green-400 to-teal-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
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
    </>
  );
};