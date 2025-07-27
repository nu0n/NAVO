import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { TaskItem, TaskList } from '../types';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Camera, 
  Star, 
  Zap, 
  Calendar,
  Filter,
  Plus,
  Target,
  Award,
  Heart,
  Briefcase,
  Activity,
  User,
  AlertCircle,
  Upload,
  Check,
  ListChecks,
  Trophy
} from 'lucide-react';
import { generateTasksForPeriod, generateTasksForAchievement } from '../data/taskTemplates';
import { CameraCapture } from './CameraCapture';
import { lifeAchievements } from '../data/lifeAchievements';

interface TaskManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    updateUserProfile, 
    completeTask, 
    generateDailyTasks, 
    generateWeeklyTasks,
    syncTasksWithAchievements,
    getTasksForAchievement: getStoreTasksForAchievement,
    getNextTasksForAchievements
  } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly' | 'achievements'>('today');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  if (!user) return null;

  const userTasks = user.taskLists || [];
  const completedTasks = user.completedTasks || [];
  const currentTasks = user.currentTasks || [];
  const inProgressAchievements = user.currentLifeAchievements || [];

  // Get tasks for current tab
  const getTasksForTab = () => {
    switch (activeTab) {
      case 'today':
        // Get daily tasks from task lists
        const dailyLists = userTasks.filter(list => list.category === 'daily');
        if (dailyLists.length > 0) {
          return dailyLists.flatMap(list => list.tasks);
        }
        return generateTasksForPeriod('daily', user.id);
        
      case 'weekly':
        // Get weekly tasks from task lists
        const weeklyLists = userTasks.filter(list => list.category === 'weekly');
        if (weeklyLists.length > 0) {
          return weeklyLists.flatMap(list => list.tasks);
        }
        return generateTasksForPeriod('weekly', user.id);
        
      case 'monthly':
        return generateTasksForPeriod('monthly', user.id);
        
      case 'achievements':
        // Get tasks from current life achievements using the store function
        const achievementTasks: TaskItem[] = [];
        inProgressAchievements.forEach(achievementId => {
          const tasks = getStoreTasksForAchievement(achievementId);
          achievementTasks.push(...tasks);
        });
        return achievementTasks;
        
      default:
        return [];
    }
  };

  const currentTabTasks = useMemo(() => {
    let tasks = getTasksForTab();
    
    // Filter by category
    if (filterCategory !== 'all') {
      tasks = tasks.filter(task => task.category === filterCategory);
    }
    
    return tasks;
  }, [activeTab, filterCategory, inProgressAchievements, userTasks]);

  const getCategoryIcon = (category: TaskItem['category']) => {
    switch (category) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Clock className="w-4 h-4" />;
      case 'monthly': return <Target className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'civic': return <Heart className="w-4 h-4" />;
      case 'health': return <Activity className="w-4 h-4" />;
      case 'career': return <Briefcase className="w-4 h-4" />;
      case 'personal': return <User className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: TaskItem['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400/30 bg-green-500/20';
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      case 'hard': return 'text-red-400 border-red-400/30 bg-red-500/20';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const handleTaskComplete = (task: TaskItem) => {
    if (task.verificationMethod === 'photo' || task.verificationMethod === 'selfie') {
      setSelectedTask(task);
      setShowPhotoCapture(true);
    } else {
      handleCompleteTask(task);
    }
  };

  const handleCompleteTask = (task: TaskItem, photo?: string) => {
    completeTask(task.id, photo);
    setSelectedTask(null);
    setCapturedPhoto(null);
    
    // Check if this completes any achievements
    setTimeout(() => {
      syncTasksWithAchievements();
    }, 500);
  };

  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
    setShowPhotoCapture(false);
  };

  const handlePhotoSubmit = () => {
    if (selectedTask && capturedPhoto) {
      handleCompleteTask(selectedTask, capturedPhoto);
    }
  };

  const handleGenerateTasks = () => {
    if (activeTab === 'today') {
      generateDailyTasks();
    } else if (activeTab === 'weekly') {
      generateWeeklyTasks();
    }
  };

  const categories = [
    { id: 'all', name: 'All Tasks', icon: ListChecks },
    { id: 'daily', name: 'Daily', icon: Calendar },
    { id: 'health', name: 'Health', icon: Activity },
    { id: 'career', name: 'Career', icon: Briefcase },
    { id: 'civic', name: 'Civic', icon: Heart },
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'achievement', name: 'Achievement', icon: Award }
  ];

  // Get achievement name for a task
  const getAchievementName = (taskId: string): string => {
    const achievementId = currentTabTasks.find(t => t.id === taskId)?.linkedAchievementId;
    if (!achievementId) return '';
    
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    return achievement?.name || '';
  };

  // Check if task is in current tasks
  const isCurrentTask = (taskId: string): boolean => {
    return currentTasks.includes(taskId);
  };

  // Get incomplete tasks
  const incompleteTasks = currentTabTasks.filter(t => 
    !completedTasks.includes(t.id) && !t.isCompleted && isCurrentTask(t.id)
  );

  // Get next relevant tasks for all achievements in progress
  const nextRelevantTasks = getNextTasksForAchievements();

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
                  <div className="p-3 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Task Manager
                  </h2>
                  <p className="text-sm text-gray-400">Complete tasks and earn rewards</p>
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

            {/* Task Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-green-400">{completedTasks.length}</div>
                <div className="text-xs text-green-300">Completed</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-blue-400">{incompleteTasks.length}</div>
                <div className="text-xs text-blue-300">Pending</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-yellow-400">{inProgressAchievements.length}</div>
                <div className="text-xs text-yellow-300">Achievements</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-black text-purple-400">{user.avatar.experience}</div>
                <div className="text-xs text-purple-300">XP Earned</div>
              </div>
            </div>

            {/* Quick Next Task Sidebar */}
            {nextRelevantTasks.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-yellow-300">Next Achievement Task</h3>
                  <div className="flex items-center space-x-1 text-xs text-yellow-400">
                    <Award className="w-3 h-3" />
                    <span>{nextRelevantTasks.length} available</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {nextRelevantTasks.slice(0, 2).map((task) => {
                    const achievement = lifeAchievements.find(a => a.id === task.linkedAchievementId);
                    
                    return (
                      <div 
                        key={task.id}
                        className="p-3 rounded-xl border border-yellow-400/30 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all cursor-pointer"
                        onClick={() => handleTaskComplete(task)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-yellow-300 text-sm truncate">{task.title}</h4>
                            {achievement && (
                              <p className="text-xs text-yellow-400 truncate">{achievement.name}</p>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-white"
                          >
                            <Camera className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6 bg-black/40 p-2 rounded-2xl">
              {[
                { id: 'today', name: 'Today', icon: Calendar },
                { id: 'weekly', name: 'Weekly', icon: Clock },
                { id: 'monthly', name: 'Monthly', icon: Target },
                { id: 'achievements', name: 'Achievements', icon: Award }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-xl border transition-all text-sm ${
                    filterCategory === category.id
                      ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                  }`}
                >
                  <category.icon className="w-3 h-3" />
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Generate Tasks Button */}
            {(activeTab === 'today' || activeTab === 'weekly') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateTasks}
                className="w-full mb-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Generate New {activeTab === 'today' ? 'Daily' : 'Weekly'} Tasks</span>
                </div>
              </motion.button>
            )}

            {/* Tasks Grid */}
            <div className="space-y-6">
              {/* Pending Tasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Pending Tasks</h3>
                  <div className="text-sm text-gray-400">
                    {incompleteTasks.length} tasks
                  </div>
                </div>

                {incompleteTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">All tasks completed for this category!</p>
                    <p className="text-gray-500 text-sm mt-2">Check other categories or start new achievements</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Group tasks by priority */}
                    {['urgent', 'high', 'medium', 'low'].map(priority => {
                      const priorityTasks = incompleteTasks.filter(
                        t => t.priority === priority
                      );
                      
                      if (priorityTasks.length === 0) return null;
                      
                      return (
                        <div key={priority} className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              priority === 'urgent' ? 'bg-red-500' :
                              priority === 'high' ? 'bg-orange-500' :
                              priority === 'medium' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}></div>
                            <h4 className="text-sm font-bold text-white capitalize">{priority} Priority</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {priorityTasks.map((task) => (
                              <div 
                                key={task.id}
                                className="p-4 rounded-2xl border-2 border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 transition-all"
                              >
                                {/* Task Header */}
                                <div className="flex items-start space-x-3 mb-3">
                                  <motion.div 
                                    animate={{ 
                                      rotate: [0, 5, -5, 0],
                                      scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                      duration: 3, 
                                      repeat: Infinity, 
                                      ease: "easeInOut" 
                                    }}
                                    className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg shadow-lg border border-white/20"
                                  >
                                    {getCategoryIcon(task.category)}
                                  </motion.div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm mb-1">{task.title}</h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize border ${getDifficultyColor(task.difficulty)}`}>
                                        {task.difficulty}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-xs text-gray-300 mb-3">{task.description}</p>

                                {/* Task Details */}
                                <div className="space-y-3 mb-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1 text-gray-400">
                                      <Clock className="w-3 h-3" />
                                      <span>{task.estimatedTime}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-400">
                                      <Camera className="w-3 h-3" />
                                      <span>{task.verificationMethod}</span>
                                    </div>
                                  </div>
                                  
                                  {task.linkedAchievementId && (
                                    <div className="p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                                      <div className="flex items-center space-x-1 text-xs text-yellow-300">
                                        <Trophy className="w-3 h-3" />
                                        <span>For achievement: {getAchievementName(task.id)}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Rewards */}
                                <div className="flex items-center justify-between text-xs mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-yellow-400">
                                      <Zap className="w-3 h-3" />
                                      <span>+{task.rewards.experience} XP</span>
                                    </div>
                                    {task.rewards.civicScore && (
                                      <div className="flex items-center space-x-1 text-cyan-400">
                                        <Heart className="w-3 h-3" />
                                        <span>+{task.rewards.civicScore}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action Button */}
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleTaskComplete(task)}
                                  className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white font-medium"
                                >
                                  <div className="flex items-center justify-center space-x-2">
                                    <Camera className="w-4 h-4" />
                                    <span>Complete Task</span>
                                  </div>
                                </motion.button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Next Relevant Tasks for Achievements */}
              {activeTab === 'achievements' && nextRelevantTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Next Steps for Achievements</h3>
                    <div className="text-sm text-gray-400">
                      {nextRelevantTasks.length} tasks
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {nextRelevantTasks.map((task) => {
                      const achievement = lifeAchievements.find(a => a.id === task.linkedAchievementId);
                      
                      return (
                        <div 
                          key={task.id}
                          className="p-4 rounded-2xl border-2 border-yellow-400/50 bg-yellow-500/20 transition-all"
                        >
                          {/* Task Header */}
                          <div className="flex items-start space-x-3 mb-3">
                            <motion.div 
                              animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                              className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-lg shadow-lg border border-white/20"
                            >
                              <Award className="w-5 h-5" />
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-bold text-yellow-300 text-sm mb-1">{task.title}</h3>
                              {achievement && (
                                <div className="flex items-center space-x-1 text-xs text-yellow-400 mb-2">
                                  <Trophy className="w-3 h-3" />
                                  <span>{achievement.name}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize border ${getDifficultyColor(task.difficulty)}`}>
                                  {task.difficulty}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-300 mb-3">{task.description}</p>

                          {/* Task Details */}
                          <div className="space-y-3 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{task.estimatedTime}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Camera className="w-3 h-3" />
                                <span>{task.verificationMethod}</span>
                              </div>
                            </div>
                          </div>

                          {/* Rewards */}
                          <div className="flex items-center justify-between text-xs mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 text-yellow-400">
                                <Zap className="w-3 h-3" />
                                <span>+{task.rewards.experience} XP</span>
                              </div>
                              {task.rewards.civicScore && (
                                <div className="flex items-center space-x-1 text-cyan-400">
                                  <Heart className="w-3 h-3" />
                                  <span>+{task.rewards.civicScore}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTaskComplete(task)}
                            className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white font-medium"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <Camera className="w-4 h-4" />
                              <span>Complete Next Step</span>
                            </div>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recently Completed</h3>
                  <div className="text-sm text-gray-400">
                    {completedTasks.length} total
                  </div>
                </div>

                {completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No completed tasks yet.</p>
                    <p className="text-gray-500 text-sm mt-2">Complete some tasks to see them here!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentTabTasks.filter(t => completedTasks.includes(t.id) || t.isCompleted).slice(0, 4).map((task) => (
                      <div 
                        key={task.id}
                        className="p-4 rounded-2xl border-2 border-green-400/50 bg-green-500/20 transition-all"
                      >
                        {/* Task Header */}
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white text-lg shadow-lg border border-white/20">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-green-300 text-sm mb-1">{task.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 rounded-full font-bold capitalize border border-green-400/30 bg-green-500/20 text-green-300">
                                Completed
                              </span>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{task.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 mb-3">{task.description}</p>

                        {/* Rewards */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Zap className="w-3 h-3" />
                              <span>+{task.rewards.experience} XP</span>
                            </div>
                            {task.rewards.civicScore && (
                              <div className="flex items-center space-x-1 text-cyan-400">
                                <Heart className="w-3 h-3" />
                                <span>+{task.rewards.civicScore}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <CheckCircle className="w-3 h-3 fill-current" />
                            <span>Completed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                              <Check className="w-4 h-4" />
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};