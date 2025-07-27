import { DataPrompt } from '../types';

export const dataPrompts: DataPrompt[] = [
  {
    id: 'health-basics',
    title: 'Complete Your Health Profile',
    description: 'Help us personalize your health and fitness achievements',
    fields: ['current_weight', 'height', 'activity_level', 'fitness_goals'],
    importance: 'high',
    category: 'health',
    estimatedTime: '3 minutes',
    benefits: [
      'Get personalized weight and fitness goals',
      'Unlock health-specific achievements',
      'Receive AI-powered nutrition recommendations',
      'Track your health progress over time'
    ]
  },
  {
    id: 'career-profile',
    title: 'Build Your Career Profile',
    description: 'Unlock career and entrepreneurship achievements',
    fields: ['current_role', 'salary_range', 'experience_years', 'skills'],
    importance: 'high',
    category: 'career',
    estimatedTime: '4 minutes',
    benefits: [
      'Get personalized career advancement goals',
      'Unlock salary negotiation achievements',
      'Receive entrepreneurship opportunities',
      'Track your professional growth'
    ]
  },
  {
    id: 'wellness-metrics',
    title: 'Wellness & Mental Health',
    description: 'Complete your wellness profile for better life balance',
    fields: ['stress_level', 'sleep_hours'],
    importance: 'medium',
    category: 'health',
    estimatedTime: '2 minutes',
    benefits: [
      'Get stress management achievements',
      'Unlock sleep optimization goals',
      'Improve work-life balance',
      'Track mental health progress'
    ]
  },
  {
    id: 'entrepreneurship-assessment',
    title: 'Entrepreneurship Potential',
    description: 'Discover your entrepreneurial path',
    fields: ['entrepreneurship_interest', 'leadership_experience'],
    importance: 'medium',
    category: 'career',
    estimatedTime: '2 minutes',
    benefits: [
      'Unlock side hustle achievements',
      'Get business-building goals',
      'Access leadership opportunities',
      'Plan your entrepreneurial journey'
    ]
  },
  {
    id: 'weight-goals',
    title: 'Set Your Weight Goals',
    description: 'Define your target weight for personalized achievements',
    fields: ['target_weight'],
    importance: 'medium',
    category: 'health',
    estimatedTime: '1 minute',
    benefits: [
      'Get personalized weight loss/gain plans',
      'Unlock transformation achievements',
      'Track progress with smart goals',
      'Receive nutrition guidance'
    ]
  },
  {
    id: 'health-conditions',
    title: 'Health Considerations',
    description: 'Help us recommend safe and appropriate goals',
    fields: ['health_conditions'],
    importance: 'low',
    category: 'health',
    estimatedTime: '1 minute',
    benefits: [
      'Get safe, personalized recommendations',
      'Avoid inappropriate health goals',
      'Receive condition-specific advice',
      'Ensure your safety first'
    ]
  }
];

export const getRelevantPrompts = (missingFields: string[], userAge: number): DataPrompt[] => {
  return dataPrompts.filter(prompt => 
    prompt.fields.some(field => missingFields.includes(field))
  ).sort((a, b) => {
    // Sort by importance
    const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return importanceOrder[b.importance] - importanceOrder[a.importance];
  });
};

export const shouldShowDataPrompt = (user: any): boolean => {
  // Check if user.lastDataPrompt exists and is a valid Date object
  if (!user.lastDataPrompt || !(user.lastDataPrompt instanceof Date)) {
    return true;
  }
  
  const daysSinceLastPrompt = (Date.now() - user.lastDataPrompt.getTime()) / (1000 * 60 * 60 * 24);
  const missingCriticalData = user.missingDataFields?.length > 10;
  const lowCompleteness = user.dataCompleteness < 60;
  
  return daysSinceLastPrompt > 7 || missingCriticalData || lowCompleteness;
};