import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { geminiAI } from '../services/geminiAI';
import { 
  X, 
  Brain, 
  MessageCircle, 
  Lightbulb, 
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Heart,
  Award,
  Send,
  Mic,
  Camera,
  Loader,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Activity,
  User,
  Book,
  DollarSign,
  Clock,
  Sparkles
} from 'lucide-react';

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
}

interface AIInsight {
  id: string;
  type: string;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  color: string;
  actionable: boolean;
  actions?: {
    text: string;
    type: 'achievement' | 'task' | 'civic' | 'health';
    data?: any;
  }[];
}

// Utility to get/set Gemini API key in localStorage
const getGeminiApiKey = () => localStorage.getItem('geminiApiKey') || '';
const setGeminiApiKey = (key: string) => localStorage.setItem('geminiApiKey', key);

export const AICoach: React.FC<AICoachProps> = ({ isOpen, onClose }) => {
  const { user, startLifeAchievement, addTaskList, syncTasksWithAchievements } = useGameStore();
  const [activeTab, setActiveTab] = useState<'insights' | 'chat' | 'goals'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [enrollingInsight, setEnrollingInsight] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(getGeminiApiKey());
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    setGeminiApiKey(apiKey);
  }, [apiKey]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        message: `Hello ${user?.username}! I'm your AI Life Coach powered by advanced AI. I've analyzed your profile and I'm here to provide personalized guidance for your goals within CIVIL. What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          'Help me plan my week',
          'Suggest achievements for my age',
          'Improve my health score',
          'Career advancement tips',
          'Analyze my progress'
        ]
      };
      setChatMessages([welcomeMessage]);
    }
  }, [isOpen, user?.username, chatMessages.length]);

  // Generate AI insights
  useEffect(() => {
    if (isOpen && user && insights.length === 0) {
      generateInsights();
    }
  }, [isOpen, user, insights.length]);

  const generateInsights = () => {
    if (!user) return;

    // Generate different types of insights with actionable steps
    const newInsights: AIInsight[] = [
      {
        id: 'health-optimization',
        type: 'recommendation',
        title: 'Health Optimization',
        content: "• Track daily steps in the Health section\n• Complete the 'Fitness Foundation' achievement\n• Schedule regular workouts in Task Manager\n• Monitor sleep quality for better recovery",
        icon: Activity,
        color: 'from-red-400 to-pink-500',
        actionable: true,
        actions: [
          {
            text: 'Start Fitness Foundation',
            type: 'achievement',
            data: 'fitness-routine-start'
          },
          {
            text: 'Track Health Metrics',
            type: 'health',
            data: null
          }
        ]
      },
      {
        id: 'career-growth',
        type: 'recommendation',
        title: 'Career Growth Path',
        content: "• Complete 'Professional Experience' achievement\n• Build networking skills through weekly tasks\n• Document career milestones in your profile\n• Practice salary negotiation techniques",
        icon: Briefcase,
        color: 'from-blue-400 to-indigo-500',
        actionable: true,
        actions: [
          {
            text: 'Start Career Achievement',
            type: 'achievement',
            data: 'internship-experience'
          },
          {
            text: 'Add Weekly Career Tasks',
            type: 'task',
            data: 'career'
          }
        ]
      },
      {
        id: 'civic-engagement',
        type: 'recommendation',
        title: 'Community Impact',
        content: "• Join a local park cleanup this weekend\n• Sign petition for protected bike lanes\n• Volunteer at food bank through the Civic Hub\n• Track your civic score progress",
        icon: Heart,
        color: 'from-green-400 to-emerald-500',
        actionable: true,
        actions: [
          {
            text: 'Find Civic Actions',
            type: 'civic',
            data: null
          },
          {
            text: 'Start Volunteer Achievement',
            type: 'achievement',
            data: 'volunteer-100-hours'
          }
        ]
      },
      {
        id: 'personal-development',
        type: 'analysis',
        title: 'Personal Growth',
        content: "• Practice daily mindfulness using the Task Manager\n• Set up 'Stress Management' achievement\n• Track your sleep quality in Health section\n• Build creative skills through weekly challenges",
        icon: User,
        color: 'from-purple-400 to-violet-500',
        actionable: true,
        actions: [
          {
            text: 'Start Stress Management',
            type: 'achievement',
            data: 'stress-management'
          },
          {
            text: 'Add Mindfulness Tasks',
            type: 'task',
            data: 'personal'
          }
        ]
      },
      {
        id: 'financial-wellness',
        type: 'recommendation',
        title: 'Financial Wellness',
        content: "• Begin 'Financial Foundation' achievement\n• Track spending habits in the app\n• Set up emergency fund milestone\n• Learn budgeting through weekly tasks",
        icon: DollarSign,
        color: 'from-yellow-400 to-amber-500',
        actionable: true,
        actions: [
          {
            text: 'Start Financial Foundation',
            type: 'achievement',
            data: 'savings-account'
          },
          {
            text: 'Add Budget Tasks',
            type: 'task',
            data: 'financial'
          }
        ]
      }
    ];

    setInsights(newInsights);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (!user) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: suggestion,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: '',
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      // Generate predefined response based on suggestion type
      let aiResponse = '';
      let suggestedActions: string[] = [];
      
      if (suggestion.toLowerCase().includes('plan my week')) {
        aiResponse = "Here's a personalized weekly plan for you:\n\n• Monday: Start with a morning workout task\n• Tuesday: Focus on career development tasks\n• Wednesday: Schedule a civic action in your community\n• Thursday: Work on your 'Nutrition Foundation' achievement\n• Friday: Complete a personal development task\n• Weekend: Join a community cleanup event";
        suggestedActions = ['Set up these tasks', 'Modify this plan', 'Focus on health instead', 'Focus on career instead'];
      } 
      else if (suggestion.toLowerCase().includes('achievements')) {
        aiResponse = "Based on your age and interests, these achievements would be perfect for you:\n\n• 'Fitness Foundation' - Establish a consistent workout routine\n• 'Nutrition Foundation' - Learn basic nutrition principles\n• 'Financial Foundation' - Build your first savings account\n• 'Stress Management' - Develop effective stress reduction techniques";
        suggestedActions = ['Start one of these', 'Show me more options', 'Focus on career achievements', 'Show easier achievements'];
      }
      else if (suggestion.toLowerCase().includes('health')) {
        aiResponse = "To improve your health score in CIVIL:\n\n• Complete the 'Fitness Foundation' achievement\n• Track your daily steps in the Health section\n• Add sleep tracking to your routine\n• Join a health-related civic action\n• Complete weekly health tasks consistently";
        suggestedActions = ['Start fitness achievement', 'Set up health tracking', 'Show me health tasks', 'Create a workout plan'];
      }
      else if (suggestion.toLowerCase().includes('career')) {
        aiResponse = "Career advancement strategies in CIVIL:\n\n• Complete the 'Professional Experience' achievement\n• Track networking activities in the Task Manager\n• Join career-focused civic actions\n• Document your skills and accomplishments\n• Set up weekly career development tasks";
        suggestedActions = ['Start career achievement', 'Add networking tasks', 'Show me skill-building tasks', 'Create career plan'];
      }
      else if (suggestion.toLowerCase().includes('progress')) {
        aiResponse = "Analysis of your current progress:\n\n• You're making good progress on health goals\n• Your civic engagement could use more attention\n• Career achievements are on track\n• Consider adding more variety to your tasks\n• Try to maintain a consistent daily streak";
        suggestedActions = ['Show me civic actions', 'Balance my achievements', 'Improve my weak areas', 'Set new goals'];
      }
      else {
        aiResponse = "Here are some personalized recommendations for you:\n\n• Focus on completing your current in-progress achievements\n• Add more variety to your tasks with the Task Manager\n• Join a civic action to boost your community impact\n• Track your health metrics regularly\n• Set up weekly review sessions to assess your progress";
        suggestedActions = ['Show my achievements', 'Find civic actions', 'Set up health tracking', 'Create weekly tasks'];
      }

      // Remove loading message and add real response
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          message: aiResponse,
          timestamp: new Date(),
          suggestions: suggestedActions
        }];
      });
    } catch (error) {
      // Remove loading message and add error response
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          message: "I'm having trouble connecting right now, but I can still help! Try asking about your health goals, career development, or achievements within CIVIL.",
          timestamp: new Date(),
          suggestions: [
            'Help with health goals',
            'Career advice',
            'Achievement planning',
            'Progress review'
          ]
        }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateGoalPlan = async (goal: string) => {
    if (!user) return;

    try {
      // Generate predefined goal plan based on goal type
      let plan = '';
      
      if (goal.toLowerCase().includes('fitness') || goal.toLowerCase().includes('health')) {
        plan = "## Your Personalized Fitness Plan\n\n• **Week 1-2**: Start with the 'Fitness Foundation' achievement\n• **Week 3-4**: Add 'Nutrition Foundation' to optimize your diet\n• **Week 5-8**: Work toward 'Sleep Champion' for recovery\n\n**Potential Obstacles**:\n• Time constraints - Schedule workouts in Task Manager\n• Motivation dips - Use photo verification for accountability\n• Energy levels - Track sleep in Health section\n\n**Success Metrics**:\n• Complete 80% of scheduled workouts\n• Achieve consistent 7-8 hours sleep\n• Reach 10,000 daily steps";
      } 
      else if (goal.toLowerCase().includes('career') || goal.toLowerCase().includes('professional')) {
        plan = "## Your Career Development Plan\n\n• **Month 1**: Complete 'Professional Experience' achievement\n• **Month 2-3**: Work on 'Networking' tasks weekly\n• **Month 4-6**: Begin 'Salary Negotiation' preparation\n\n**Potential Obstacles**:\n• Skill gaps - Use Task Manager to schedule learning\n• Time management - Set specific career hours weekly\n• Confidence - Track small wins in Achievement system\n\n**Success Metrics**:\n• Complete 1 professional achievement quarterly\n• Build network connections tracked in app\n• Document skill development progress";
      }
      else if (goal.toLowerCase().includes('civic') || goal.toLowerCase().includes('community')) {
        plan = "## Your Community Impact Plan\n\n• **Week 1**: Join a cleanup civic action\n• **Week 2-3**: Start 'Community Helper' achievement\n• **Month 1-2**: Participate in 3 different civic action types\n\n**Potential Obstacles**:\n• Finding time - Schedule specific civic hours\n• Location issues - Use map to find nearby opportunities\n• Consistency - Set up weekly civic tasks\n\n**Success Metrics**:\n• Complete 1 civic action weekly\n• Reach 500 civic score points\n• Verify participation with photo documentation";
      }
      else {
        plan = "## Your Personalized 90-Day Plan\n\n• **Month 1**: Focus on health foundations\n  - Complete 'Fitness Foundation' achievement\n  - Set up daily health tracking\n\n• **Month 2**: Build career momentum\n  - Start 'Professional Experience' achievement\n  - Add weekly networking tasks\n\n• **Month 3**: Expand community impact\n  - Join 2-3 civic actions\n  - Begin 'Community Helper' achievement\n\n**Potential Obstacles**:\n• Time management - Use Task Manager for scheduling\n• Motivation - Track progress with photo verification\n• Balance - Distribute tasks across categories\n\n**Success Metrics**:\n• Complete 3 achievements (1 per category)\n• Maintain 80% task completion rate\n• Increase overall Life Score by 500 points";
      }
      
      const planMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: plan,
        timestamp: new Date(),
        suggestions: [
          'How do I start?',
          'Create tasks for this',
          'Show me related achievements',
          'Adapt this for my schedule'
        ]
      };

      setChatMessages(prev => [...prev, planMessage]);
    } catch (error) {
      console.error('Failed to generate goal plan:', error);
    }
  };

  const handleEnrollInInsight = (insightId: string) => {
    setEnrollingInsight(insightId);
    
    const insight = insights.find(i => i.id === insightId);
    if (!insight || !insight.actionable) return;
    
    // Process the first action
    const action = insight.actions?.[0];
    if (!action) return;
    
    setTimeout(() => {
      if (action.type === 'achievement' && action.data) {
        startLifeAchievement(action.data);
      } else if (action.type === 'task') {
        // Generate tasks for the category
        const taskList = {
          id: `${action.data}-${Date.now()}`,
          name: `${action.data.charAt(0).toUpperCase() + action.data.slice(1)} Tasks`,
          description: `Tasks related to ${action.data}`,
          category: action.data,
          tasks: generateTasksForPeriod(action.data, user.id),
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        };
        addTaskList(taskList);
      }
      
      // Show success message
      setEnrollSuccess(insight.title);
      
      // Reset after a delay
      setTimeout(() => {
        setEnrollingInsight(null);
        setEnrollSuccess(null);
      }, 2000);
    }, 1000);
  };

  const openFeature = (featureType: string) => {
    onClose();
    
    setTimeout(() => {
      const gameUI = document.querySelector('.menu-base');
      if (gameUI) {
        let buttonId = '';
        
        switch (featureType) {
          case 'health':
            buttonId = 'health';
            break;
          case 'civic':
            buttonId = 'civic';
            break;
          case 'achievement':
          case 'unified':
            buttonId = 'unified';
            break;
          case 'task':
            // Open the progress tab
            const progressTab = document.querySelector('.progress-tab-toggle');
            if (progressTab) {
              (progressTab as HTMLElement).click();
            }
            return;
        }
        
        if (buttonId) {
          const button = gameUI.querySelector(`button[data-id="${buttonId}"]`);
          if (button) {
            (button as HTMLButtonElement).click();
          }
        }
      }
    }, 300);
  };

  if (!user || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
          onClick={e => e.stopPropagation()}
        >
          {/* Gemini Disclaimer & API Key */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs sm:text-sm text-cyan-200 font-semibold bg-cyan-900/30 px-2 py-1 rounded-lg">
                This AI is powered by Gemini Free. You can add your own Gemini API key for more features. All information and API keys are stored only in your browser and never sent to any server except Gemini.
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {!showApiInput ? (
                <button
                  className="text-xs px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full font-bold hover:from-cyan-600 hover:to-purple-600 transition-all border border-white/10"
                  onClick={() => setShowApiInput(true)}
                >
                  {apiKey ? 'Edit API Key' : 'Add API Key'}
                </button>
              ) : (
                <form
                  onSubmit={e => { e.preventDefault(); setShowApiInput(false); }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Paste Gemini API Key"
                    className="px-2 py-1 rounded bg-gray-800 text-xs text-cyan-200 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    style={{ minWidth: 180 }}
                  />
                  <button
                    type="submit"
                    className="text-xs px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full font-bold border border-white/10"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          </div>

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
                <div className="p-3 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Life Coach
                </h2>
                <p className="text-sm text-gray-400">Powered by Gemini AI - Your personalized achievement guide</p>
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

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6 bg-black/40 p-2 rounded-2xl">
            {[
              { id: 'chat', name: 'Chat Coach', icon: <MessageCircle className="w-4 h-4" /> },
              { id: 'insights', name: 'AI Insights', icon: <Lightbulb className="w-4 h-4" /> },
              { id: 'goals', name: 'Goal Planner', icon: <Target className="w-4 h-4" /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="h-96 bg-black/40 rounded-2xl p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        {message.isLoading ? (
                          <div className="flex items-center space-x-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Suggestions */}
                {chatMessages[chatMessages.length - 1]?.suggestions && !isTyping && (
                  <div className="flex flex-wrap gap-2">
                    {chatMessages[chatMessages.length - 1].suggestions!.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm text-purple-300 hover:bg-purple-500/30 transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">AI-Generated Insights</h3>
                
                {insights.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Generating personalized insights...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl border bg-gradient-to-r ${insight.color} bg-opacity-20 border-white/20 relative overflow-hidden`}
                      >
                        {/* Success Message Overlay */}
                        <AnimatePresence>
                          {enrollSuccess === insight.title && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                            >
                              <CheckCircle className="w-12 h-12 text-white mb-2" />
                              <p className="text-white font-bold text-lg">Enrolled Successfully!</p>
                              <p className="text-white/80 text-sm">Check your tasks and achievements</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            <insight.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-white">{insight.title}</h4>
                              {insight.actionable && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEnrollInInsight(insight.id)}
                                  disabled={enrollingInsight === insight.id}
                                  className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs text-white font-medium"
                                >
                                  {enrollingInsight === insight.id ? (
                                    <div className="flex items-center space-x-1">
                                      <Loader className="w-3 h-3 animate-spin" />
                                      <span>Enrolling...</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-1">
                                      <Sparkles className="w-3 h-3" />
                                      <span>Enroll</span>
                                    </div>
                                  )}
                                </motion.button>
                              )}
                            </div>
                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{insight.content}</p>
                            
                            {insight.actions && insight.actions.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {insight.actions.map((action, i) => (
                                  <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => openFeature(action.type)}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/80 transition-colors flex items-center space-x-1"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    <span>{action.text}</span>
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">AI Goal Planner</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.goals.map((goal, index) => (
                    <motion.div
                      key={goal}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-2xl border border-white/10"
                    >
                      <h4 className="font-bold text-white mb-2 capitalize">{goal.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        Get a personalized AI-generated plan for achieving this goal
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => generateGoalPlan(goal)}
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-medium"
                      >
                        Generate Plan
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick("Create a comprehensive 90-day plan for my goals")}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold"
                >
                  Create Comprehensive 90-Day AI Plan
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};