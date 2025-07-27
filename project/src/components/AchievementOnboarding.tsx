import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
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
  Brain, 
  ArrowRight,
  ListChecks,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { generateTasksForAchievement } from '../data/taskTemplates';

interface AchievementOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: LifeAchievement;
}

export const AchievementOnboarding: React.FC<AchievementOnboardingProps> = ({ 
  isOpen, 
  onClose, 
  achievement 
}) => {
  const { user } = useGameStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  
  useEffect(() => {
    if (isOpen && achievement) {
      // Generate tasks for this achievement
      const achievementTasks = generateTasksForAchievement(achievement.id, user?.id || '');
      setTasks(achievementTasks);
      
      // Generate predefined suggestions based on achievement type
      generatePredefinedSuggestions();
    }
  }, [isOpen, achievement, user?.id]);
  
  const generatePredefinedSuggestions = () => {
    setIsGeneratingSuggestions(true);
    
    try {
      if (!user) return;
      
      // Create predefined suggestions based on achievement type
      let suggestions = '';
      
      switch (achievement.category) {
        case 'health':
        case 'fitness':
        case 'nutrition':
          suggestions = `• Start with small, manageable steps - consistency is more important than intensity
• Track your progress daily using the app's health tracking features
• Connect with others working on similar health goals through the social features
• Break down your goal into weekly milestones to maintain motivation
• Remember that health changes take time - celebrate small victories along the way`;
          break;
          
        case 'career':
        case 'entrepreneurship':
        case 'leadership':
          suggestions = `• Schedule dedicated time blocks in your calendar for this achievement
• Use the task manager to break down complex career goals into actionable steps
• Document your progress with photos or notes to track your professional growth
• Connect with mentors or colleagues who can provide guidance and feedback
• Focus on building one skill at a time rather than trying to improve everything at once`;
          break;
          
        case 'financial':
          suggestions = `• Create a specific budget plan that aligns with your financial goals
• Use the app's task system to set regular financial check-ins
• Start with small savings amounts and gradually increase as you build the habit
• Track your spending patterns to identify areas for improvement
• Celebrate financial milestones to stay motivated on your journey`;
          break;
          
        case 'education':
        case 'creative':
          suggestions = `• Set aside consistent learning time - even 15 minutes daily adds up
• Break your learning journey into small, achievable milestones
• Use the photo verification to document your progress and creations
• Find ways to apply what you're learning to reinforce knowledge
• Connect with others in the app who share similar interests`;
          break;
          
        case 'travel':
        case 'personal':
          suggestions = `• Research thoroughly before beginning your journey
• Create a detailed plan with the app's task system to stay organized
• Document your experiences with photos for achievement verification
• Step outside your comfort zone - personal growth happens at the edges
• Reflect on your experiences regularly to maximize personal development`;
          break;
          
        case 'civic':
        case 'environmental':
          suggestions = `• Start locally - look for opportunities in your immediate community
• Use the app's civic action features to find organized activities
• Document your impact with photos for achievement verification
• Connect with others in the app who share your passion for civic engagement
• Set regular intervals for civic activities to build a consistent habit`;
          break;
          
        default:
          suggestions = `• Break down this achievement into small, manageable steps
• Use the app's task system to track your progress
• Schedule regular check-ins to maintain momentum
• Document your journey with photos for achievement verification
• Connect with others in the app who are working on similar goals`;
      }
      
      // Add difficulty-specific advice
      if (achievement.difficulty === 'hard' || achievement.difficulty === 'legendary') {
        suggestions += `\n\n• This is a ${achievement.difficulty} achievement - patience and persistence will be key
• Consider setting up weekly review sessions to assess your progress
• Don't get discouraged by setbacks - they're part of any challenging journey`;
      }
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setAiSuggestions("I've prepared some general tips for this achievement: break it down into small steps, track your progress regularly, and celebrate your wins along the way. Remember that consistency is key to achieving any meaningful goal!");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };
  
  const totalSteps = 3;
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Overview
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: 1 }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center text-4xl"
              >
                {achievement.icon}
              </motion.div>
              <h2 className="text-2xl font-bold text-white mt-4">{achievement.name}</h2>
              <p className="text-gray-400 mt-2">{achievement.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-yellow-300">Time Commitment</h3>
                </div>
                <p className="text-sm text-gray-300">{achievement.timeToComplete}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-purple-300">Difficulty</h3>
                </div>
                <p className="text-sm text-gray-300 capitalize">{achievement.difficulty}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-300">Rewards</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>+{achievement.rewards.experience} XP</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>+{achievement.rewards.lifeScore} Life Score</span>
                </div>
                {achievement.rewards.healthScore && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <span>+{achievement.rewards.healthScore} Health</span>
                  </div>
                )}
                {achievement.rewards.careerScore && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <span>+{achievement.rewards.careerScore} Career</span>
                  </div>
                )}
                {achievement.rewards.title && (
                  <div className="col-span-2 flex items-center space-x-2 text-gray-300">
                    <span>Title: {achievement.rewards.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 2: // Suggestions
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Achievement Guide</h2>
              <p className="text-gray-400 mt-2">Personalized advice for your success</p>
            </div>
            
            {isGeneratingSuggestions ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Generating personalized suggestions...</p>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl">
                <div className="flex items-start space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-bold text-purple-300 mb-2">Your Personalized Plan</h3>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {aiSuggestions}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 3: // Tasks
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <ListChecks className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Achievement Tasks</h2>
              <p className="text-gray-400 mt-2">Complete these tasks to achieve your goal</p>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {tasks.map((task, index) => (
                <div 
                  key={task.id}
                  className="p-4 bg-black/40 border border-white/20 rounded-2xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{task.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedTime}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-xs text-yellow-400">
                            <Zap className="w-3 h-3" />
                            <span>+{task.rewards.experience} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen || !achievement) return null;

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
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Achievement Journey
                </h2>
                <p className="text-sm text-gray-400">Your path to success</p>
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

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i + 1 === currentStep
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-600 text-white'
                        : i + 1 < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {i + 1 < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${
                    i + 1 === currentStep
                      ? 'text-yellow-400'
                      : i + 1 < currentStep
                      ? 'text-green-400'
                      : 'text-gray-500'
                  }`}>
                    {i === 0 ? 'Overview' : i === 1 ? 'Guide' : 'Tasks'}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                className="absolute h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full"
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-black/60 border border-white/20 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back</span>
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={isGeneratingSuggestions && currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Start Journey clicked for achievement:', achievement.id);
                  console.log('Current user state:', user);
                  console.log('Current achievements:', user?.currentLifeAchievements);
                  console.log('Tasks generated:', tasks);
                  onClose();
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold"
              >
                <span>Start Journey</span>
                <CheckCircle className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};