import { LifeAchievement } from '../types';
import { professionalAchievements, getPersonalizedProfessionalAchievements } from './professionalAchievements';

export const lifeAchievements: LifeAchievement[] = [
  // Ages 15-18: Foundation Years
  {
    id: 'first-job',
    name: 'First Paycheck',
    description: 'Get your first part-time job and earn your own money',
    icon: '💼',
    category: 'career',
    ageRange: { min: 15, max: 18, optimal: 16 },
    difficulty: 'easy',
    timeToComplete: '2-4 weeks',
    rewards: {
      experience: 200,
      lifeScore: 100,
      careerScore: 50,
      title: 'Young Professional',
      unlocks: ['savings-account', 'financial-literacy']
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['responsibility', 'independence', 'work-ethic']
  },
  {
    id: 'healthy-weight-teen',
    name: 'Healthy Teen Body',
    description: 'Achieve and maintain a healthy weight for your age and height',
    icon: '⚖️',
    category: 'health',
    ageRange: { min: 15, max: 18, optimal: 16 },
    difficulty: 'medium',
    timeToComplete: '3-6 months',
    requiredData: ['weight', 'height', 'activity_level'],
    healthMetrics: {
      targetWeight: 0, // Will be calculated based on height and age
      targetSteps: 8000,
      targetWorkouts: 3
    },
    rewards: {
      experience: 300,
      lifeScore: 150,
      healthScore: 200,
      title: 'Health Conscious',
      badge: 'healthy-teen'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['health-conscious', 'disciplined', 'body-positive']
  },
  {
    id: 'nutrition-basics',
    name: 'Nutrition Foundation',
    description: 'Learn basic nutrition principles and track your food intake for 30 days',
    icon: '🥗',
    category: 'nutrition',
    ageRange: { min: 15, max: 25, optimal: 17 },
    difficulty: 'easy',
    timeToComplete: '1 month',
    rewards: {
      experience: 250,
      lifeScore: 100,
      healthScore: 150,
      title: 'Nutrition Aware',
      unlocks: ['meal-prep-master', 'macro-tracking']
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['health-conscious', 'educational', 'self-care']
  },
  {
    id: 'fitness-routine-start',
    name: 'Fitness Foundation',
    description: 'Establish a consistent workout routine for 8 weeks',
    icon: '💪',
    category: 'fitness',
    ageRange: { min: 15, max: 30, optimal: 18 },
    difficulty: 'medium',
    timeToComplete: '2 months',
    healthMetrics: {
      targetWorkouts: 24, // 3 per week for 8 weeks
      targetSteps: 8000
    },
    rewards: {
      experience: 400,
      lifeScore: 200,
      healthScore: 300,
      title: 'Fitness Enthusiast',
      badge: 'consistent-athlete'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['disciplined', 'health-conscious', 'goal-oriented']
  },

  // Ages 18-22: Exploration & Education
  {
    id: 'college-networking',
    name: 'Campus Connector',
    description: 'Build a network of 25+ meaningful college connections',
    icon: '🎓',
    category: 'career',
    ageRange: { min: 18, max: 22, optimal: 19 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    careerMetrics: {
      networkingGoal: 25
    },
    rewards: {
      experience: 350,
      lifeScore: 200,
      careerScore: 150,
      title: 'Campus Leader',
      badge: 'network-builder'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['social', 'career-focused', 'strategic']
  },
  {
    id: 'internship-experience',
    name: 'Professional Experience',
    description: 'Complete your first internship or professional work experience',
    icon: '🏢',
    category: 'career',
    ageRange: { min: 18, max: 24, optimal: 20 },
    difficulty: 'medium',
    timeToComplete: '3-6 months',
    requiredData: ['current_role', 'industry'],
    rewards: {
      experience: 500,
      lifeScore: 300,
      careerScore: 250,
      title: 'Professional',
      badge: 'industry-ready',
      unlocks: ['leadership-role', 'skill-specialization']
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['career-focused', 'professional', 'ambitious']
  },
  {
    id: 'weight-loss-goal',
    name: 'Transformation Journey',
    description: 'Lose 10+ pounds through healthy diet and exercise',
    icon: '📉',
    category: 'health',
    ageRange: { min: 16, max: 40, optimal: 22 },
    difficulty: 'hard',
    timeToComplete: '3-6 months',
    requiredData: ['weight', 'height', 'target_weight'],
    healthMetrics: {
      targetWeight: 0, // Will be set based on user input
      targetSteps: 10000,
      targetWorkouts: 4
    },
    rewards: {
      experience: 600,
      lifeScore: 400,
      healthScore: 500,
      title: 'Transformation Champion',
      badge: 'weight-loss-warrior'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['disciplined', 'health-focused', 'determined']
  },
  {
    id: 'muscle-gain-goal',
    name: 'Strength Builder',
    description: 'Gain 10+ pounds of lean muscle mass through strength training',
    icon: '🏋️',
    category: 'fitness',
    ageRange: { min: 18, max: 35, optimal: 23 },
    difficulty: 'hard',
    timeToComplete: '6-12 months',
    requiredData: ['weight', 'height', 'fitness_goals'],
    healthMetrics: {
      targetWeight: 0, // Will be calculated for muscle gain
      targetWorkouts: 4
    },
    rewards: {
      experience: 700,
      lifeScore: 400,
      healthScore: 600,
      title: 'Strength Athlete',
      badge: 'muscle-builder'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['strength-focused', 'disciplined', 'patient']
  },
  {
    id: 'meal-prep-master',
    name: 'Meal Prep Master',
    description: 'Meal prep consistently for 12 weeks to improve nutrition and save money',
    icon: '🍱',
    category: 'nutrition',
    ageRange: { min: 18, max: 35, optimal: 21 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    prerequisites: ['nutrition-basics'],
    rewards: {
      experience: 400,
      lifeScore: 250,
      healthScore: 300,
      title: 'Meal Prep Pro',
      badge: 'kitchen-master'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['organized', 'health-conscious', 'budget-minded']
  },

  // Ages 22-26: Career Building & Health Optimization
  {
    id: 'salary-negotiation',
    name: 'Salary Negotiator',
    description: 'Successfully negotiate a salary increase of 10%+ or land a higher-paying role',
    icon: '💰',
    category: 'career',
    ageRange: { min: 22, max: 30, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '3-6 months',
    requiredData: ['current_role', 'salary_range', 'experience_years'],
    careerMetrics: {
      targetSalary: 0 // Will be calculated based on current salary
    },
    rewards: {
      experience: 600,
      lifeScore: 400,
      careerScore: 500,
      title: 'Negotiation Pro',
      badge: 'salary-champion'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['confident', 'strategic', 'value-aware']
  },
  {
    id: 'side-hustle-launch',
    name: 'Side Hustle Starter',
    description: 'Launch a side business or freelance service earning $500+ monthly',
    icon: '🚀',
    category: 'entrepreneurship',
    ageRange: { min: 20, max: 35, optimal: 24 },
    difficulty: 'hard',
    timeToComplete: '6-12 months',
    requiredData: ['entrepreneurship_interest', 'skills'],
    careerMetrics: {
      targetSalary: 500 // Monthly side income
    },
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 600,
      title: 'Entrepreneur',
      badge: 'side-hustle-hero',
      unlocks: ['business-scaling', 'full-time-entrepreneur']
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['entrepreneurial', 'risk-tolerant', 'innovative']
  },
  {
    id: 'marathon-training',
    name: 'Marathon Finisher',
    description: 'Train for and complete a full marathon (26.2 miles)',
    icon: '🏃‍♂️',
    category: 'fitness',
    ageRange: { min: 20, max: 45, optimal: 26 },
    difficulty: 'legendary',
    timeToComplete: '6-12 months',
    requiredData: ['fitness_goals', 'activity_level'],
    healthMetrics: {
      targetSteps: 15000,
      targetWorkouts: 5
    },
    rewards: {
      experience: 1200,
      lifeScore: 800,
      healthScore: 1000,
      title: 'Marathon Finisher',
      badge: 'endurance-legend'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['endurance-focused', 'determined', 'goal-oriented']
  },
  {
    id: 'stress-management',
    name: 'Stress Master',
    description: 'Develop and maintain stress management techniques, reducing stress level by 30%',
    icon: '🧘‍♀️',
    category: 'mental_health',
    ageRange: { min: 20, max: 50, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '3-6 months',
    requiredData: ['stress_level'],
    rewards: {
      experience: 500,
      lifeScore: 400,
      healthScore: 600,
      title: 'Zen Master',
      badge: 'stress-warrior'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mindful', 'self-aware', 'balanced']
  },
  {
    id: 'sleep-optimization',
    name: 'Sleep Champion',
    description: 'Maintain 7-9 hours of quality sleep for 90 consecutive days',
    icon: '😴',
    category: 'health',
    ageRange: { min: 18, max: 60, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['sleep_hours'],
    rewards: {
      experience: 400,
      lifeScore: 300,
      healthScore: 500,
      title: 'Sleep Expert',
      badge: 'rest-master'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['health-conscious', 'disciplined', 'recovery-focused']
  },

  // Ages 26-30: Leadership & Advanced Goals
  {
    id: 'team-leadership',
    name: 'Team Leader',
    description: 'Lead a team of 5+ people for at least 6 months',
    icon: '👑',
    category: 'leadership',
    ageRange: { min: 24, max: 35, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '6-12 months',
    requiredData: ['current_role', 'leadership_experience'],
    careerMetrics: {
      targetRole: 'Team Lead'
    },
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 600,
      title: 'Leader',
      badge: 'team-builder',
      unlocks: ['executive-role', 'company-founder']
    },
    verificationMethod: 'career_milestone',
    aiPersonalized: true,
    tags: ['leadership-oriented', 'responsible', 'influential']
  },
  {
    id: 'business-scaling',
    name: 'Business Scaler',
    description: 'Scale your side business to $5000+ monthly revenue',
    icon: '📈',
    category: 'entrepreneurship',
    ageRange: { min: 25, max: 40, optimal: 29 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    prerequisites: ['side-hustle-launch'],
    careerMetrics: {
      targetSalary: 5000 // Monthly revenue
    },
    rewards: {
      experience: 1500,
      lifeScore: 1000,
      careerScore: 1200,
      title: 'Business Owner',
      badge: 'scale-master'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['entrepreneurial', 'strategic', 'growth-minded']
  },
  {
    id: 'body-composition-goal',
    name: 'Body Composition Master',
    description: 'Achieve optimal body composition (15% body fat for men, 20% for women)',
    icon: '💎',
    category: 'fitness',
    ageRange: { min: 22, max: 40, optimal: 28 },
    difficulty: 'legendary',
    timeToComplete: '6-18 months',
    requiredData: ['weight', 'height', 'fitness_goals'],
    healthMetrics: {
      targetBodyFat: 0, // Will be set based on gender
      targetWorkouts: 5
    },
    rewards: {
      experience: 1000,
      lifeScore: 700,
      healthScore: 1000,
      title: 'Physique Master',
      badge: 'body-sculptor'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['dedicated', 'disciplined', 'aesthetic-focused']
  },
  {
    id: 'nutrition-expert',
    name: 'Nutrition Expert',
    description: 'Master macro tracking and maintain optimal nutrition for 6 months',
    icon: '🔬',
    category: 'nutrition',
    ageRange: { min: 22, max: 45, optimal: 27 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    prerequisites: ['meal-prep-master'],
    rewards: {
      experience: 600,
      lifeScore: 400,
      healthScore: 700,
      title: 'Nutrition Scientist',
      badge: 'macro-master'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['analytical', 'health-focused', 'precise']
  },

  // Ages 30-35: Mastery & Legacy Building
  {
    id: 'executive-role',
    name: 'Executive Achievement',
    description: 'Reach an executive or senior management position',
    icon: '🏆',
    category: 'career',
    ageRange: { min: 28, max: 45, optimal: 32 },
    difficulty: 'legendary',
    timeToComplete: '2-5 years',
    prerequisites: ['team-leadership'],
    requiredData: ['current_role', 'experience_years', 'leadership_experience'],
    careerMetrics: {
      targetRole: 'Executive'
    },
    rewards: {
      experience: 1500,
      lifeScore: 1000,
      careerScore: 1500,
      title: 'Executive',
      badge: 'c-suite-champion'
    },
    verificationMethod: 'career_milestone',
    aiPersonalized: true,
    tags: ['leadership-focused', 'strategic', 'influential']
  },
  {
    id: 'full-time-entrepreneur',
    name: 'Full-Time Entrepreneur',
    description: 'Transition to full-time entrepreneurship with sustainable income',
    icon: '🌟',
    category: 'entrepreneurship',
    ageRange: { min: 25, max: 50, optimal: 30 },
    difficulty: 'legendary',
    timeToComplete: '1-3 years',
    prerequisites: ['business-scaling'],
    careerMetrics: {
      targetSalary: 10000 // Monthly revenue to replace salary
    },
    rewards: {
      experience: 2000,
      lifeScore: 1500,
      careerScore: 2000,
      title: 'Full-Time Entrepreneur',
      badge: 'freedom-achiever'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['risk-tolerant', 'independent', 'visionary']
  },
  {
    id: 'fitness-coach',
    name: 'Fitness Mentor',
    description: 'Help 10+ people achieve their fitness goals as a coach or mentor',
    icon: '🏋️‍♀️',
    category: 'fitness',
    ageRange: { min: 25, max: 50, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '1-2 years',
    prerequisites: ['body-composition-goal'],
    rewards: {
      experience: 800,
      lifeScore: 600,
      healthScore: 500,
      title: 'Fitness Mentor',
      badge: 'transformation-guide'
    },
    verificationMethod: 'community_verify',
    aiPersonalized: true,
    tags: ['helpful', 'knowledgeable', 'inspiring']
  },
  {
    id: 'longevity-lifestyle',
    name: 'Longevity Master',
    description: 'Adopt and maintain a comprehensive longevity-focused lifestyle',
    icon: '🌿',
    category: 'health',
    ageRange: { min: 30, max: 70, optimal: 35 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['health_conditions', 'sleep_hours', 'stress_level'],
    rewards: {
      experience: 1200,
      lifeScore: 1000,
      healthScore: 1500,
      title: 'Longevity Expert',
      badge: 'life-optimizer'
    },
    verificationMethod: 'health_data',
    aiPersonalized: true,
    tags: ['health-focused', 'long-term-thinker', 'disciplined']
  },

  // Legacy achievements from previous version
  {
    id: 'learn-instrument',
    name: 'Musical Journey',
    description: 'Learn to play a musical instrument for at least 6 months',
    icon: '🎸',
    category: 'creative',
    ageRange: { min: 15, max: 25, optimal: 17 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    rewards: {
      experience: 300,
      lifeScore: 150,
      title: 'Musician',
      badge: 'creative-soul'
    },
    verificationMethod: 'ai_check',
    aiPersonalized: true,
    tags: ['creative', 'patient', 'artistic']
  },
  {
    id: 'volunteer-100-hours',
    name: 'Community Helper',
    description: 'Complete 100 hours of volunteer work in your community',
    icon: '🤝',
    category: 'civic',
    ageRange: { min: 15, max: 22, optimal: 18 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    rewards: {
      experience: 500,
      lifeScore: 300,
      title: 'Community Champion',
      badge: 'volunteer-hero'
    },
    verificationMethod: 'community_verify',
    aiPersonalized: true,
    tags: ['altruistic', 'social', 'empathetic']
  },
  {
    id: 'savings-account',
    name: 'Financial Foundation',
    description: 'Open your first savings account and save $500',
    icon: '🏦',
    category: 'financial',
    ageRange: { min: 16, max: 22, optimal: 18 },
    difficulty: 'easy',
    timeToComplete: '3-6 months',
    prerequisites: ['first-job'],
    rewards: {
      experience: 250,
      lifeScore: 200,
      title: 'Saver',
      unlocks: ['emergency-fund', 'investment-start']
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['responsible', 'future-focused', 'disciplined']
  },
  {
    id: 'solo-travel',
    name: 'Solo Adventure',
    description: 'Take your first solo trip (can be local or international)',
    icon: '🎒',
    category: 'travel',
    ageRange: { min: 18, max: 25, optimal: 20 },
    difficulty: 'medium',
    timeToComplete: '1-2 weeks',
    rewards: {
      experience: 400,
      lifeScore: 250,
      title: 'Solo Explorer',
      badge: 'independent-traveler'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['adventurous', 'independent', 'curious']
  },
  {
    id: 'learn-new-language',
    name: 'Polyglot Path',
    description: 'Achieve conversational level in a new language',
    icon: '🗣️',
    category: 'education',
    ageRange: { min: 16, max: 30, optimal: 20 },
    difficulty: 'hard',
    timeToComplete: '1-2 years',
    rewards: {
      experience: 600,
      lifeScore: 400,
      title: 'Linguist',
      badge: 'global-citizen'
    },
    verificationMethod: 'ai_check',
    aiPersonalized: true,
    tags: ['intellectual', 'persistent', 'culturally-curious']
  },

  // Professional achievements are handled separately to avoid duplicates
  // They are included via getPersonalizedProfessionalAchievements when needed
];

export const getAchievementsByAge = (age: number): LifeAchievement[] => {
  return lifeAchievements.filter(achievement => 
    age >= achievement.ageRange.min && age <= achievement.ageRange.max
  );
};

export const getOptimalAchievements = (age: number): LifeAchievement[] => {
  return lifeAchievements.filter(achievement => 
    Math.abs(achievement.ageRange.optimal - age) <= 2
  );
};

export const getPersonalizedAchievements = (
  age: number, 
  interests: string[], 
  personality: any,
  goals: string[],
  healthProfile?: any,
  careerProfile?: any
): LifeAchievement[] => {
  const availableAchievements = getAchievementsByAge(age);
  
  // Get professional achievements if user has a career profile
  const professionalAchievements = careerProfile?.currentRole 
    ? getPersonalizedProfessionalAchievements({ currentAge: age, careerProfile })
    : [];
  
  const allRelevantAchievements = [...availableAchievements, ...professionalAchievements];
  
  return allRelevantAchievements.filter(achievement => {
    // Match interests
    const interestMatch = interests.some(interest => 
      achievement.tags.includes(interest) || 
      achievement.category === interest
    );
    
    // Match personality traits
    const personalityMatch = achievement.tags.some(tag => {
      switch(tag) {
        case 'introvert': return personality.introvert_extrovert <= 5;
        case 'extrovert': return personality.introvert_extrovert > 5;
        case 'risk-tolerant': return personality.risk_tolerance > 6;
        case 'creative': return personality.creativity > 6;
        case 'social': return personality.social_focus > 6;
        case 'entrepreneurial': return personality.risk_tolerance > 7;
        case 'leadership-oriented': return personality.social_focus > 6;
        default: return true;
      }
    });
    
    // Match goals
    const goalMatch = goals.some(goal => 
      achievement.category === goal || 
      achievement.tags.includes(goal)
    );

    // Health-specific matching
    const healthMatch = healthProfile && achievement.category === 'health' ? 
      achievement.tags.some(tag => healthProfile.fitnessGoals?.includes(tag)) : true;

    // Career-specific matching
    const careerMatch = careerProfile && achievement.category === 'career' ? 
      achievement.tags.some(tag => careerProfile.careerGoals?.includes(tag)) : true;

    // Professional-specific matching
    const professionMatch = achievement.profession ? 
      careerProfile?.currentRole?.toLowerCase().includes(achievement.profession) : true;
    
    return interestMatch || personalityMatch || goalMatch || healthMatch || careerMatch || professionMatch;
  }).sort((a, b) => Math.abs(a.ageRange.optimal - age) - Math.abs(b.ageRange.optimal - age));
};

export const getMissingDataForAchievement = (achievement: LifeAchievement, userProfile: any): string[] => {
  if (!achievement.requiredData) return [];
  
  const missingData: string[] = [];
  
  achievement.requiredData.forEach(field => {
    switch (field) {
      case 'weight':
        if (!userProfile.healthProfile?.currentWeight) missingData.push('current_weight');
        break;
      case 'height':
        if (!userProfile.healthProfile?.height) missingData.push('height');
        break;
      case 'target_weight':
        if (!userProfile.healthProfile?.targetWeight) missingData.push('target_weight');
        break;
      case 'current_role':
        if (!userProfile.careerProfile?.currentRole) missingData.push('current_role');
        break;
      case 'salary_range':
        if (!userProfile.careerProfile?.salaryRange) missingData.push('salary_range');
        break;
      case 'experience_years':
        if (!userProfile.careerProfile?.experienceYears) missingData.push('experience_years');
        break;
      case 'fitness_goals':
        if (!userProfile.healthProfile?.fitnessGoals?.length) missingData.push('fitness_goals');
        break;
      case 'activity_level':
        if (!userProfile.healthProfile?.activityLevel) missingData.push('activity_level');
        break;
      case 'stress_level':
        if (!userProfile.healthProfile?.stressLevel) missingData.push('stress_level');
        break;
      case 'sleep_hours':
        if (!userProfile.healthProfile?.sleepHours) missingData.push('sleep_hours');
        break;
      case 'entrepreneurship_interest':
        if (!userProfile.careerProfile?.entrepreneurshipInterest) missingData.push('entrepreneurship_interest');
        break;
      case 'leadership_experience':
        if (userProfile.careerProfile?.leadershipExperience === undefined) missingData.push('leadership_experience');
        break;
      case 'skills':
        if (!userProfile.careerProfile?.skills?.length) missingData.push('skills');
        break;
      case 'health_conditions':
        if (!userProfile.healthProfile?.healthConditions?.length) missingData.push('health_conditions');
        break;
      case 'industry':
        if (!userProfile.careerProfile?.industry) missingData.push('industry');
        break;
    }
  });
  
  return missingData;
};