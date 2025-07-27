import { Achievement } from '../types';

export const achievements: Achievement[] = [
  // Civic Engagement Achievements
  {
    id: 'first-cleanup',
    name: 'Community Cleaner',
    description: 'Complete your first park or street cleanup',
    icon: '🧹',
    rarity: 'bronze',
    category: 'civic',
    requirements: {
      type: 'count',
      target: 1,
      action: 'cleanup'
    },
    reward: {
      experience: 100,
      civicScore: 50,
      title: 'Neighborhood Helper'
    }
  },
  {
    id: 'petition-starter',
    name: 'Voice of Change',
    description: 'Submit your first petition to local government',
    icon: '📝',
    rarity: 'bronze',
    category: 'civic',
    requirements: {
      type: 'count',
      target: 1,
      action: 'petition'
    },
    reward: {
      experience: 150,
      civicScore: 75,
      title: 'Civic Advocate'
    }
  },
  {
    id: 'volunteer-hero',
    name: 'Volunteer Hero',
    description: 'Complete 5 volunteer activities',
    icon: '🦸',
    rarity: 'silver',
    category: 'civic',
    requirements: {
      type: 'count',
      target: 5,
      action: 'volunteer'
    },
    reward: {
      experience: 500,
      civicScore: 250,
      title: 'Community Champion'
    }
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Complete 10 environmental cleanup actions',
    icon: '🌱',
    rarity: 'gold',
    category: 'environmental',
    requirements: {
      type: 'count',
      target: 10,
      action: 'cleanup'
    },
    reward: {
      experience: 1000,
      civicScore: 500,
      title: 'Environmental Guardian',
      badge: 'eco-warrior'
    }
  },
  {
    id: 'civic-streak-7',
    name: 'Weekly Warrior',
    description: 'Complete civic actions for 7 consecutive days',
    icon: '🔥',
    rarity: 'silver',
    category: 'civic',
    requirements: {
      type: 'streak',
      target: 7,
      action: 'any_civic'
    },
    reward: {
      experience: 750,
      civicScore: 300,
      title: 'Dedicated Citizen'
    }
  },
  {
    id: 'donation-angel',
    name: 'Donation Angel',
    description: 'Make 3 charitable donations through the app',
    icon: '💝',
    rarity: 'gold',
    category: 'community',
    requirements: {
      type: 'count',
      target: 3,
      action: 'donation'
    },
    reward: {
      experience: 800,
      civicScore: 400,
      title: 'Generous Soul'
    }
  },
  {
    id: 'educator',
    name: 'Knowledge Sharer',
    description: 'Create 5 educational civic awareness posts',
    icon: '🎓',
    rarity: 'silver',
    category: 'community',
    requirements: {
      type: 'count',
      target: 5,
      action: 'education'
    },
    reward: {
      experience: 600,
      civicScore: 300,
      title: 'Community Educator'
    }
  },
  {
    id: 'civic-master',
    name: 'Civic Master',
    description: 'Reach 1000 civic score points',
    icon: '👑',
    rarity: 'platinum',
    category: 'civic',
    requirements: {
      type: 'milestone',
      target: 1000,
      action: 'civic_score'
    },
    reward: {
      experience: 2000,
      civicScore: 0,
      title: 'Civic Leader',
      badge: 'civic-master'
    }
  },
  {
    id: 'democracy-defender',
    name: 'Democracy Defender',
    description: 'Submit 10 petitions to government officials',
    icon: '🗳️',
    rarity: 'gold',
    category: 'civic',
    requirements: {
      type: 'count',
      target: 10,
      action: 'petition'
    },
    reward: {
      experience: 1500,
      civicScore: 750,
      title: 'Democracy Champion'
    }
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Complete 25 total civic actions',
    icon: '🏗️',
    rarity: 'diamond',
    category: 'community',
    requirements: {
      type: 'count',
      target: 25,
      action: 'any_civic'
    },
    reward: {
      experience: 3000,
      civicScore: 1000,
      title: 'Master Builder',
      badge: 'community-builder'
    }
  },
  // Explorer Achievements
  {
    id: 'first-sign',
    name: 'First Navigator',
    description: 'Create your first navigation point',
    icon: '📍',
    rarity: 'bronze',
    category: 'creator',
    requirements: {
      type: 'count',
      target: 1,
      action: 'create_sign'
    },
    reward: {
      experience: 50,
      civicScore: 25
    }
  },
  {
    id: 'explorer',
    name: 'City Explorer',
    description: 'Visit 20 different navigation points',
    icon: '🗺️',
    rarity: 'silver',
    category: 'explorer',
    requirements: {
      type: 'count',
      target: 20,
      action: 'visit_sign'
    },
    reward: {
      experience: 400,
      civicScore: 100,
      title: 'Urban Explorer'
    }
  },
  {
    id: 'social-connector',
    name: 'Social Connector',
    description: 'Like 50 navigation points',
    icon: '❤️',
    rarity: 'bronze',
    category: 'community',
    requirements: {
      type: 'count',
      target: 50,
      action: 'like_sign'
    },
    reward: {
      experience: 250,
      civicScore: 50,
      title: 'Community Supporter'
    }
  }
];

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter(achievement => achievement.category === category);
};

export const checkAchievementProgress = (achievement: Achievement, userStats: any): number => {
  const { requirements } = achievement;
  
  switch (requirements.action) {
    case 'cleanup':
      return userStats.cleanupCount || 0;
    case 'petition':
      return userStats.petitionCount || 0;
    case 'volunteer':
      return userStats.volunteerCount || 0;
    case 'donation':
      return userStats.donationCount || 0;
    case 'education':
      return userStats.educationCount || 0;
    case 'any_civic':
      return userStats.totalCivicActions || 0;
    case 'civic_score':
      return userStats.civicScore || 0;
    case 'create_sign':
      return userStats.createdSigns || 0;
    case 'visit_sign':
      return userStats.visitedSigns || 0;
    case 'like_sign':
      return userStats.likedSigns || 0;
    default:
      return 0;
  }
};