import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Target, 
  Zap, 
  User, 
  Settings, 
  Calendar, 
  Briefcase, 
  Activity, 
  Brain, 
  Sparkles,
  Trophy,
  Star,
  Clock,
  Info,
  RefreshCw,
  DollarSign,
  Clock3,
  Home,
  MapPin
} from 'lucide-react';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: (profileData: any) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    currentAge: 25,
    avatar: {
      customization: {
        emoji: '🚶',
        emojiId: 'walk'
      }
    },
    interests: [] as string[],
    goals: [] as string[],
    personality: {
      introvert_extrovert: 5,
      risk_tolerance: 5,
      creativity: 5,
      social_focus: 5,
      planning_spontaneity: 5,
      logical_emotional: 5,
      traditional_progressive: 5,
      practical_theoretical: 5
    },
    healthProfile: {
      activityLevel: 'moderate',
      fitnessGoals: [] as string[],
      stressLevel: 5
    },
    careerProfile: {
      currentRole: '',
      careerGoals: [] as string[],
      income: 'medium'
    },
    budget_range: 'medium',
    time_availability: 'moderate',
    location_type: 'urban'
  });

  // Generate a random username based on user selections
  const generateRandomUsername = () => {
    // Prefixes based on personality traits
    const personalityPrefixes = [
      formData.personality.introvert_extrovert > 5 ? 'Social' : 'Quiet',
      formData.personality.risk_tolerance > 5 ? 'Bold' : 'Steady',
      formData.personality.creativity > 5 ? 'Creative' : 'Logical',
      formData.personality.social_focus > 5 ? 'Community' : 'Solo',
      formData.personality.planning_spontaneity > 5 ? 'Spontaneous' : 'Planner',
      formData.personality.logical_emotional > 5 ? 'Empathic' : 'Rational',
      formData.personality.traditional_progressive > 5 ? 'Progressive' : 'Traditional',
      formData.personality.practical_theoretical > 5 ? 'Visionary' : 'Practical'
    ];
    
    // Suffixes based on interests and goals
    const interestSuffixes: Record<string, string> = {
      fitness: 'Athlete',
      career: 'Pro',
      creativity: 'Artist',
      learning: 'Scholar',
      travel: 'Explorer',
      technology: 'Techie',
      cooking: 'Chef',
      nature: 'Naturalist',
      social: 'Helper',
      finance: 'Investor',
      mindfulness: 'Zen',
      music: 'Maestro'
    };
    
    const goalSuffixes: Record<string, string> = {
      health_fitness: 'Fit',
      career_advancement: 'Climber',
      financial_freedom: 'Wealthy',
      learn_skills: 'Learner',
      travel_explore: 'Voyager',
      build_relationships: 'Friend',
      community_impact: 'Hero',
      personal_growth: 'Evolving'
    };
    
    // Avatar-based words
    const avatarWords: Record<string, string> = {
      walk: 'Walker',
      run: 'Runner',
      bike: 'Rider',
      explore: 'Scout',
      hike: 'Hiker',
      camera: 'Lens',
      star: 'Stellar',
      rocket: 'Rocket'
    };
    
    // Health-based words
    const healthWords: Record<string, string> = {
      sedentary: 'Thinker',
      light: 'Mover',
      moderate: 'Active',
      active: 'Energetic',
      very_active: 'Dynamo'
    };
    
    // Location-based words
    const locationWords: Record<string, string> = {
      urban: 'City',
      suburban: 'Suburb',
      rural: 'Country'
    };
    
    // Budget-based words
    const budgetWords: Record<string, string> = {
      low: 'Saver',
      medium: 'Balanced',
      high: 'Premium'
    };
    
    // Pick random elements
    const randomPrefix = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)];
    
    let randomSuffix = 'Explorer';
    if (formData.interests.length > 0) {
      const randomInterest = formData.interests[Math.floor(Math.random() * formData.interests.length)];
      randomSuffix = interestSuffixes[randomInterest] || 'Explorer';
    } else if (formData.goals.length > 0) {
      const randomGoal = formData.goals[Math.floor(Math.random() * formData.goals.length)];
      randomSuffix = goalSuffixes[randomGoal] || 'Achiever';
    }
    
    const avatarWord = avatarWords[formData.avatar.customization.emojiId] || 'Traveler';
    const healthWord = healthWords[formData.healthProfile.activityLevel] || 'Human';
    const locationWord = locationWords[formData.location_type] || 'Dweller';
    const budgetWord = budgetWords[formData.budget_range] || 'Spender';
    
    // Generate random number
    const randomNum = Math.floor(Math.random() * 1000);
    
    // Create username combinations
    const usernameCombinations = [
      `${randomPrefix}${randomSuffix}${randomNum}`,
      `${avatarWord}${randomPrefix}${randomNum}`,
      `${randomPrefix}${healthWord}${randomNum}`,
      `CIVIL_${randomSuffix}${randomNum}`,
      `${avatarWord}_${randomSuffix}${randomNum % 100}`,
      `${randomPrefix}${randomNum}${randomSuffix}`,
      `${locationWord}${randomSuffix}${randomNum}`,
      `${budgetWord}${avatarWord}${randomNum % 100}`,
      `${randomPrefix}${locationWord}${randomNum}`,
      `${healthWord}${budgetWord}${randomNum}`
    ];
    
    return usernameCombinations[Math.floor(Math.random() * usernameCombinations.length)];
  };

  // Generate username when reaching the final step
  useEffect(() => {
    if (currentStep === steps.length - 1 && !formData.username) {
      const generatedUsername = generateRandomUsername();
      setFormData(prev => ({
        ...prev,
        username: generatedUsername
      }));
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate username one last time if not set
      if (!formData.username) {
        const generatedUsername = generateRandomUsername();
        setFormData(prev => ({
          ...prev,
          username: generatedUsername
        }));
      }
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (parent: string, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[parent as keyof typeof prev][field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [field]: newArray
        }
      };
    });
  };

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to CIVIL',
      component: (
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white">Welcome to CIVIL</h2>
          <p className="text-gray-300">Your Life Achievement Guide</p>
          
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-blue-300">A Humble Note</h3>
            </div>
            <p className="text-sm text-gray-300">
              CIVIL is a passion project created to help friends and family live their best lives. While we're constantly improving, you may encounter occasional issues. We're committed to making this the most meaningful life achievement guide possible - a legacy of positive impact for generations to come.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-300">Life Achievements</h3>
              </div>
              <p className="text-sm text-gray-300">
                Track and complete meaningful life achievements tailored to your age and interests
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-purple-300">Civic Impact</h3>
              </div>
              <p className="text-sm text-gray-300">
                Make a positive difference in your community through civic actions
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-300">Health Tracking</h3>
              </div>
              <p className="text-sm text-gray-300">
                Monitor and improve your physical and mental wellbeing
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-yellow-300">AI Guidance</h3>
              </div>
              <p className="text-sm text-gray-300">
                Get personalized recommendations from your AI life coach
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Create Your Profile',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <User className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Create Your Profile</h2>
            <p className="text-gray-300">Let's get to know you better</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Your Age</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { range: '15-20', label: '15-20 years' },
                  { range: '21-25', label: '21-25 years' },
                  { range: '26-30', label: '26-30 years' },
                  { range: '31-35', label: '31-35 years' },
                  { range: '36-40', label: '36-40 years' },
                  { range: '41-50', label: '41-50 years' },
                  { range: '51-60', label: '51-60 years' },
                  { range: '61-70', label: '61-70 years' },
                  { range: '71+', label: '71+ years' }
                ].map((ageRange) => {
                  const ageValue = ageRange.range === '15-20' ? 18 : 
                                  ageRange.range === '21-25' ? 23 :
                                  ageRange.range === '26-30' ? 28 :
                                  ageRange.range === '31-35' ? 33 :
                                  ageRange.range === '36-40' ? 38 :
                                  ageRange.range === '41-50' ? 45 :
                                  ageRange.range === '51-60' ? 55 :
                                  ageRange.range === '61-70' ? 65 : 75;
                  
                  return (
                    <motion.button
                      key={ageRange.range}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChange('currentAge', ageValue)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        (
                          (ageRange.range === '15-20' && formData.currentAge >= 15 && formData.currentAge <= 20) ||
                          (ageRange.range === '21-25' && formData.currentAge >= 21 && formData.currentAge <= 25) ||
                          (ageRange.range === '26-30' && formData.currentAge >= 26 && formData.currentAge <= 30) ||
                          (ageRange.range === '31-35' && formData.currentAge >= 31 && formData.currentAge <= 35) ||
                          (ageRange.range === '36-40' && formData.currentAge >= 36 && formData.currentAge <= 40) ||
                          (ageRange.range === '41-50' && formData.currentAge >= 41 && formData.currentAge <= 50) ||
                          (ageRange.range === '51-60' && formData.currentAge >= 51 && formData.currentAge <= 60) ||
                          (ageRange.range === '61-70' && formData.currentAge >= 61 && formData.currentAge <= 70) ||
                          (ageRange.range === '71+' && formData.currentAge >= 71)
                        )
                          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                          : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                      }`}
                    >
                      <div className="text-sm font-bold">{ageRange.label}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Choose Your Avatar</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'walk', emoji: '🚶', name: 'Walker' },
                  { id: 'run', emoji: '🏃', name: 'Runner' },
                  { id: 'bike', emoji: '🚴', name: 'Cyclist' },
                  { id: 'explore', emoji: '🧭', name: 'Explorer' },
                  { id: 'hike', emoji: '🥾', name: 'Hiker' },
                  { id: 'camera', emoji: '📸', name: 'Photographer' },
                  { id: 'star', emoji: '⭐', name: 'Star' },
                  { id: 'rocket', emoji: '🚀', name: 'Adventurer' }
                ].map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNestedChange('avatar', 'customization', {
                      ...formData.avatar.customization,
                      emoji: avatar.emoji,
                      emojiId: avatar.id
                    })}
                    className={`p-3 rounded-2xl border-2 transition-all text-center ${
                      formData.avatar.customization.emojiId === avatar.id
                        ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{avatar.emoji}</div>
                    <div className="text-xs">{avatar.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Income Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', name: 'Lower Income', icon: <DollarSign className="w-4 h-4" /> },
                  { id: 'medium', name: 'Middle Income', icon: <DollarSign className="w-4 h-4" /> },
                  { id: 'high', name: 'Higher Income', icon: <DollarSign className="w-4 h-4" /> }
                ].map((income) => (
                  <motion.button
                    key={income.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('budget_range', income.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.budget_range === income.id
                        ? 'border-yellow-400/50 bg-yellow-500/20 text-yellow-300'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      {income.icon}
                      {income.id === 'medium' && <DollarSign className="w-4 h-4" />}
                      {income.id === 'high' && (
                        <>
                          <DollarSign className="w-4 h-4" />
                          <DollarSign className="w-4 h-4" />
                        </>
                      )}
                    </div>
                    <div className="text-xs font-bold">{income.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Time Availability</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'limited', name: 'Limited Time', icon: <Clock3 className="w-4 h-4" /> },
                  { id: 'moderate', name: 'Moderate Time', icon: <Clock3 className="w-4 h-4" /> },
                  { id: 'flexible', name: 'Flexible Time', icon: <Clock3 className="w-4 h-4" /> }
                ].map((time) => (
                  <motion.button
                    key={time.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('time_availability', time.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.time_availability === time.id
                        ? 'border-blue-400/50 bg-blue-500/20 text-blue-300'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {time.icon}
                    </div>
                    <div className="text-xs font-bold">{time.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Location Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'urban', name: 'Urban', icon: <Home className="w-4 h-4" /> },
                  { id: 'suburban', name: 'Suburban', icon: <Home className="w-4 h-4" /> },
                  { id: 'rural', name: 'Rural', icon: <MapPin className="w-4 h-4" /> }
                ].map((location) => (
                  <motion.button
                    key={location.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('location_type', location.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.location_type === location.id
                        ? 'border-green-400/50 bg-green-500/20 text-green-300'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {location.icon}
                    </div>
                    <div className="text-xs font-bold">{location.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interests',
      title: 'Your Interests',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Your Interests</h2>
            <p className="text-gray-300">Select what you're passionate about</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'fitness', name: 'Fitness & Health', icon: '💪' },
              { id: 'career', name: 'Career Growth', icon: '📈' },
              { id: 'creativity', name: 'Creative Arts', icon: '🎨' },
              { id: 'learning', name: 'Learning', icon: '📚' },
              { id: 'travel', name: 'Travel', icon: '✈️' },
              { id: 'technology', name: 'Technology', icon: '💻' },
              { id: 'cooking', name: 'Cooking', icon: '🍳' },
              { id: 'nature', name: 'Nature', icon: '🌿' },
              { id: 'social', name: 'Social Impact', icon: '🤝' },
              { id: 'finance', name: 'Financial Growth', icon: '💰' },
              { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
              { id: 'music', name: 'Music', icon: '🎵' }
            ].map((interest) => (
              <motion.button
                key={interest.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newInterests = formData.interests.includes(interest.id)
                    ? formData.interests.filter(i => i !== interest.id)
                    : [...formData.interests, interest.id];
                  handleChange('interests', newInterests);
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.interests.includes(interest.id)
                    ? 'border-pink-400/50 bg-pink-500/20 text-pink-300'
                    : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="text-sm font-bold">{interest.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Your Life Goals',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Target className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Your Life Goals</h2>
            <p className="text-gray-300">What do you want to achieve?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'health_fitness', name: 'Improve Health & Fitness', icon: '💪' },
              { id: 'career_advancement', name: 'Advance My Career', icon: '📈' },
              { id: 'financial_freedom', name: 'Achieve Financial Freedom', icon: '💰' },
              { id: 'learn_skills', name: 'Learn New Skills', icon: '🧠' },
              { id: 'travel_explore', name: 'Travel & Explore', icon: '🌍' },
              { id: 'build_relationships', name: 'Build Better Relationships', icon: '❤️' },
              { id: 'community_impact', name: 'Make Community Impact', icon: '🤝' },
              { id: 'personal_growth', name: 'Focus on Personal Growth', icon: '🌱' }
            ].map((goal) => (
              <motion.button
                key={goal.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newGoals = formData.goals.includes(goal.id)
                    ? formData.goals.filter(g => g !== goal.id)
                    : [...formData.goals, goal.id];
                  handleChange('goals', newGoals);
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.goals.includes(goal.id)
                    ? 'border-green-400/50 bg-green-500/20 text-green-300'
                    : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-sm font-bold">{goal.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'personality',
      title: 'Your Personality',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Your Personality</h2>
            <p className="text-gray-300">Based on the Big Five personality traits</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Introvert</span>
                <span className="text-sm font-bold text-white">Extrovert</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`introvert-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'introvert_extrovert', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.introvert_extrovert === value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.introvert_extrovert <= 3 ? 'I prefer smaller, intimate settings' :
                 formData.personality.introvert_extrovert <= 7 ? 'I enjoy both social and quiet time' :
                 'I thrive in social, energetic environments'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Cautious</span>
                <span className="text-sm font-bold text-white">Risk-Taking</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`risk-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'risk_tolerance', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.risk_tolerance === value
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.risk_tolerance <= 3 ? 'I prefer safety and certainty' :
                 formData.personality.risk_tolerance <= 7 ? 'I take calculated risks' :
                 'I embrace uncertainty and new challenges'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Practical</span>
                <span className="text-sm font-bold text-white">Creative</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`creative-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'creativity', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.creativity === value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.creativity <= 3 ? 'I focus on practical solutions' :
                 formData.personality.creativity <= 7 ? 'I balance creativity with practicality' :
                 'I love thinking outside the box'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Independent</span>
                <span className="text-sm font-bold text-white">Community-Focused</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`social-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'social_focus', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.social_focus === value
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.social_focus <= 3 ? 'I prefer to work independently' :
                 formData.personality.social_focus <= 7 ? 'I value both individual and group activities' :
                 'I thrive when working with others'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'personality2',
      title: 'Your Personality (Continued)',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Your Personality</h2>
            <p className="text-gray-300">A few more questions to understand you better</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Planner</span>
                <span className="text-sm font-bold text-white">Spontaneous</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`planning-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'planning_spontaneity', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.planning_spontaneity === value
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.planning_spontaneity <= 3 ? 'I prefer to plan everything in advance' :
                 formData.personality.planning_spontaneity <= 7 ? 'I balance planning with spontaneity' :
                 'I prefer to go with the flow and be spontaneous'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Logical</span>
                <span className="text-sm font-bold text-white">Emotional</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`logical-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'logical_emotional', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.logical_emotional === value
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.logical_emotional <= 3 ? 'I make decisions based on logic and facts' :
                 formData.personality.logical_emotional <= 7 ? 'I balance logic and emotions in decisions' :
                 'I trust my feelings and emotions when making decisions'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Traditional</span>
                <span className="text-sm font-bold text-white">Progressive</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`traditional-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'traditional_progressive', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.traditional_progressive === value
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.traditional_progressive <= 3 ? 'I value tradition and established methods' :
                 formData.personality.traditional_progressive <= 7 ? 'I balance tradition with new approaches' :
                 'I embrace change and innovative solutions'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-white">Practical</span>
                <span className="text-sm font-bold text-white">Theoretical</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`practical-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('personality', 'practical_theoretical', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.personality.practical_theoretical === value
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                {formData.personality.practical_theoretical <= 3 ? 'I focus on practical, hands-on solutions' :
                 formData.personality.practical_theoretical <= 7 ? 'I value both practical and theoretical knowledge' :
                 'I enjoy exploring abstract concepts and theories'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'health',
      title: 'Health Profile',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Activity className="w-12 h-12 text-red-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Health Profile</h2>
            <p className="text-gray-300">Tell us about your health goals</p>
          </div>
          
          <div className="space-y-4">
            <div>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNestedChange('healthProfile', 'activityLevel', level.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.healthProfile.activityLevel === level.id
                        ? 'border-red-400 bg-red-500/20 text-red-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{level.name}</div>
                    <div className="text-xs opacity-75">{level.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleArrayToggle('healthProfile', 'fitnessGoals', goal.id)}
                    className={`p-3 rounded-2xl border-2 transition-all text-left ${
                      formData.healthProfile.fitnessGoals.includes(goal.id)
                        ? 'border-red-400 bg-red-500/20'
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
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Stress Level</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <motion.button
                    key={`stress-${value}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNestedChange('healthProfile', 'stressLevel', value)}
                    className={`py-2 rounded-lg transition-all ${
                      formData.healthProfile.stressLevel === value
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold'
                        : 'bg-black/40 border border-white/20 text-gray-400'
                    }`}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low Stress</span>
                <span className="text-white font-bold">{formData.healthProfile.stressLevel}</span>
                <span>High Stress</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'career',
      title: 'Career Profile',
      component: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Career Profile</h2>
            <p className="text-gray-300">Tell us about your professional life</p>
          </div>
          
          <div className="space-y-4">
            <div>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNestedChange('careerProfile', 'currentRole', role.name)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.careerProfile.currentRole === role.name
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
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Career Goals (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'promotion', name: 'Get Promoted', icon: '📈' },
                  { id: 'career_change', name: 'Change Careers', icon: '🔄' },
                  { id: 'leadership', name: 'Leadership Role', icon: '👑' },
                  { id: 'entrepreneurship', name: 'Start a Business', icon: '🚀' },
                  { id: 'work_life_balance', name: 'Better Balance', icon: '⚖️' },
                  { id: 'skill_development', name: 'New Skills', icon: '🧠' }
                ].map((goal) => (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleArrayToggle('careerProfile', 'careerGoals', goal.id)}
                    className={`p-3 rounded-2xl border-2 transition-all text-left ${
                      formData.careerProfile.careerGoals.includes(goal.id)
                        ? 'border-blue-400 bg-blue-500/20'
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
            
            <div>
              <label className="block text-sm font-bold text-white mb-2">Income Level</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'under_30k', name: 'Under $30,000', desc: 'Entry level or part-time' },
                  { id: '30k_50k', name: '$30,000 - $50,000', desc: 'Early career' },
                  { id: '50k_75k', name: '$50,000 - $75,000', desc: 'Mid-level' },
                  { id: '75k_100k', name: '$75,000 - $100,000', desc: 'Experienced professional' },
                  { id: '100k_150k', name: '$100,000 - $150,000', desc: 'Senior level' },
                  { id: '150k_plus', name: '$150,000+', desc: 'Executive or specialized' }
                ].map((income) => (
                  <motion.button
                    key={income.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNestedChange('careerProfile', 'income', income.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.careerProfile.income === income.id
                        ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                        : 'border-white/20 bg-black/40 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <div className="font-bold text-sm">{income.name}</div>
                    <div className="text-xs opacity-75">{income.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Ready to Begin',
      component: (
        <div className="space-y-6 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center"
          >
            <Star className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
          <p className="text-gray-300">Your personalized journey awaits</p>
          
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-purple-300">Your Username</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const newUsername = generateRandomUsername();
                  handleChange('username', newUsername);
                }}
                className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-purple-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center text-xl">
                {formData.avatar.customization.emoji}
              </div>
              <div className="text-xl font-bold text-white">{formData.username}</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-green-300">Your Journey Begins</h3>
            </div>
            <p className="text-sm text-gray-300">
              Based on your profile, we've prepared personalized achievements and tasks to help you reach your goals. Track your progress, earn rewards, and make a positive impact on your life and community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-purple-300">Age-Based Goals</h3>
              </div>
              <p className="text-sm text-gray-300">
                Achievements tailored to your current age of {formData.currentAge}
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-yellow-300">Earn Rewards</h3>
              </div>
              <p className="text-sm text-gray-300">
                Complete tasks and achievements to level up and earn rewards
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        >
          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, i) => (
                <div 
                  key={i}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === currentStep
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white'
                        : i < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {i < currentStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                className="absolute h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {steps[currentStep].component}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-black/60 border border-white/20 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-bold"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};