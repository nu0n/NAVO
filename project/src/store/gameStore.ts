import { create } from 'zustand';
import { Sign, UserProfile, PlayerAvatar, MapViewState, NavigationAlert, AppTheme, Achievement, LifeAchievement, TaskItem, TaskList } from '../types';
import { themes } from '../data/themes';
import { achievements } from '../data/achievements';
import { lifeAchievements } from '../data/lifeAchievements';
import { generateTasksForAchievement, generateTasksForPeriod } from '../data/taskTemplates';
import { civicActions } from '../data/civicActions';

interface GameState {
  user: UserProfile | null;
  signs: Sign[];
  userLocation: [number, number] | null;
  mapViewState: MapViewState;
  selectedSign: Sign | null;
  isCreatingSign: boolean;
  showAvatarCustomization: boolean;
  showOnboarding: boolean;
  showDataPrompt: boolean;
  currentDataPrompt: any;
  navigationAlerts: NavigationAlert[];
  isInitialized: boolean;
  foundSigns: string[];
  
  setUser: (user: UserProfile) => void;
  setSigns: (signs: Sign[]) => void;
  addSign: (sign: Sign) => void;
  likeSign: (signId: string) => void;
  setUserLocation: (location: [number, number]) => void;
  setMapViewState: (viewState: MapViewState) => void;
  setSelectedSign: (sign: Sign | null) => void;
  setIsCreatingSign: (isCreating: boolean) => void;
  setShowAvatarCustomization: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  setShowDataPrompt: (show: boolean, prompt?: any) => void;
  setIsInitialized: (initialized: boolean) => void;
  updatePlayerAvatar: (avatar: Partial<PlayerAvatar>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addNavigationAlert: (alert: NavigationAlert) => void;
  dismissNavigationAlert: (alertId: string) => void;
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  completeCivicAction: (actionId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  completeLifeAchievement: (achievementId: string) => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;
  completeTask: (taskId: string, verificationData?: any) => void;
  addTaskList: (taskList: TaskList) => void;
  startLifeAchievement: (achievementId: string) => void;
  removeLifeAchievement: (achievementId: string) => void;
  generateDailyTasks: () => void;
  generateWeeklyTasks: () => void;
  syncTasksWithAchievements: () => void;
  trackCivicActionAsTask: (actionId: string) => void;
  debugTaskSync: () => void;
  getCurrentTasks: () => TaskItem[];
  getTasksForAchievement: (achievementId: string) => TaskItem[];
  getAchievementProgress: (achievementId: string) => { progress: number; completedTasks: number; totalTasks: number };
  debugCurrentState: () => void;
  getNextTaskForAchievement: (achievementId: string) => TaskItem | null;
  getNextTasksForAchievements: () => TaskItem[];
  debugTaskIdConsistency: () => void;
  migrateTaskIds: () => void;
  grantExpForSign: (signId: string, exp: number) => boolean;
}

const createDefaultSigns = (): Sign[] => [
  {
    id: '1',
    title: '⚠️ Pickpocket Hotspot',
    description: 'High tourist area with frequent pickpocket incidents. Keep valuables secure and stay alert. Avoid displaying expensive items.',
    latitude: 40.7589,
    longitude: -73.9851,
    likes: 45,
    isHighlighted: true,
    createdBy: 'SafetyFirst',
    createdAt: new Date(),
    category: 'danger',
    zoneType: 'area',
    radius: 150,
    alertDistance: 200,
    severity: 'high',
    isActive: true
  },
  {
    id: '2',
    title: '🛡️ Tourist Police Station',
    description: 'Tourist police station with English-speaking officers. Safe zone for assistance and reporting incidents.',
    latitude: 40.7614,
    longitude: -73.9776,
    likes: 28,
    isHighlighted: false,
    createdBy: 'LocalGuide',
    createdAt: new Date(),
    category: 'safe',
    zoneType: 'point',
    alertDistance: 100,
    severity: 'low',
    isActive: true
  },
  {
    id: '3',
    title: '👥 Free Walking Tour Meetup',
    description: 'Daily free walking tours start here at 10 AM and 2 PM. Great way to explore the city safely with a group.',
    latitude: 40.7681,
    longitude: -73.9819,
    likes: 67,
    isHighlighted: false,
    createdBy: 'TourGuide_NYC',
    createdAt: new Date(),
    category: 'group',
    zoneType: 'point',
    alertDistance: 150,
    severity: 'low',
    isActive: true,
    timeRestriction: {
      startTime: '09:30',
      endTime: '15:30',
      days: [1, 2, 3, 4, 5, 6]
    }
  },
  {
    id: '4',
    title: '🚨 Construction Zone - Detour',
    description: 'Major construction blocking main route. Use alternative path via 5th Avenue. Expected completion: Next month.',
    latitude: 40.7505,
    longitude: -73.9934,
    likes: 23,
    isHighlighted: true,
    createdBy: 'CityUpdates',
    createdAt: new Date(),
    category: 'route',
    zoneType: 'area',
    radius: 100,
    alertDistance: 300,
    severity: 'medium',
    isActive: true
  },
  {
    id: '5',
    title: '🏪 24/7 Tourist Resources',
    description: 'ATM, free WiFi, clean restrooms, and tourist information. Currency exchange available. Safe and well-lit area.',
    latitude: 40.7580,
    longitude: -73.9855,
    likes: 89,
    isHighlighted: false,
    createdBy: 'HelpfulLocal',
    createdAt: new Date(),
    category: 'resource',
    zoneType: 'point',
    alertDistance: 100,
    severity: 'low',
    isActive: true
  },
  {
    id: '6',
    title: '🌳 Community Park Cleanup',
    description: 'Join our weekly park cleanup every Saturday at 9 AM. Help keep our green spaces beautiful for everyone!',
    latitude: 40.7829,
    longitude: -73.9654,
    likes: 156,
    isHighlighted: false,
    createdBy: 'EcoWarrior',
    createdAt: new Date(),
    category: 'civic',
    zoneType: 'point',
    alertDistance: 100,
    severity: 'low',
    isActive: true,
    civicAction: {
      type: 'cleanup',
      impactPoints: 100,
      verificationRequired: true,
      organizationPartner: 'NYC Parks Department'
    }
  }
];

const updateUserWithRewards = (user: UserProfile, rewards: { experience?: number; civicScore?: number; lifeScore?: number; healthScore?: number; careerScore?: number }) => ({
  ...user,
  avatar: {
    ...user.avatar,
    experience: user.avatar.experience + (rewards.experience || 0),
    civicScore: user.avatar.civicScore + (rewards.civicScore || 0),
    lifeScore: (user.avatar.lifeScore || 0) + (rewards.lifeScore || 0),
    healthScore: (user.avatar.healthScore || 0) + (rewards.healthScore || 0),
    careerScore: (user.avatar.careerScore || 0) + (rewards.careerScore || 0),
    level: Math.floor((user.avatar.experience + (rewards.experience || 0)) / 1000) + 1
  }
});

// Generate a random user ID
const generateUserId = () => {
  return `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  showOnboarding: true,
  showDataPrompt: false,
  currentDataPrompt: null,
  isInitialized: false,
  foundSigns: [],
  signs: createDefaultSigns(),
  userLocation: null,
  mapViewState: {
    longitude: -73.9851,
    latitude: 40.7589,
    zoom: 18,
    bearing: 0,
    pitch: 60
  },
  selectedSign: null,
  isCreatingSign: false,
  showAvatarCustomization: false,
  navigationAlerts: [],

  setUser: (user) => set({ user: { ...user, foundSigns: user.foundSigns ?? [] } }),
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  setShowDataPrompt: (show, prompt) => set({ showDataPrompt: show, currentDataPrompt: prompt }),
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
  setSigns: (signs) => set({ signs }),
  
  addSign: (sign) => set((state) => ({ 
    signs: [...state.signs, sign],
    user: state.user ? {
      ...state.user,
      createdSigns: [...state.user.createdSigns, sign.id],
      ...updateUserWithRewards(state.user, {
        experience: sign.category === 'civic' ? 150 : 100,
        civicScore: sign.category === 'civic' ? 75 : 25
      })
    } : state.user
  })),
  
  likeSign: (signId) => set((state) => ({
    signs: state.signs.map(sign => 
      sign.id === signId ? { ...sign, likes: sign.likes + 1 } : sign
    ),
    user: state.user ? {
      ...state.user,
      likedSigns: [...state.user.likedSigns, signId],
      ...updateUserWithRewards(state.user, { experience: 25, civicScore: 10 })
    } : state.user
  })),
  
  setUserLocation: (location) => set({ userLocation: location }),
  setMapViewState: (viewState) => set({ mapViewState: viewState }),
  setSelectedSign: (sign) => set({ selectedSign: sign }),
  setIsCreatingSign: (isCreating) => set({ isCreatingSign: isCreating }),
  setShowAvatarCustomization: (show) => set({ showAvatarCustomization: show }),
  
  updatePlayerAvatar: (avatarUpdate) => set((state) => ({
    user: state.user ? {
      ...state.user,
      avatar: { ...state.user.avatar, ...avatarUpdate }
    } : state.user
  })),
  
  updateUserProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : state.user
  })),
  
  addNavigationAlert: (alert) => set((state) => ({
    navigationAlerts: [...state.navigationAlerts, alert]
  })),
  
  dismissNavigationAlert: (alertId) => set((state) => ({
    navigationAlerts: state.navigationAlerts.filter(a => a.id !== alertId)
  })),
  
  updateUserPreferences: (preferences) => set((state) => ({
    user: state.user ? {
      ...state.user,
      preferences: { ...state.user.preferences, ...preferences }
    } : state.user
  })),
  
  completeCivicAction: (actionId) => set((state) => {
    if (!state.user) return state;
    
    // Check if already completed
    if (state.user.completedCivicActions.includes(actionId)) {
      return state;
    }
    
    // Find the civic action
    const action = state.signs.find(sign => 
      sign.category === 'civic' && sign.civicAction && sign.id === actionId
    )?.civicAction;
    
    // Also track as a task
    const { trackCivicActionAsTask } = get();
    trackCivicActionAsTask(actionId);
    
    return {
      user: {
        ...state.user,
        completedCivicActions: [...state.user.completedCivicActions, actionId],
        civicStreak: state.user.civicStreak + 1,
        lastCivicAction: new Date(),
        ...updateUserWithRewards(state.user, { experience: 200, civicScore: 100 })
      }
    };
  }),
  
  trackCivicActionAsTask: (actionId) => set((state) => {
    if (!state.user) return state;
    
    const action = civicActions.find(a => a.id === actionId);
    if (!action) return state;
    
    const taskId = `civic-${actionId}-${state.user.id}`;
    
    // Create a task for this civic action
    const task: TaskItem = {
      id: taskId,
      title: action.title,
      description: action.description,
      category: 'civic',
      difficulty: 'medium',
      estimatedTime: '1-2 hours',
      rewards: {
        experience: 200,
        civicScore: 100
      },
      verificationMethod: 'photo',
      verificationPrompt: 'Take a photo showing your participation in this civic action',
      isCompleted: true, // Mark as completed since the action was completed
      createdAt: new Date(),
      tags: ['civic', 'community', 'impact'],
      priority: 'high'
    };
    
    // Add to completed tasks
    return {
      user: {
        ...state.user,
        completedTasks: [...(state.user.completedTasks || []), taskId],
        taskVerificationData: {
          ...(state.user.taskVerificationData || {}),
          [taskId]: {
            completedAt: new Date()
          }
        }
      }
    };
  }),
  
  unlockAchievement: (achievementId) => set((state) => {
    if (!state.user) return state;
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || state.user.achievements.some(a => a.id === achievementId)) return state;
    
    return {
      user: {
        ...state.user,
        achievements: [...state.user.achievements, {
          ...achievement,
          unlockedAt: new Date(),
          progress: achievement.requirements.target
        }],
        ...updateUserWithRewards(state.user, {
          experience: achievement.reward.experience,
          civicScore: achievement.reward.civicScore
        })
      }
    };
  }),
  
  startLifeAchievement: (achievementId) => set((state) => {
    console.log('=== startLifeAchievement called ===');
    console.log('Achievement ID:', achievementId);
    console.log('Current state:', state);
    console.log('User exists:', !!state.user);
    
    if (!state.user) {
      console.log('No user found, returning state unchanged');
      return state;
    }
    
    // Check if already in progress or completed
    if (
      state.user.currentLifeAchievements?.includes(achievementId) ||
      state.user.completedLifeAchievements?.includes(achievementId)
    ) {
      console.log('Achievement already in progress or completed, returning state unchanged');
      return state;
    }
    
    // Check if we've reached the maximum number of achievements
    if (state.user.currentLifeAchievements?.length >= 15) {
      console.log('Maximum achievements reached, returning state unchanged');
      return state;
    }
    
    console.log('Generating tasks for achievement...');
    
    // Generate tasks for this achievement
    const tasks = generateTasksForAchievement(achievementId, state.user.id);
    const taskIds = tasks.map(task => task.id);
    
    // Add tasks to current tasks
    const currentTasks = [...(state.user.currentTasks || []), ...taskIds];
    
    // Create achievement start date
    const achievementStartDates = {
      ...(state.user.achievementStartDates || {}),
      [achievementId]: new Date()
    };
    
    // Create a task list for this achievement
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    const taskList: TaskList = {
      id: `achievement-${achievementId}-${Date.now()}`,
      name: achievement?.name || 'Achievement Tasks',
      description: achievement?.description || 'Tasks for this achievement',
      category: 'achievement',
      tasks: tasks,
      progress: 0,
      isCompleted: false,
      createdAt: new Date()
    };
    
    // Add the new achievement to currentLifeAchievements
    const updatedCurrentAchievements = [...(state.user.currentLifeAchievements || []), achievementId];
    
    console.log(`Starting achievement: ${achievementId}`, {
      tasks: taskIds,
      currentTasks: currentTasks.length,
      achievement: achievement?.name,
      updatedCurrentAchievements
    });
    
    const newState = {
      user: {
        ...state.user,
        ...updateUserWithRewards(state.user, { experience: 50 }),
        currentLifeAchievements: updatedCurrentAchievements,
        achievementStartDates,
        lastAchievementStartDate: new Date(),
        currentTasks,
        taskLists: [...(state.user.taskLists || []), taskList]
      }
    };
    
    console.log('New state:', newState);
    console.log('New state user:', newState.user);
    console.log('New state currentLifeAchievements:', newState.user.currentLifeAchievements);
    return newState;
  }),
  
  removeLifeAchievement: (achievementId) => set((state) => {
    if (!state.user) return state;
    
    // Check if achievement is in progress
    if (!state.user.currentLifeAchievements?.includes(achievementId)) {
      return state;
    }
    
    // Get tasks for this achievement
    const tasks = generateTasksForAchievement(achievementId, state.user.id);
    const taskIds = tasks.map(task => task.id);
    
    // Remove tasks from current tasks
    const newCurrentTasks = (state.user.currentTasks || []).filter(
      taskId => !taskIds.includes(taskId)
    );
    
    // Remove task list for this achievement
    const newTaskLists = (state.user.taskLists || []).filter(
      list => !list.id.includes(`achievement-${achievementId}`)
    );
    
    // Calculate experience penalty (half of current level)
    const experiencePenalty = Math.floor(state.user.avatar.experience * 0.5);
    const newExperience = Math.max(0, state.user.avatar.experience - experiencePenalty);
    const newLevel = Math.floor(newExperience / 1000) + 1;
    
    return {
      user: {
        ...state.user,
        currentLifeAchievements: state.user.currentLifeAchievements.filter(id => id !== achievementId),
        currentTasks: newCurrentTasks,
        taskLists: newTaskLists,
        avatar: {
          ...state.user.avatar,
          experience: newExperience,
          level: newLevel
        }
      }
    };
  }),
  
  completeLifeAchievement: (achievementId) => set((state) => {
    if (!state.user) return state;
    
    // Check if already completed
    if (state.user.completedLifeAchievements?.includes(achievementId)) {
      return state;
    }
    
    // Find the achievement to get its rewards
    const achievement = lifeAchievements.find(a => a.id === achievementId);
    if (!achievement) return state;
    
    // Mark all related tasks as completed
    const achievementTasks = generateTasksForAchievement(achievementId, state.user.id);
    const taskIds = achievementTasks.map(task => task.id);
    const newCompletedTasks = [...(state.user.completedTasks || [])];
    
    // Add any uncompleted tasks to completed tasks
    taskIds.forEach(taskId => {
      if (!newCompletedTasks.includes(taskId)) {
        newCompletedTasks.push(taskId);
      }
    });
    
    // Remove tasks from current tasks
    const newCurrentTasks = (state.user.currentTasks || []).filter(
      taskId => !taskIds.includes(taskId)
    );
    
    return {
      user: {
        ...state.user,
        completedLifeAchievements: [...(state.user.completedLifeAchievements || []), achievementId],
        currentLifeAchievements: (state.user.currentLifeAchievements || []).filter(id => id !== achievementId),
        lastAchievementCompletionDate: new Date(),
        completedTasks: newCompletedTasks,
        currentTasks: newCurrentTasks,
        ...updateUserWithRewards(state.user, { 
          experience: achievement.rewards.experience || 500, 
          lifeScore: achievement.rewards.lifeScore || 100,
          healthScore: achievement.rewards.healthScore || 0,
          careerScore: achievement.rewards.careerScore || 0
        })
      }
    };
  }),
  
  completeTask: (taskId: string, verificationData?: any) => set((state) => {
    if (!state.user) return state;
    
    // Check if already completed
    if (state.user.completedTasks?.includes(taskId)) {
      console.log('Task already completed:', taskId);
      return state;
    }
    
    console.log('Completing task:', taskId);
    
    // Find the task to get its rewards
    let taskRewards = { experience: 50, civicScore: 0, healthScore: 0, careerScore: 0, lifeScore: 0 };
    
    // Look through all task lists to find this task
    state.user.taskLists?.forEach(list => {
      const task = list.tasks.find(t => t.id === taskId);
      if (task) {
        taskRewards = {
          experience: task.rewards.experience || 50,
          civicScore: task.rewards.civicScore || 0,
          healthScore: task.rewards.healthScore || 0,
          careerScore: task.rewards.careerScore || 0,
          lifeScore: task.rewards.lifeScore || 0
        };
      }
    });
    
    // Also check achievement tasks
    if (state.user.currentLifeAchievements) {
      state.user.currentLifeAchievements.forEach(achievementId => {
        const tasks = generateTasksForAchievement(achievementId, state.user.id);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          taskRewards = {
            experience: task.rewards.experience || 50,
            civicScore: task.rewards.civicScore || 0,
            healthScore: task.rewards.healthScore || 0,
            careerScore: task.rewards.careerScore || 0,
            lifeScore: task.rewards.lifeScore || 0
          };
        }
      });
    }
    
    // Update task lists progress and mark individual tasks as completed
    const updatedTaskLists = (state.user.taskLists || []).map(list => {
      const taskIndex = list.tasks.findIndex(t => t.id === taskId);
      if (taskIndex >= 0) {
        // Mark the specific task as completed
        const updatedTasks = list.tasks.map(task => 
          task.id === taskId 
            ? { ...task, isCompleted: true, completedAt: new Date() }
            : task
        );
        
        // Calculate progress including the newly completed task
        const completedCount = updatedTasks.filter(t => 
          t.isCompleted || state.user?.completedTasks?.includes(t.id) || t.id === taskId
        ).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        
        return {
          ...list,
          tasks: updatedTasks,
          progress
        };
      }
      return list;
    });
    
    // Check if any achievements can be completed
    const { completeLifeAchievement } = get();
    
    // Check if this task completion completes an achievement
    const updatedUser = {
        ...state.user,
      ...updateUserWithRewards(state.user, taskRewards),
        completedTasks: [...(state.user.completedTasks || []), taskId],
        taskLists: updatedTaskLists,
        lastTaskCompletionDate: new Date(),
        taskVerificationData: {
          ...(state.user.taskVerificationData || {}),
          [taskId]: {
            completedAt: new Date(),
            verificationData
          }
      }
    };
    
    const achievementToComplete = state.user.currentLifeAchievements?.find(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      const currentTasks = tasks.filter(task => 
        updatedUser.currentTasks?.includes(task.id)
      );
      const completedTasks = currentTasks.filter(task => 
        updatedUser.completedTasks?.includes(task.id) || task.isCompleted
      );
      
      // Check if all tasks are completed
      const allTasksCompleted = currentTasks.length > 0 && completedTasks.length === currentTasks.length;
      
      if (allTasksCompleted) {
        // Check time requirements
        const achievement = lifeAchievements.find(a => a.id === achievementId);
        if (!achievement) return false;
        
        const startDate = updatedUser.achievementStartDates?.[achievementId];
        if (!startDate) return false;
        
        const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        
        // Minimum days required based on difficulty
        const minDays = {
          'easy': 1,
          'medium': 3,
          'hard': 7,
          'legendary': 14
        };
        
        return daysSinceStart >= minDays[achievement.difficulty];
      }
      
      return false;
    });
    
    // Complete achievement if ready
    if (achievementToComplete) {
      setTimeout(() => {
        completeLifeAchievement(achievementToComplete);
        console.log('Achievement completed automatically:', achievementToComplete);
      }, 1000);
    }
    
    console.log('Task completed successfully:', taskId);
    console.log('Updated completed tasks:', updatedUser.completedTasks);
    console.log('Previous completed tasks:', state.user.completedTasks);
    console.log('Task ID being added:', taskId);
    console.log('New completed tasks array:', [...(state.user.completedTasks || []), taskId]);
    
    // Debug the user state
    console.log('=== User State Debug ===');
    console.log('Original user completedTasks:', state.user.completedTasks);
    console.log('Original user completedTasks length:', state.user.completedTasks?.length);
    console.log('Updated user completedTasks:', updatedUser.completedTasks);
    console.log('Updated user completedTasks length:', updatedUser.completedTasks?.length);
    console.log('Updated user object keys:', Object.keys(updatedUser));
    console.log('Updated user has completedTasks property:', 'completedTasks' in updatedUser);
    
    return {
      user: updatedUser
    };
  }),
  
  addTaskList: (taskList) => set((state) => {
    if (!state.user) return state;
    
    // Add task IDs to current tasks
    const currentTasks = [
      ...(state.user.currentTasks || []),
      ...taskList.tasks.map(task => task.id)
    ];
    
    return {
      user: {
        ...state.user,
        taskLists: [...(state.user.taskLists || []), taskList],
        currentTasks
      }
    };
  }),
  
  generateDailyTasks: () => set((state) => {
    if (!state.user) return state;
    
    // Generate daily tasks
    const dailyTasks = generateTasksForPeriod('daily', state.user.id);
    
    // Add to current tasks
    const currentTasks = [
      ...(state.user.currentTasks || []),
      ...dailyTasks.map(task => task.id)
    ];
    
    // Create task list
    const taskList: TaskList = {
      id: `daily-${Date.now()}`,
      name: 'Daily Tasks',
      description: `Daily tasks for ${new Date().toLocaleDateString()}`,
      category: 'daily',
      tasks: dailyTasks,
      progress: 0,
      isCompleted: false,
      createdAt: new Date()
    };
    
    return {
      user: {
        ...state.user,
        taskLists: [...(state.user.taskLists || []), taskList],
        currentTasks
      }
    };
  }),
  
  generateWeeklyTasks: () => set((state) => {
    if (!state.user) return state;
    
    // Generate weekly tasks
    const weeklyTasks = generateTasksForPeriod('weekly', state.user.id);
    
    // Add to current tasks
    const currentTasks = [
      ...(state.user.currentTasks || []),
      ...weeklyTasks.map(task => task.id)
    ];
    
    // Create task list
    const taskList: TaskList = {
      id: `weekly-${Date.now()}`,
      name: 'Weekly Tasks',
      description: `Weekly tasks for ${new Date().toLocaleDateString()}`,
      category: 'weekly',
      tasks: weeklyTasks,
      progress: 0,
      isCompleted: false,
      createdAt: new Date()
    };
    
    return {
      user: {
        ...state.user,
        taskLists: [...(state.user.taskLists || []), taskList],
        currentTasks
      }
    };
  }),
  
  syncTasksWithAchievements: () => set((state) => {
    if (!state.user) return state;
    
    const { completeLifeAchievement } = get();
    const achievementsToComplete: string[] = [];
    let updatedCurrentTasks = [...(state.user.currentTasks || [])];
    let updatedTaskLists = [...(state.user.taskLists || [])];
    let hasChanges = false;
    
    // Check each in-progress achievement
    (state.user.currentLifeAchievements || []).forEach(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      
      // Ensure all achievement tasks are in currentTasks
      tasks.forEach(task => {
        if (!updatedCurrentTasks.includes(task.id)) {
          updatedCurrentTasks.push(task.id);
          hasChanges = true;
        }
      });
      
      // Ensure task list exists for this achievement
      const existingTaskList = updatedTaskLists.find(list => 
        list.id.includes(`achievement-${achievementId}`)
      );
      
      if (!existingTaskList) {
        const achievement = lifeAchievements.find(a => a.id === achievementId);
        const taskList: TaskList = {
          id: `achievement-${achievementId}-${Date.now()}`,
          name: achievement?.name || 'Achievement Tasks',
          description: achievement?.description || 'Tasks for this achievement',
          category: 'achievement',
          tasks: tasks,
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        };
        updatedTaskLists.push(taskList);
        hasChanges = true;
      }
      
      // Check if all tasks are completed
      const allTasksCompleted = tasks.every(task => 
        state.user?.completedTasks?.includes(task.id)
      );
      
      if (allTasksCompleted) {
        // Check time requirements
        const achievement = lifeAchievements.find(a => a.id === achievementId);
        if (!achievement) return;
        
        const startDate = state.user.achievementStartDates?.[achievementId];
        if (!startDate) return;
        
        const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        
        // Minimum days required based on difficulty
        const minDays = {
          'easy': 1,
          'medium': 3,
          'hard': 7,
          'legendary': 14
        };
        
        if (daysSinceStart >= minDays[achievement.difficulty]) {
          achievementsToComplete.push(achievementId);
        }
      }
    });
    
    // Complete achievements that meet requirements
    achievementsToComplete.forEach(achievementId => {
      setTimeout(() => {
        completeLifeAchievement(achievementId);
      }, 100);
    });
    
    // Only update state if there are actual changes
    if (!hasChanges) {
    return state;
    }
    
    return {
      ...state,
      user: {
        ...state.user,
        currentTasks: updatedCurrentTasks,
        taskLists: updatedTaskLists,
        completedTasks: state.user.completedTasks // Preserve completed tasks
      }
    };
  }),
  
  completeOnboarding: (profileData) => set((state) => {
    const allPossibleFields = [
      'current_weight', 'target_weight', 'height', 'activity_level', 'fitness_goals',
      'current_role', 'salary_range', 'experience_years', 'skills', 'stress_level',
      'sleep_hours', 'entrepreneurship_interest', 'leadership_experience', 'health_conditions'
    ];
    
    const missingFields = allPossibleFields.filter(field => {
      const fieldMap: Record<string, () => boolean> = {
        current_weight: () => !profileData.healthProfile?.currentWeight,
        target_weight: () => !profileData.healthProfile?.targetWeight,
        height: () => !profileData.healthProfile?.height,
        activity_level: () => !profileData.healthProfile?.activityLevel,
        fitness_goals: () => !profileData.healthProfile?.fitnessGoals?.length,
        current_role: () => !profileData.careerProfile?.currentRole,
        salary_range: () => !profileData.careerProfile?.salaryRange,
        experience_years: () => !profileData.careerProfile?.experienceYears,
        skills: () => !profileData.careerProfile?.skills?.length,
        stress_level: () => !profileData.healthProfile?.stressLevel,
        sleep_hours: () => !profileData.healthProfile?.sleepHours,
        entrepreneurship_interest: () => !profileData.careerProfile?.entrepreneurshipInterest,
        leadership_experience: () => profileData.careerProfile?.leadershipExperience === undefined,
        health_conditions: () => !profileData.healthProfile?.healthConditions?.length
      };
      
      return fieldMap[field]?.() ?? true;
    });

    // Start with some initial achievements and tasks
    const initialAchievements = [
      'fitness-routine-start',
      'nutrition-basics',
      'stress-management'
    ];

    // Generate tasks for initial achievements
    const initialTasks: TaskItem[] = [];
    const userId = generateUserId();
    
    initialAchievements.forEach(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, userId);
      initialTasks.push(...tasks);
    });

    // Generate daily and weekly tasks
    const dailyTasks = generateTasksForPeriod('daily', userId);
    const weeklyTasks = generateTasksForPeriod('weekly', userId);

    // Combine all tasks
    const allTasks = [...initialTasks, ...dailyTasks, ...weeklyTasks];

    const newUser: UserProfile = {
      id: userId,
      email: `${profileData.username || 'user'}@civil.app`,
      username: profileData.username || 'CivilUser',
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - (profileData.currentAge || 25))),
      currentAge: profileData.currentAge || 25,
      isVerified: false,
      avatar: {
        id: 'avatar-' + Date.now(),
        name: 'Life Explorer',
        level: 1,
        experience: 0,
        civicScore: 0,
        lifeScore: 0,
        healthScore: 0,
        careerScore: 0,
        customization: {
          hat: 'cap-blue',
          shirt: 'shirt-red',
          pants: 'pants-dark',
          shoes: 'shoes-white',
          accessory: 'glasses',
          emoji: profileData.avatar?.customization?.emoji || '🌟',
          emojiId: profileData.avatar?.customization?.emojiId || 'star'
        }
      },
      personality: profileData.personality || {
        introvert_extrovert: 5,
        risk_tolerance: 5,
        creativity: 5,
        social_focus: 5
      },
      interests: profileData.interests || [],
      goals: profileData.goals || [],
      budget_range: profileData.budget_range || 'medium',
      time_availability: profileData.time_availability || 'moderate',
      location_type: profileData.location_type || 'urban',
      healthProfile: profileData.healthProfile || {
        activityLevel: 'moderate',
        fitnessGoals: [],
        dietaryRestrictions: [],
        healthConditions: [],
        stressLevel: 5
      },
      careerProfile: profileData.careerProfile || {
        careerGoals: [],
        skills: [],
        educationLevel: 'bachelors',
        entrepreneurshipInterest: 5,
        leadershipExperience: false
      },
      completedLifeAchievements: [],
      currentLifeAchievements: initialAchievements,
      aiRecommendedAchievements: [],
      achievementStartDates: initialAchievements.reduce((acc, id) => {
        acc[id] = new Date();
        return acc;
      }, {} as Record<string, Date>),
      taskLists: [
        {
          id: `daily-${Date.now()}`,
          name: 'Daily Tasks',
          description: `Daily tasks for ${new Date().toLocaleDateString()}`,
          category: 'daily',
          tasks: dailyTasks,
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        },
        {
          id: `weekly-${Date.now()}`,
          name: 'Weekly Tasks',
          description: `Weekly tasks for ${new Date().toLocaleDateString()}`,
          category: 'weekly',
          tasks: weeklyTasks,
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        },
        {
          id: `achievement-fitness-${Date.now()}`,
          name: 'Fitness Foundation',
          description: 'Tasks to establish a consistent workout routine',
          category: 'achievement',
          tasks: generateTasksForAchievement('fitness-routine-start', userId),
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        },
        {
          id: `achievement-nutrition-${Date.now()}`,
          name: 'Nutrition Foundation',
          description: 'Tasks to learn basic nutrition principles',
          category: 'achievement',
          tasks: generateTasksForAchievement('nutrition-basics', userId),
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        },
        {
          id: `achievement-stress-${Date.now()}`,
          name: 'Stress Management',
          description: 'Tasks to develop stress management techniques',
          category: 'achievement',
          tasks: generateTasksForAchievement('stress-management', userId),
          progress: 0,
          isCompleted: false,
          createdAt: new Date()
        }
      ],
      completedTasks: [],
      currentTasks: allTasks.map(task => task.id),
      taskVerificationData: {},
      missingDataFields: missingFields,
      dataCompleteness: Math.round(((allPossibleFields.length - missingFields.length) / allPossibleFields.length) * 100),
      createdSigns: [],
      likedSigns: [],
      completedCivicActions: [],
      achievements: [],
      civicStreak: 0,
      preferences: {
        enableDangerAlerts: true,
        enableGroupAlerts: true,
        enableRouteAlerts: true,
        enableCivicNotifications: true,
        enableLifeReminders: true,
        enableHealthTracking: true,
        enableCareerTracking: true,
        alertRadius: 200,
        selectedTheme: themes[0]
      }
    };
    
    return { 
      user: newUser,
      showOnboarding: false
    };
  }),

  // Debug function to help troubleshoot task synchronization
  debugTaskSync: () => {
    const state = get();
    if (!state.user) {
      console.log('No user found');
      return;
    }
    
    console.log('=== Task Sync Debug ===');
    console.log('Current Life Achievements:', state.user.currentLifeAchievements);
    console.log('Current Tasks:', state.user.currentTasks);
    console.log('Completed Tasks:', state.user.completedTasks);
    console.log('Task Lists:', state.user.taskLists?.map(list => ({
      id: list.id,
      name: list.name,
      taskCount: list.tasks.length,
      taskIds: list.tasks.map(t => t.id)
    })));
    
    // Check each achievement
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      const currentAchievementTasks = tasks.filter(task => 
        state.user?.currentTasks?.includes(task.id)
      );
      console.log(`Achievement ${achievementId}:`, {
        totalTasks: tasks.length,
        currentTasks: currentAchievementTasks.length,
        taskIds: currentAchievementTasks.map(t => t.id)
      });
    });
  },

  // Enhanced task tracking system
  getCurrentTasks: () => {
    const state = get();
    if (!state.user) return [];
    
    const allTasks: TaskItem[] = [];
    
    // Get tasks from task lists
    state.user.taskLists?.forEach(list => {
      allTasks.push(...list.tasks);
    });
    
    // Get tasks from current achievements
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      allTasks.push(...tasks);
    });
    
    // Filter to only current tasks
    return allTasks.filter(task => 
      state.user?.currentTasks?.includes(task.id)
    );
  },

  // Get tasks for a specific achievement
  getTasksForAchievement: (achievementId: string) => {
    const state = get();
    if (!state.user) return [];
    
    const tasks = generateTasksForAchievement(achievementId, state.user.id);
    return tasks.filter(task => 
      state.user?.currentTasks?.includes(task.id)
    );
  },

  // Get achievement progress
  getAchievementProgress: (achievementId: string) => {
    const state = get();
    if (!state.user) return { progress: 0, completedTasks: 0, totalTasks: 0 };
    
    const tasks = generateTasksForAchievement(achievementId, state.user.id);
    const currentTasks = tasks.filter(task => 
      state.user?.currentTasks?.includes(task.id)
    );
    
    const completedTasks = currentTasks.filter(task => 
      state.user?.completedTasks?.includes(task.id) || task.isCompleted
    );
    
    return {
      progress: currentTasks.length > 0 ? Math.round((completedTasks.length / currentTasks.length) * 100) : 0,
      completedTasks: completedTasks.length,
      totalTasks: currentTasks.length
    };
  },

  // Debug function to show current state
  debugCurrentState: () => {
    const state = get();
    if (!state.user) {
      console.log('No user found');
      return;
    }
    
    console.log('=== Current User State ===');
    console.log('Current Life Achievements:', state.user.currentLifeAchievements);
    console.log('Current Tasks Count:', state.user.currentTasks?.length || 0);
    console.log('Completed Tasks Count:', state.user.completedTasks?.length || 0);
    console.log('Task Lists Count:', state.user.taskLists?.length || 0);
    
    // Show each achievement and its tasks
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const achievement = lifeAchievements.find(a => a.id === achievementId);
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      const currentTasks = tasks.filter(task => 
        state.user?.currentTasks?.includes(task.id)
      );
      const completedTasks = currentTasks.filter(task => 
        state.user?.completedTasks?.includes(task.id) || task.isCompleted
      );
      
      console.log(`Achievement: ${achievement?.name} (${achievementId})`, {
        totalTasks: tasks.length,
        currentTasks: currentTasks.length,
        completedTasks: completedTasks.length,
        progress: currentTasks.length > 0 ? Math.round((completedTasks.length / currentTasks.length) * 100) : 0,
        taskIds: currentTasks.map(t => t.id)
      });
    });
  },

  // Get next incomplete task for a specific achievement
  getNextTaskForAchievement: (achievementId: string) => {
    const state = get();
    if (!state.user) return null;
    
    const tasks = generateTasksForAchievement(achievementId, state.user.id);
    const currentTasks = tasks.filter(task => 
      state.user?.currentTasks?.includes(task.id)
    );
    
    // Find the first incomplete task
    const nextTask = currentTasks.find(task => 
      !state.user?.completedTasks?.includes(task.id) && !task.isCompleted
    );
    
    return nextTask || null;
  },

  // Get next tasks for all achievements in progress
  getNextTasksForAchievements: () => {
    const state = get();
    if (!state.user) return [];
    
    const nextTasks: TaskItem[] = [];
    
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const nextTask = get().getNextTaskForAchievement(achievementId);
      if (nextTask) {
        nextTasks.push(nextTask);
      }
    });
    
    return nextTasks;
  },

  // Debug function to verify task ID consistency
  debugTaskIdConsistency: () => {
    const state = get();
    if (!state.user) {
      console.log('No user found');
      return;
    }
    
    console.log('=== Task ID Consistency Debug ===');
    console.log('User ID:', state.user.id);
    
    // Test task generation for each achievement
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const tasks1 = generateTasksForAchievement(achievementId, state.user.id);
      const tasks2 = generateTasksForAchievement(achievementId, state.user.id);
      
      console.log(`Achievement: ${achievementId}`);
      console.log('Task IDs from first generation:', tasks1.map(t => t.id));
      console.log('Task IDs from second generation:', tasks2.map(t => t.id));
      console.log('IDs match:', tasks1.map(t => t.id).every((id, i) => id === tasks2[i]?.id));
      console.log('---');
    });
  },

  // Migrate existing task IDs to new deterministic format
  migrateTaskIds: () => set((state) => {
    if (!state.user) return state;
    
    console.log('=== Migrating Task IDs ===');
    console.log('Current tasks before migration:', state.user.currentTasks);
    console.log('Completed tasks before migration:', state.user.completedTasks);
    
    // Generate new task IDs for all current achievements
    const newTaskIds: string[] = [];
    const newCompletedTasks: string[] = [];
    
    state.user.currentLifeAchievements?.forEach(achievementId => {
      const tasks = generateTasksForAchievement(achievementId, state.user.id);
      newTaskIds.push(...tasks.map(t => t.id));
      
      // Check if any of these tasks were completed (by matching achievement and task type)
      tasks.forEach(newTask => {
        const wasCompleted = state.user?.completedTasks?.some(oldTaskId => {
          // Extract achievement and task type from old ID
          const oldParts = oldTaskId.split('-');
          const newParts = newTask.id.split('-');
          
          // Match by achievement ID and task type (e.g., "research", "plan", "execute")
          return oldParts[0] === newParts[0] && oldParts[1] === newParts[1];
        });
        
        if (wasCompleted) {
          newCompletedTasks.push(newTask.id);
        }
      });
    });
    
    // Update task lists with new task IDs
    const updatedTaskLists = (state.user.taskLists || []).map(list => {
      if (list.category === 'achievement') {
        // For achievement task lists, regenerate tasks with new IDs
        const achievementId = list.id.replace('achievement-', '').split('-')[0];
        const newTasks = generateTasksForAchievement(achievementId, state.user.id);
        
        return {
          ...list,
          tasks: newTasks
        };
      }
      return list;
    });
    
    console.log('New task IDs:', newTaskIds);
    console.log('New completed tasks:', newCompletedTasks);
    
    return {
      user: {
        ...state.user,
        currentTasks: newTaskIds,
        completedTasks: newCompletedTasks,
        taskLists: updatedTaskLists
      }
    };
  }),

  grantExpForSign: (signId: string, exp: number) => {
    const state = get();
    if (!state.user) return false;
    const foundSigns = state.user.foundSigns ?? [];
    if (foundSigns.includes(signId)) return false;
    const updatedUser = {
      ...state.user,
      foundSigns: [...foundSigns, signId],
      avatar: {
        ...state.user.avatar,
        experience: state.user.avatar.experience + exp
      }
    };
    return set({ user: updatedUser }) && true;
  },
}));