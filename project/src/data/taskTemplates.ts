import { TaskItem } from '../types';
import { lifeAchievements } from './lifeAchievements';

// Create a simple hash function for deterministic task IDs
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate tasks for a specific achievement
export const generateTasksForAchievement = (achievementId: string, userId: string): TaskItem[] => {
  const achievement = lifeAchievements.find(a => a.id === achievementId);
  if (!achievement) return [];
  
  const now = new Date();
  const tasks: TaskItem[] = [];
  
  // Create a deterministic suffix based on achievement and user
  const suffix = simpleHash(`${achievementId}-${userId}`).toString().slice(-4);
  
  // Common task patterns based on achievement difficulty
  switch (achievement.difficulty) {
    case 'easy':
      // Easy achievements typically have 3-4 simple tasks
      tasks.push(
        {
          id: `${achievementId}-research-${userId}-${suffix}`,
          title: `Research: ${achievement.name}`,
          description: `Learn about the requirements and best practices for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'easy',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 50,
            lifeScore: 25
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you have researched this achievement',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['research', 'planning', achievement.category],
          priority: 'medium'
        },
        {
          id: `${achievementId}-plan-${userId}-${suffix}`,
          title: `Plan: ${achievement.name}`,
          description: `Create a plan to complete the ${achievement.name} achievement`,
          category: 'achievement',
          difficulty: 'easy',
          estimatedTime: '1 hour',
          rewards: {
            experience: 75,
            lifeScore: 50
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your written or digital plan',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['planning', 'organization', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-execute-${userId}-${suffix}`,
          title: `Execute: ${achievement.name}`,
          description: `Complete the main activity for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 150,
            lifeScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your completion of this activity',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'action', achievement.category],
          priority: 'high'
        }
      );
      break;
      
    case 'medium':
      // Medium achievements typically have 5-6 more involved tasks
      tasks.push(
        {
          id: `${achievementId}-research-${userId}-${suffix}`,
          title: `Research: ${achievement.name}`,
          description: `Learn about the requirements and best practices for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'easy',
          estimatedTime: '1 hour',
          rewards: {
            experience: 75,
            lifeScore: 50
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you have researched this achievement',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['research', 'planning', achievement.category],
          priority: 'medium'
        },
        {
          id: `${achievementId}-plan-${userId}-${suffix}`,
          title: `Plan: ${achievement.name}`,
          description: `Create a detailed plan to complete the ${achievement.name} achievement`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 100,
            lifeScore: 75
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your written or digital plan',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['planning', 'organization', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-prepare-${userId}-${suffix}`,
          title: `Prepare: ${achievement.name}`,
          description: `Gather resources and prepare for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '3 hours',
          rewards: {
            experience: 125,
            lifeScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your preparation',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['preparation', 'resources', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-execute-1-${userId}-${suffix}`,
          title: `Execute Part 1: ${achievement.name}`,
          description: `Complete the first major step for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '4 hours',
          rewards: {
            experience: 150,
            lifeScore: 125
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your progress on this activity',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'action', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-execute-2-${userId}-${suffix}`,
          title: `Execute Part 2: ${achievement.name}`,
          description: `Complete the second major step for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '4 hours',
          rewards: {
            experience: 200,
            lifeScore: 150
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your completion of this activity',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'action', achievement.category],
          priority: 'high'
        }
      );
      break;
      
    case 'hard':
      // Hard achievements typically have 7-8 complex tasks
      tasks.push(
        {
          id: `${achievementId}-research-${userId}-${suffix}`,
          title: `Research: ${achievement.name}`,
          description: `Conduct thorough research on ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 100,
            lifeScore: 75
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you have researched this achievement',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['research', 'planning', achievement.category],
          priority: 'medium'
        },
        {
          id: `${achievementId}-plan-${userId}-${suffix}`,
          title: `Strategic Plan: ${achievement.name}`,
          description: `Create a comprehensive strategic plan for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '3 hours',
          rewards: {
            experience: 150,
            lifeScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your detailed plan',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['planning', 'strategy', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-resources-${userId}-${suffix}`,
          title: `Resource Gathering: ${achievement.name}`,
          description: `Gather all necessary resources for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '4 hours',
          rewards: {
            experience: 175,
            lifeScore: 125
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your gathered resources',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['preparation', 'resources', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-milestone-1-${userId}-${suffix}`,
          title: `Milestone 1: ${achievement.name}`,
          description: `Complete the first major milestone for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '5 hours',
          rewards: {
            experience: 200,
            lifeScore: 150
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this milestone',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-milestone-2-${userId}-${suffix}`,
          title: `Milestone 2: ${achievement.name}`,
          description: `Complete the second major milestone for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '6 hours',
          rewards: {
            experience: 250,
            lifeScore: 175
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this milestone',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-milestone-3-${userId}-${suffix}`,
          title: `Milestone 3: ${achievement.name}`,
          description: `Complete the third major milestone for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '6 hours',
          rewards: {
            experience: 300,
            lifeScore: 200
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this milestone',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-final-${userId}-${suffix}`,
          title: `Final Challenge: ${achievement.name}`,
          description: `Complete the final challenge for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '8 hours',
          rewards: {
            experience: 400,
            lifeScore: 300
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your final completion',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'completion', achievement.category],
          priority: 'urgent'
        }
      );
      break;
      
    case 'legendary':
      // Legendary achievements typically have 10+ epic tasks
      tasks.push(
        {
          id: `${achievementId}-research-${userId}-${suffix}`,
          title: `Deep Research: ${achievement.name}`,
          description: `Conduct extensive research on ${achievement.name}`,
          category: 'achievement',
          difficulty: 'medium',
          estimatedTime: '4 hours',
          rewards: {
            experience: 150,
            lifeScore: 100
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you have researched this achievement',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['research', 'planning', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-master-plan-${userId}-${suffix}`,
          title: `Master Plan: ${achievement.name}`,
          description: `Create a comprehensive master plan for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '6 hours',
          rewards: {
            experience: 200,
            lifeScore: 150
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your master plan',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['planning', 'strategy', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-resources-${userId}-${suffix}`,
          title: `Resource Mastery: ${achievement.name}`,
          description: `Gather and organize all resources for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '8 hours',
          rewards: {
            experience: 250,
            lifeScore: 200
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your organized resources',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['preparation', 'resources', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-phase-1-${userId}-${suffix}`,
          title: `Phase 1: ${achievement.name}`,
          description: `Complete the first phase of ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '10 hours',
          rewards: {
            experience: 300,
            lifeScore: 250
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this phase',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-phase-2-${userId}-${suffix}`,
          title: `Phase 2: ${achievement.name}`,
          description: `Complete the second phase of ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '12 hours',
          rewards: {
            experience: 350,
            lifeScore: 300
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this phase',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-phase-3-${userId}-${suffix}`,
          title: `Phase 3: ${achievement.name}`,
          description: `Complete the third phase of ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '15 hours',
          rewards: {
            experience: 400,
            lifeScore: 350
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing completion of this phase',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['execution', 'milestone', achievement.category],
          priority: 'high'
        },
        {
          id: `${achievementId}-challenge-1-${userId}-${suffix}`,
          title: `Epic Challenge 1: ${achievement.name}`,
          description: `Overcome the first epic challenge for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '10 hours',
          rewards: {
            experience: 450,
            lifeScore: 400
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing you overcoming this challenge',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['challenge', 'milestone', achievement.category],
          priority: 'urgent'
        },
        {
          id: `${achievementId}-challenge-2-${userId}-${suffix}`,
          title: `Epic Challenge 2: ${achievement.name}`,
          description: `Overcome the second epic challenge for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '12 hours',
          rewards: {
            experience: 500,
            lifeScore: 450
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing you overcoming this challenge',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['challenge', 'milestone', achievement.category],
          priority: 'urgent'
        },
        {
          id: `${achievementId}-final-challenge-${userId}-${suffix}`,
          title: `Final Epic Challenge: ${achievement.name}`,
          description: `Overcome the final epic challenge for ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '15 hours',
          rewards: {
            experience: 600,
            lifeScore: 500
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your triumph over this challenge',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['challenge', 'completion', achievement.category],
          priority: 'urgent'
        },
        {
          id: `${achievementId}-mastery-${userId}-${suffix}`,
          title: `Mastery: ${achievement.name}`,
          description: `Demonstrate complete mastery of ${achievement.name}`,
          category: 'achievement',
          difficulty: 'hard',
          estimatedTime: '20 hours',
          rewards: {
            experience: 750,
            lifeScore: 600
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your mastery',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['mastery', 'completion', achievement.category],
          priority: 'urgent'
        }
      );
      break;
  }
  
  // Add category-specific tasks
  switch (achievement.category) {
    case 'health':
    case 'fitness':
    case 'nutrition':
      tasks.push(
        {
          id: `${achievementId}-health-track-${userId}-${suffix}`,
          title: `Track Health Metrics for ${achievement.name}`,
          description: `Record your health metrics related to ${achievement.name}`,
          category: 'health',
          difficulty: 'easy',
          estimatedTime: '15 minutes daily',
          rewards: {
            experience: 100,
            healthScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your health tracking',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['tracking', 'health', 'data'],
          priority: 'medium'
        }
      );
      break;
      
    case 'career':
    case 'entrepreneurship':
    case 'leadership':
      tasks.push(
        {
          id: `${achievementId}-career-document-${userId}-${suffix}`,
          title: `Document Career Progress for ${achievement.name}`,
          description: `Record your career progress related to ${achievement.name}`,
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 125,
            careerScore: 100
          },
          verificationMethod: 'document',
          verificationPrompt: 'Upload a document showing your career progress',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['documentation', 'career', 'professional'],
          priority: 'medium'
        }
      );
      break;
      
    case 'civic':
      tasks.push(
        {
          id: `${achievementId}-civic-impact-${userId}-${suffix}`,
          title: `Document Civic Impact for ${achievement.name}`,
          description: `Record the community impact of your work on ${achievement.name}`,
          category: 'civic',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 150,
            civicScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your civic impact',
          isCompleted: false,
          createdAt: now,
          linkedAchievementId: achievementId,
          tags: ['impact', 'civic', 'community'],
          priority: 'medium'
        }
      );
      break;
  }
  
  // Add reflection task for all achievements
  tasks.push(
    {
      id: `${achievementId}-reflect-${userId}-${suffix}`,
      title: `Reflect on ${achievement.name}`,
      description: `Take time to reflect on what you've learned and accomplished with ${achievement.name}`,
      category: 'achievement',
      difficulty: 'easy',
      estimatedTime: '30 minutes',
      rewards: {
        experience: 100,
        lifeScore: 75
      },
      verificationMethod: 'self_report',
      verificationPrompt: 'Confirm that you have reflected on this achievement',
      isCompleted: false,
      createdAt: now,
      linkedAchievementId: achievementId,
      tags: ['reflection', 'learning', 'personal-growth'],
      priority: 'low'
    }
  );
  
  return tasks;
};

// Generate tasks for a specific period (daily, weekly, monthly)
export const generateTasksForPeriod = (period: 'daily' | 'weekly' | 'monthly' | string, userId: string): TaskItem[] => {
  const now = new Date();
  const tasks: TaskItem[] = [];
  
  // Common task templates based on period
  switch (period) {
    case 'daily':
      tasks.push(
        {
          id: `daily-health-${userId}-${simpleHash(userId.toString())}`,
          title: 'Daily Health Check-in',
          description: 'Record your health metrics for the day',
          category: 'health',
          difficulty: 'easy',
          estimatedTime: '5 minutes',
          rewards: {
            experience: 50,
            healthScore: 25
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you have recorded your health metrics',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'tracking', 'daily'],
          priority: 'medium'
        },
        {
          id: `daily-steps-${userId}-${simpleHash(userId.toString())}`,
          title: 'Reach 8,000 Steps',
          description: 'Complete at least 8,000 steps today',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: 'Throughout the day',
          rewards: {
            experience: 75,
            healthScore: 50
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a screenshot of your step counter',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'fitness', 'daily'],
          priority: 'high'
        },
        {
          id: `daily-water-${userId}-${simpleHash(userId.toString())}`,
          title: 'Drink 8 Glasses of Water',
          description: 'Stay hydrated by drinking at least 8 glasses of water',
          category: 'health',
          difficulty: 'easy',
          estimatedTime: 'Throughout the day',
          rewards: {
            experience: 50,
            healthScore: 25
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you drank enough water today',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'hydration', 'daily'],
          priority: 'medium'
        },
        {
          id: `daily-career-${userId}-${simpleHash(userId.toString())}`,
          title: 'Career Development',
          description: 'Spend 30 minutes on career development',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 75,
            careerScore: 50
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you spent time on career development',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'development', 'daily'],
          priority: 'medium'
        },
        {
          id: `daily-mindfulness-${userId}-${simpleHash(userId.toString())}`,
          title: 'Mindfulness Practice',
          description: 'Practice mindfulness or meditation for 10 minutes',
          category: 'personal',
          difficulty: 'easy',
          estimatedTime: '10 minutes',
          rewards: {
            experience: 50,
            healthScore: 25
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you practiced mindfulness',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'mindfulness', 'daily'],
          priority: 'medium'
        }
      );
      break;
      
    case 'weekly':
      tasks.push(
        {
          id: `weekly-workout-${userId}-${simpleHash(userId.toString())}`,
          title: 'Complete 3 Workouts',
          description: 'Do at least 3 workouts this week',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: '3 hours',
          rewards: {
            experience: 150,
            healthScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo after your workout',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'fitness', 'weekly'],
          priority: 'high'
        },
        {
          id: `weekly-meal-prep-${userId}-${simpleHash(userId.toString())}`,
          title: 'Meal Prep for the Week',
          description: 'Prepare healthy meals for the upcoming week',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 125,
            healthScore: 75
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your meal prep',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'nutrition', 'weekly'],
          priority: 'medium'
        },
        {
          id: `weekly-networking-${userId}-${simpleHash(userId.toString())}`,
          title: 'Professional Networking',
          description: 'Connect with at least 2 professional contacts',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 100,
            careerScore: 75
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you connected with professional contacts',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'networking', 'weekly'],
          priority: 'medium'
        },
        {
          id: `weekly-skill-${userId}-${simpleHash(userId.toString())}`,
          title: 'Skill Development',
          description: 'Spend 2 hours developing a professional skill',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 125,
            careerScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your skill development',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'skills', 'weekly'],
          priority: 'high'
        },
        {
          id: `weekly-civic-${userId}-${simpleHash(userId.toString())}`,
          title: 'Civic Engagement',
          description: 'Participate in one civic action this week',
          category: 'civic',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 150,
            civicScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your civic engagement',
          isCompleted: false,
          createdAt: now,
          tags: ['civic', 'community', 'weekly'],
          priority: 'medium'
        },
        {
          id: `weekly-reflection-${userId}-${simpleHash(userId.toString())}`,
          title: 'Weekly Reflection',
          description: 'Reflect on your progress and set goals for next week',
          category: 'personal',
          difficulty: 'easy',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 75,
            lifeScore: 50
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you completed your weekly reflection',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'reflection', 'weekly'],
          priority: 'medium'
        }
      );
      break;
      
    case 'monthly':
      tasks.push(
        {
          id: `monthly-health-review-${userId}-${simpleHash(userId.toString())}`,
          title: 'Monthly Health Review',
          description: 'Review your health metrics and progress for the month',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 200,
            healthScore: 150
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your health review',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'review', 'monthly'],
          priority: 'high'
        },
        {
          id: `monthly-career-review-${userId}-${simpleHash(userId.toString())}`,
          title: 'Monthly Career Review',
          description: 'Review your career progress and set goals for next month',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 200,
            careerScore: 150
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you completed your career review',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'review', 'monthly'],
          priority: 'high'
        },
        {
          id: `monthly-civic-project-${userId}-${simpleHash(userId.toString())}`,
          title: 'Monthly Civic Project',
          description: 'Complete one significant civic project this month',
          category: 'civic',
          difficulty: 'hard',
          estimatedTime: '4 hours',
          rewards: {
            experience: 300,
            civicScore: 200
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your civic project',
          isCompleted: false,
          createdAt: now,
          tags: ['civic', 'project', 'monthly'],
          priority: 'high'
        },
        {
          id: `monthly-personal-goal-${userId}-${simpleHash(userId.toString())}`,
          title: 'Personal Development Goal',
          description: 'Complete one significant personal development goal',
          category: 'personal',
          difficulty: 'hard',
          estimatedTime: '5 hours',
          rewards: {
            experience: 250,
            lifeScore: 200
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your personal development',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'development', 'monthly'],
          priority: 'high'
        },
        {
          id: `monthly-financial-review-${userId}-${simpleHash(userId.toString())}`,
          title: 'Monthly Financial Review',
          description: 'Review your finances and update your budget',
          category: 'personal',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 200,
            lifeScore: 150
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you completed your financial review',
          isCompleted: false,
          createdAt: now,
          tags: ['financial', 'review', 'monthly'],
          priority: 'high'
        }
      );
      break;
      
    // Category-specific tasks
    case 'health':
      tasks.push(
        {
          id: `health-workout-${userId}-${simpleHash(userId.toString())}`,
          title: 'Complete a Workout',
          description: 'Do a full workout session',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 100,
            healthScore: 75
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo after your workout',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'fitness', 'workout'],
          priority: 'high'
        },
        {
          id: `health-nutrition-${userId}-${simpleHash(userId.toString())}`,
          title: 'Healthy Meal Preparation',
          description: 'Prepare a nutritious meal',
          category: 'health',
          difficulty: 'easy',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 75,
            healthScore: 50
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your healthy meal',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'nutrition', 'food'],
          priority: 'medium'
        },
        {
          id: `health-sleep-${userId}-${simpleHash(userId.toString())}`,
          title: 'Sleep Optimization',
          description: 'Implement sleep improvement techniques',
          category: 'health',
          difficulty: 'medium',
          estimatedTime: '8 hours',
          rewards: {
            experience: 100,
            healthScore: 75
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you optimized your sleep',
          isCompleted: false,
          createdAt: now,
          tags: ['health', 'sleep', 'recovery'],
          priority: 'medium'
        }
      );
      break;
      
    case 'career':
      tasks.push(
        {
          id: `career-skill-${userId}-${simpleHash(userId.toString())}`,
          title: 'Professional Skill Development',
          description: 'Spend time developing a key professional skill',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 125,
            careerScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your skill development',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'skills', 'development'],
          priority: 'high'
        },
        {
          id: `career-network-${userId}-${simpleHash(userId.toString())}`,
          title: 'Professional Networking',
          description: 'Connect with professional contacts',
          category: 'career',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 100,
            careerScore: 75
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you connected with professional contacts',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'networking', 'professional'],
          priority: 'medium'
        },
        {
          id: `career-project-${userId}-${simpleHash(userId.toString())}`,
          title: 'Career Project Advancement',
          description: 'Make progress on a significant career project',
          category: 'career',
          difficulty: 'hard',
          estimatedTime: '3 hours',
          rewards: {
            experience: 150,
            careerScore: 125
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your project progress',
          isCompleted: false,
          createdAt: now,
          tags: ['career', 'project', 'advancement'],
          priority: 'high'
        }
      );
      break;
      
    case 'civic':
      tasks.push(
        {
          id: `civic-volunteer-${userId}-${simpleHash(userId.toString())}`,
          title: 'Volunteer Service',
          description: 'Volunteer your time for a community cause',
          category: 'civic',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 150,
            civicScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your volunteer service',
          isCompleted: false,
          createdAt: now,
          tags: ['civic', 'volunteer', 'community'],
          priority: 'high'
        },
        {
          id: `civic-petition-${userId}-${simpleHash(userId.toString())}`,
          title: 'Sign or Create a Petition',
          description: 'Support or create a petition for a cause you believe in',
          category: 'civic',
          difficulty: 'easy',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 75,
            civicScore: 50
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a screenshot or photo of the petition',
          isCompleted: false,
          createdAt: now,
          tags: ['civic', 'petition', 'advocacy'],
          priority: 'medium'
        },
        {
          id: `civic-cleanup-${userId}-${simpleHash(userId.toString())}`,
          title: 'Community Cleanup',
          description: 'Participate in or organize a community cleanup',
          category: 'civic',
          difficulty: 'medium',
          estimatedTime: '2 hours',
          rewards: {
            experience: 125,
            civicScore: 100
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your cleanup activity',
          isCompleted: false,
          createdAt: now,
          tags: ['civic', 'cleanup', 'environmental'],
          priority: 'high'
        }
      );
      break;
      
    case 'personal':
      tasks.push(
        {
          id: `personal-learning-${userId}-${simpleHash(userId.toString())}`,
          title: 'Personal Learning',
          description: 'Spend time learning something new for personal growth',
          category: 'personal',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 100,
            lifeScore: 75
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo showing your learning activity',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'learning', 'growth'],
          priority: 'medium'
        },
        {
          id: `personal-creative-${userId}-${simpleHash(userId.toString())}`,
          title: 'Creative Expression',
          description: 'Engage in a creative activity',
          category: 'personal',
          difficulty: 'easy',
          estimatedTime: '1 hour',
          rewards: {
            experience: 75,
            lifeScore: 50
          },
          verificationMethod: 'photo',
          verificationPrompt: 'Take a photo of your creative work',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'creative', 'expression'],
          priority: 'medium'
        },
        {
          id: `personal-mindfulness-${userId}-${simpleHash(userId.toString())}`,
          title: 'Mindfulness Practice',
          description: 'Practice mindfulness or meditation',
          category: 'personal',
          difficulty: 'easy',
          estimatedTime: '20 minutes',
          rewards: {
            experience: 75,
            healthScore: 50,
            lifeScore: 25
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you practiced mindfulness',
          isCompleted: false,
          createdAt: now,
          tags: ['personal', 'mindfulness', 'mental-health'],
          priority: 'medium'
        },
        {
          id: `financial-budget-${userId}-${simpleHash(userId.toString())}`,
          title: 'Budget Review',
          description: 'Review and update your budget',
          category: 'personal',
          difficulty: 'medium',
          estimatedTime: '1 hour',
          rewards: {
            experience: 100,
            lifeScore: 75
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you reviewed your budget',
          isCompleted: false,
          createdAt: now,
          tags: ['financial', 'budget', 'planning'],
          priority: 'high'
        },
        {
          id: `financial-saving-${userId}-${simpleHash(userId.toString())}`,
          title: 'Savings Contribution',
          description: 'Make a contribution to your savings',
          category: 'personal',
          difficulty: 'medium',
          estimatedTime: '30 minutes',
          rewards: {
            experience: 125,
            lifeScore: 100
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you contributed to your savings',
          isCompleted: false,
          createdAt: now,
          tags: ['financial', 'savings', 'future'],
          priority: 'high'
        },
        {
          id: `financial-education-${userId}-${simpleHash(userId.toString())}`,
          title: 'Financial Education',
          description: 'Learn about a financial topic',
          category: 'personal',
          difficulty: 'easy',
          estimatedTime: '1 hour',
          rewards: {
            experience: 75,
            lifeScore: 50
          },
          verificationMethod: 'self_report',
          verificationPrompt: 'Confirm that you learned about a financial topic',
          isCompleted: false,
          createdAt: now,
          tags: ['financial', 'education', 'learning'],
          priority: 'medium'
        }
      );
      break;
  }
  
  return tasks;
};