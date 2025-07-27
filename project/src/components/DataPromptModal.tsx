import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { DataPrompt, UserProfile } from '../types';
import { X, AlertCircle, TrendingUp, Heart, Briefcase, Target, Clock } from 'lucide-react';

interface DataPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: DataPrompt;
}

export const DataPromptModal: React.FC<DataPromptModalProps> = ({ isOpen, onClose, prompt }) => {
  const { user, updateUserProfile } = useGameStore();
  const [formData, setFormData] = useState<any>({});
  
  // Log formData on every change
  React.useEffect(() => {
    console.log('[DataPromptModal] formData changed:', formData);
  }, [formData]);
  
  if (!user) return null;

  const getPromptIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="w-6 h-6" />;
      case 'career': return <Briefcase className="w-6 h-6" />;
      case 'personal': return <Target className="w-6 h-6" />;
      case 'financial': return <TrendingUp className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getImportanceTheme = (importance: string) => {
    switch (importance) {
      case 'critical':
        return {
          gradient: 'from-red-500 via-pink-500 to-orange-500',
          border: 'border-red-400/50',
          glow: 'shadow-red-500/50',
          text: 'text-red-300'
        };
      case 'high':
        return {
          gradient: 'from-orange-500 via-yellow-500 to-red-500',
          border: 'border-orange-400/50',
          glow: 'shadow-orange-500/50',
          text: 'text-orange-300'
        };
      case 'medium':
        return {
          gradient: 'from-yellow-500 via-amber-500 to-orange-500',
          border: 'border-yellow-400/50',
          glow: 'shadow-yellow-500/50',
          text: 'text-yellow-300'
        };
      case 'low':
        return {
          gradient: 'from-blue-500 via-cyan-500 to-teal-500',
          border: 'border-blue-400/50',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-300'
        };
    }
  };

  const theme = getImportanceTheme(prompt.importance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile with new data
    const updates: Partial<UserProfile> = {};
    
    if (prompt.category === 'health') {
      updates.healthProfile = {
        ...user.healthProfile,
        ...formData,
        lastHealthUpdate: new Date()
      };
    } else if (prompt.category === 'career') {
      updates.careerProfile = {
        ...user.careerProfile,
        ...formData,
        lastCareerUpdate: new Date()
      };
    }
    
    // Remove completed fields from missing data
    const newMissingFields = user.missingDataFields.filter(field => 
      !prompt.fields.includes(field)
    );
    
    updates.missingDataFields = newMissingFields;
    updates.dataCompleteness = Math.round(((50 - newMissingFields.length) / 50) * 100);
    updates.lastDataPrompt = new Date();
    
    if (updateUserProfile) {
      console.log('[DataPromptModal] Saving profile updates:', updates);
      updateUserProfile(updates);
    }
    
    onClose();
  };

  const renderFormFields = () => {
    return prompt.fields.map(field => {
      switch (field) {
        case 'current_weight':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Current Weight (kg)</label>
              <input
                type="number"
                value={formData.currentWeight || ''}
                onChange={(e) => setFormData({...formData, currentWeight: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400"
                placeholder="e.g., 70"
              />
            </div>
          );
        
        case 'target_weight':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Target Weight (kg)</label>
              <input
                type="number"
                value={formData.targetWeight || ''}
                onChange={(e) => setFormData({...formData, targetWeight: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400"
                placeholder="e.g., 65"
              />
            </div>
          );
        
        case 'height':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400"
                placeholder="e.g., 175"
              />
            </div>
          );
        
        case 'activity_level':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Activity Level</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { id: 'sedentary', name: 'Sedentary', desc: 'Little to no exercise' },
                  { id: 'light', name: 'Light', desc: '1-3 days/week' },
                  { id: 'moderate', name: 'Moderate', desc: '3-5 days/week' },
                  { id: 'active', name: 'Active', desc: '6-7 days/week' },
                  { id: 'very_active', name: 'Very Active', desc: '2x/day or intense' }
                ].map((level) => (
                  <motion.button
                    key={level.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, activityLevel: level.id})}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.activityLevel === level.id
                        ? 'border-green-400 bg-green-500/20 text-green-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{level.name}</div>
                    <div className="text-xs opacity-75">{level.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'fitness_goals':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Fitness Goals (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'weight_loss', name: 'Weight Loss', icon: '📉' },
                  { id: 'muscle_gain', name: 'Muscle Gain', icon: '💪' },
                  { id: 'endurance', name: 'Endurance', icon: '🏃' },
                  { id: 'strength', name: 'Strength', icon: '🏋️' },
                  { id: 'flexibility', name: 'Flexibility', icon: '🧘' },
                  { id: 'general_health', name: 'General Health', icon: '❤️' }
                ].map((goal) => (
                  <motion.button
                    key={goal.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const goals = formData.fitnessGoals || [];
                      if (goals.includes(goal.id)) {
                        setFormData({...formData, fitnessGoals: goals.filter((g: string) => g !== goal.id)});
                      } else {
                        setFormData({...formData, fitnessGoals: [...goals, goal.id]});
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all text-left ${
                      (formData.fitnessGoals || []).includes(goal.id)
                        ? 'border-green-400 bg-green-500/20'
                        : 'border-white/20 bg-black/40 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{goal.icon}</span>
                      <span className="text-sm font-bold text-white">{goal.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'current_role':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Current Role/Position</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'software_developer', name: 'Software Developer', icon: '💻' },
                  { id: 'designer', name: 'Designer', icon: '🎨' },
                  { id: 'marketing', name: 'Marketing Professional', icon: '📢' },
                  { id: 'sales', name: 'Sales Representative', icon: '💼' },
                  { id: 'teacher', name: 'Teacher/Educator', icon: '👨‍🏫' },
                  { id: 'healthcare', name: 'Healthcare Professional', icon: '⚕️' },
                  { id: 'finance', name: 'Finance Professional', icon: '📊' },
                  { id: 'engineer', name: 'Engineer', icon: '⚙️' },
                  { id: 'entrepreneur', name: 'Entrepreneur', icon: '🚀' },
                  { id: 'student', name: 'Student', icon: '🎓' },
                  { id: 'manager', name: 'Manager', icon: '👔' },
                  { id: 'other', name: 'Other', icon: '🔍' }
                ].map((role) => (
                  <motion.button
                    key={role.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, currentRole: role.name})}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.currentRole === role.name
                        ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{role.icon}</span>
                      <span className="text-sm font-bold">{role.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'salary_range':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Salary Range</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'under_30k', name: 'Under $30,000', desc: 'Entry level or part-time' },
                  { id: '30k_50k', name: '$30,000 - $50,000', desc: 'Early career' },
                  { id: '50k_75k', name: '$50,000 - $75,000', desc: 'Mid-level' },
                  { id: '75k_100k', name: '$75,000 - $100,000', desc: 'Experienced professional' },
                  { id: '100k_150k', name: '$100,000 - $150,000', desc: 'Senior level' },
                  { id: '150k_plus', name: '$150,000+', desc: 'Executive or specialized' }
                ].map((range) => (
                  <motion.button
                    key={range.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, salaryRange: range.id})}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.salaryRange === range.id
                        ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{range.name}</div>
                    <div className="text-xs opacity-75">{range.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'experience_years':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Years of Experience</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 0, name: 'No experience', desc: 'Just starting out' },
                  { id: 1, name: '1 year', desc: 'Entry level' },
                  { id: 2, name: '2-3 years', desc: 'Some experience' },
                  { id: 5, name: '5+ years', desc: 'Experienced' },
                  { id: 10, name: '10+ years', desc: 'Senior level' },
                  { id: 15, name: '15+ years', desc: 'Expert level' }
                ].map((level) => (
                  <motion.button
                    key={level.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, experienceYears: level.id})}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.experienceYears === level.id
                        ? 'border-teal-400 bg-teal-500/20 text-teal-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{level.name}</div>
                    <div className="text-xs opacity-75">{level.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'stress_level':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Stress Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stressLevel || 5}
                onChange={(e) => setFormData({...formData, stressLevel: parseInt(e.target.value)})}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low Stress</span>
                <span className="text-white font-bold">{formData.stressLevel || 5}</span>
                <span>High Stress</span>
              </div>
            </div>
          );
        
        case 'sleep_hours':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Average Sleep Hours per Night</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { hours: 5, label: 'Under 5 hours' },
                  { hours: 6, label: '6 hours' },
                  { hours: 7, label: '7 hours' },
                  { hours: 8, label: '8 hours' },
                  { hours: 9, label: '9 hours' },
                  { hours: 10, label: '10+ hours' }
                ].map((option) => (
                  <motion.button
                    key={option.hours}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({...formData, sleepHours: option.hours})}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.sleepHours === option.hours
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        case 'entrepreneurship_interest':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Entrepreneurship Interest (1-10)</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <motion.button
                    key={level}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({...formData, entrepreneurshipInterest: level})}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.entrepreneurshipInterest === level
                        ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold">{level}</div>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Not Interested</span>
                <span>Very Interested</span>
              </div>
            </div>
          );
        
        case 'leadership_experience':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Leadership Experience</label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({...formData, leadershipExperience: true})}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.leadershipExperience === true
                      ? 'border-green-400 bg-green-500/20 text-green-300'
                      : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                  }`}
                >
                  Yes, I have leadership experience
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({...formData, leadershipExperience: false})}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.leadershipExperience === false
                      ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                      : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                  }`}
                >
                  No, but I'm interested
                </motion.button>
              </div>
            </div>
          );
        
        case 'skills':
          return (
            <div key={field}>
              <label className="block text-sm font-bold text-white mb-2">Professional Skills (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'programming', name: 'Programming', icon: '💻' },
                  { id: 'marketing', name: 'Marketing', icon: '📢' },
                  { id: 'sales', name: 'Sales', icon: '💼' },
                  { id: 'design', name: 'Design', icon: '🎨' },
                  { id: 'management', name: 'Management', icon: '👥' },
                  { id: 'writing', name: 'Writing', icon: '✍️' },
                  { id: 'analytics', name: 'Analytics', icon: '📊' },
                  { id: 'finance', name: 'Finance', icon: '💰' }
                ].map((skill) => (
                  <motion.button
                    key={skill.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const skills = formData.skills || [];
                      if (skills.includes(skill.id)) {
                        setFormData({...formData, skills: skills.filter((s: string) => s !== skill.id)});
                      } else {
                        setFormData({...formData, skills: [...skills, skill.id]});
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all text-left ${
                      (formData.skills || []).includes(skill.id)
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-white/20 bg-black/40 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        
        default:
          return null;
      }
    });
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
                  <div className={`p-3 bg-gradient-to-br ${theme.gradient} rounded-2xl shadow-lg text-white`}>
                    {getPromptIcon(prompt.category)}
                  </div>
                </motion.div>
                <div>
                  <h2 className={`text-2xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                    {prompt.title}
                  </h2>
                  <p className="text-sm text-gray-400">{prompt.description}</p>
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

            {/* Importance & Benefits */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${theme.gradient} bg-opacity-20 border ${theme.border}`}>
                  <AlertCircle className="w-4 h-4" />
                  <span className={`text-sm font-bold capitalize ${theme.text}`}>
                    {prompt.importance} Priority
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{prompt.estimatedTime}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h3 className="text-sm font-bold text-white mb-2">Why this matters:</h3>
                <ul className="space-y-1">
                  {prompt.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}
              
              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-black/60 border border-white/20 rounded-2xl text-white font-bold"
                >
                  Skip for Now
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 bg-gradient-to-r ${theme.gradient} rounded-2xl text-white font-bold shadow-lg`}
                >
                  Complete Profile
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};