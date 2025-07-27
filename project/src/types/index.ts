export interface Sign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  latitude: number;
  longitude: number;
  likes: number;
  isHighlighted: boolean;
  createdBy: string;
  createdAt: Date;
  category: 'poi' | 'danger' | 'group' | 'safe' | 'resource' | 'event' | 'route' | 'warning' | 'civic' | 'environmental' | 'community' | 'petition';
  zoneType: 'point' | 'area' | 'route';
  radius?: number;
  alertDistance?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isActive?: boolean;
  timeRestriction?: {
    startTime?: string;
    endTime?: string;
    days?: number[];
  };
  civicAction?: {
    type: 'cleanup' | 'petition' | 'volunteer' | 'donation' | 'education' | 'advocacy';
    impactPoints: number;
    verificationRequired: boolean;
    organizationPartner?: string;
  };
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'achievement' | 'civic' | 'health' | 'career' | 'personal';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "15 minutes", "2 hours"
  rewards: {
    experience: number;
    civicScore?: number;
    healthScore?: number;
    careerScore?: number;
    lifeScore?: number;
  };
  verificationMethod: 'photo' | 'selfie' | 'location' | 'document' | 'self_report' | 'ai_check';
  verificationPrompt?: string; // Specific instructions for photo/verification
  isCompleted: boolean;
  completedAt?: Date;
  verificationPhoto?: string; // Base64 or URL
  verificationData?: any; // Additional verification data
  dueDate?: Date;
  repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
  linkedAchievementId?: string; // Links to life achievements
  prerequisites?: string[]; // Other task IDs that must be completed first
  tags: string[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TaskList {
  id: string;
  name: string;
  description: string;
  category: TaskItem['category'];
  tasks: TaskItem[];
  progress: number; // 0-100%
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  dueDate?: Date;
}

export interface PlayerAvatar {
  id: string;
  name: string;
  level: number;
  experience: number;
  civicScore: number;
  lifeScore: number;
  healthScore: number;
  careerScore: number;
  customization: {
    hat: string;
    shirt: string;
    pants: string;
    shoes: string;
    accessory?: string;
    emoji: string;
    emojiId: string;
  };
}

export interface HealthProfile {
  currentWeight?: number; // kg
  targetWeight?: number; // kg
  height?: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoals: string[]; // ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility']
  dietaryRestrictions: string[]; // ['vegetarian', 'vegan', 'gluten_free', 'keto', 'paleo']
  healthConditions: string[]; // ['diabetes', 'hypertension', 'heart_disease', 'none']
  sleepHours?: number; // average hours per night
  stressLevel: number; // 1-10 scale
  lastHealthUpdate?: Date;
}

export interface CareerProfile {
  currentRole?: string;
  industry?: string;
  experienceYears?: number;
  salaryRange?: 'under_30k' | '30k_50k' | '50k_75k' | '75k_100k' | '100k_150k' | '150k_plus';
  careerGoals: string[]; // ['promotion', 'career_change', 'entrepreneurship', 'leadership', 'skill_development']
  skills: string[]; // ['programming', 'marketing', 'sales', 'design', 'management']
  educationLevel: 'high_school' | 'bachelors' | 'masters' | 'phd' | 'bootcamp' | 'self_taught';
  entrepreneurshipInterest: number; // 1-10 scale
  leadershipExperience: boolean;
  lastCareerUpdate?: Date;
}

export interface LifeAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'financial' | 'education' | 'travel' | 'health' | 'nutrition' | 'fitness' | 'mental_health' | 'relationships' | 'career' | 'entrepreneurship' | 'leadership' | 'personal' | 'civic' | 'creative' | 'spiritual' | 'environmental';
  ageRange: {
    min: number;
    max: number;
    optimal: number;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  timeToComplete: string;
  prerequisites?: string[];
  profession?: string; // NEW: Specific profession this achievement is for
  rewards: {
    experience: number;
    lifeScore: number;
    healthScore?: number;
    careerScore?: number;
    title?: string;
    badge?: string;
    unlocks?: string[];
  };
  verificationMethod: 'photo' | 'document' | 'self_report' | 'ai_check' | 'community_verify' | 'health_data' | 'career_milestone';
  aiPersonalized: boolean;
  tags: string[];
  requiredData?: string[]; // ['weight', 'height', 'current_role', 'salary'] - data needed for this achievement
  healthMetrics?: {
    targetWeight?: number;
    targetBodyFat?: number;
    targetSteps?: number;
    targetWorkouts?: number;
  };
  careerMetrics?: {
    targetSalary?: number;
    targetRole?: string;
    skillsRequired?: string[];
    networkingGoal?: number; // For percentage improvements (traffic, efficiency, etc.)
    targetImprovement?: number; // For percentage improvements (traffic, efficiency, etc.)
    targetCount?: number; // For countable achievements (potholes fixed, meetings held, etc.)
    targetHours?: number; // For time-based achievements (pro bono hours, etc.)
    targetEmployees?: number; // For team building achievements
    targetRevenue?: number; // For business revenue achievements
    targetAttendance?: number; // For attendance-based achievements
    targetCompletion?: number; // For completion percentage achievements
    targetMeetings?: number; // For meeting-based achievements
  };
  tasks?: TaskItem[]; // Breakdown of achievement into actionable tasks
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  dateOfBirth: Date;
  currentAge: number;
  isVerified: boolean;
  avatar: PlayerAvatar;
  
  // Core Profile Data
  personality: {
    introvert_extrovert: number;
    risk_tolerance: number;
    creativity: number;
    social_focus: number;
  };
  interests: string[];
  goals: string[];
  budget_range: 'low' | 'medium' | 'high';
  time_availability: 'limited' | 'moderate' | 'flexible';
  location_type: 'urban' | 'suburban' | 'rural';
  
  // Health & Wellness Profile
  healthProfile: HealthProfile;
  
  // Career & Professional Profile
  careerProfile: CareerProfile;
  
  // Achievement Progress
  completedLifeAchievements: string[];
  currentLifeAchievements: string[];
  aiRecommendedAchievements: string[];
  
  // Achievement Time Tracking
  lastAchievementStartDate?: Date;
  achievementStartDates?: Record<string, Date>;
  lastAchievementCompletionDate?: Date;
  
  // Task Management
  taskLists: TaskList[];
  completedTasks: string[];
  currentTasks: string[];
  lastTaskCompletionDate?: Date;
  taskVerificationData?: Record<string, {
    completedAt: Date;
    verificationData?: string;
  }>;
  
  // Data Completeness Tracking
  missingDataFields: string[];
  lastDataPrompt?: Date;
  dataCompleteness: number; // 0-100%
  
  // Legacy Data
  createdSigns: string[];
  likedSigns: string[];
  completedCivicActions: string[];
  achievements: Achievement[];
  civicStreak: number;
  lastCivicAction?: Date;
  
  preferences: {
    enableDangerAlerts: boolean;
    enableGroupAlerts: boolean;
    enableRouteAlerts: boolean;
    enableCivicNotifications: boolean;
    enableLifeReminders: boolean;
    enableHealthTracking: boolean;
    enableCareerTracking: boolean;
    alertRadius: number;
    selectedTheme: AppTheme;
  };

  // Add foundSigns to track discovered signs for EXP
  foundSigns: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'civic' | 'environmental' | 'community' | 'explorer' | 'creator';
  requirements: {
    type: 'count' | 'streak' | 'milestone' | 'special';
    target: number;
    action: string;
  };
  reward: {
    experience: number;
    civicScore: number;
    title?: string;
    badge?: string;
  };
  unlockedAt?: Date;
  progress?: number;
}

export interface CivicAction {
  id: string;
  title: string;
  description: string;
  type: 'cleanup' | 'petition' | 'volunteer' | 'donation' | 'education' | 'advocacy';
  impactPoints: number;
  location?: [number, number];
  organizationPartner?: string;
  verificationMethod: 'photo' | 'qr_code' | 'partner_confirm' | 'self_report';
  timeEstimate: string;
  participantCount: number;
  completedBy: string[];
  createdAt: Date;
  deadline?: Date;
  isActive: boolean;
}

export interface AppTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
    warning: string;
  };
  effects: {
    blur: string;
    glow: string;
    shadow: string;
    border: string;
  };
  animations: {
    duration: string;
    easing: string;
    particles: boolean;
    morphing: boolean;
  };
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface NavigationAlert {
  id: string;
  signId: string;
  type: 'danger' | 'warning' | 'info' | 'group' | 'route' | 'civic';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  distance: number;
  timestamp: Date;
  isRead: boolean;
  suggestedAction?: string;
  alternativeRoute?: {
    description: string;
    coordinates: [number, number][];
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'welcome' | 'profile' | 'interests' | 'goals' | 'personality' | 'preferences' | 'health' | 'career' | 'complete';
  component: string;
}

export interface DataPrompt {
  id: string;
  title: string;
  description: string;
  fields: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  category: 'health' | 'career' | 'personal' | 'financial';
  estimatedTime: string;
  benefits: string[];
}