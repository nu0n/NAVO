export interface MessageTemplate {
  id: string;
  text: string;
  category: 'warning' | 'helpful' | 'encouragement' | 'direction' | 'discovery' | 'community' | 'achievement' | 'safety';
  icon: string;
  tone: 'neutral' | 'positive' | 'cautious' | 'urgent';
  context: string[]; // Where this message is appropriate
}

export const messageTemplates: MessageTemplate[] = [
  // Warning Messages
  {
    id: 'danger-ahead',
    text: 'Danger ahead, be careful',
    category: 'warning',
    icon: '⚠️',
    tone: 'cautious',
    context: ['danger', 'warning', 'route']
  },
  {
    id: 'avoid-area',
    text: 'Avoid this area',
    category: 'warning',
    icon: '🚫',
    tone: 'urgent',
    context: ['danger', 'warning']
  },
  {
    id: 'construction-zone',
    text: 'Construction zone - detour recommended',
    category: 'warning',
    icon: '🚧',
    tone: 'neutral',
    context: ['route', 'warning']
  },
  {
    id: 'slippery-when-wet',
    text: 'Slippery when wet',
    category: 'warning',
    icon: '💧',
    tone: 'cautious',
    context: ['danger', 'warning']
  },
  {
    id: 'high-crime-area',
    text: 'High crime area - stay alert',
    category: 'warning',
    icon: '🔒',
    tone: 'urgent',
    context: ['danger', 'safety']
  },

  // Helpful Messages
  {
    id: 'safe-route',
    text: 'Safe route this way',
    category: 'helpful',
    icon: '✅',
    tone: 'positive',
    context: ['safe', 'route', 'direction']
  },
  {
    id: 'shortcut-here',
    text: 'Shortcut available here',
    category: 'helpful',
    icon: '⚡',
    tone: 'positive',
    context: ['route', 'direction']
  },
  {
    id: 'free-wifi',
    text: 'Free WiFi available',
    category: 'helpful',
    icon: '📶',
    tone: 'positive',
    context: ['resource', 'poi']
  },
  {
    id: 'clean-restrooms',
    text: 'Clean restrooms nearby',
    category: 'helpful',
    icon: '🚻',
    tone: 'positive',
    context: ['resource', 'poi']
  },
  {
    id: 'atm-here',
    text: 'ATM available here',
    category: 'helpful',
    icon: '🏧',
    tone: 'neutral',
    context: ['resource', 'poi']
  },
  {
    id: 'good-food',
    text: 'Great food spot!',
    category: 'helpful',
    icon: '🍽️',
    tone: 'positive',
    context: ['poi', 'resource']
  },
  {
    id: 'parking-available',
    text: 'Parking available',
    category: 'helpful',
    icon: '🅿️',
    tone: 'positive',
    context: ['resource', 'poi']
  },

  // Encouragement Messages
  {
    id: 'you-got-this',
    text: 'You got this!',
    category: 'encouragement',
    icon: '💪',
    tone: 'positive',
    context: ['group', 'community', 'achievement']
  },
  {
    id: 'keep-going',
    text: 'Keep going, almost there!',
    category: 'encouragement',
    icon: '🎯',
    tone: 'positive',
    context: ['group', 'community', 'achievement']
  },
  {
    id: 'well-done',
    text: 'Well done, traveler!',
    category: 'encouragement',
    icon: '👏',
    tone: 'positive',
    context: ['achievement', 'community']
  },
  {
    id: 'stay-strong',
    text: 'Stay strong!',
    category: 'encouragement',
    icon: '💎',
    tone: 'positive',
    context: ['community', 'achievement']
  },
  {
    id: 'believe-yourself',
    text: 'Believe in yourself',
    category: 'encouragement',
    icon: '⭐',
    tone: 'positive',
    context: ['community', 'achievement']
  },

  // Direction Messages
  {
    id: 'turn-left',
    text: 'Turn left here',
    category: 'direction',
    icon: '⬅️',
    tone: 'neutral',
    context: ['route', 'direction']
  },
  {
    id: 'turn-right',
    text: 'Turn right here',
    category: 'direction',
    icon: '➡️',
    tone: 'neutral',
    context: ['route', 'direction']
  },
  {
    id: 'straight-ahead',
    text: 'Continue straight ahead',
    category: 'direction',
    icon: '⬆️',
    tone: 'neutral',
    context: ['route', 'direction']
  },
  {
    id: 'destination-near',
    text: 'Destination nearby',
    category: 'direction',
    icon: '📍',
    tone: 'positive',
    context: ['poi', 'direction']
  },
  {
    id: 'follow-signs',
    text: 'Follow the signs',
    category: 'direction',
    icon: '🪧',
    tone: 'neutral',
    context: ['direction', 'route']
  },

  // Discovery Messages
  {
    id: 'hidden-gem',
    text: 'Hidden gem discovered!',
    category: 'discovery',
    icon: '💎',
    tone: 'positive',
    context: ['poi', 'discovery']
  },
  {
    id: 'beautiful-view',
    text: 'Beautiful view ahead',
    category: 'discovery',
    icon: '🌅',
    tone: 'positive',
    context: ['poi', 'discovery']
  },
  {
    id: 'photo-opportunity',
    text: 'Great photo spot!',
    category: 'discovery',
    icon: '📸',
    tone: 'positive',
    context: ['poi', 'discovery']
  },
  {
    id: 'peaceful-place',
    text: 'Peaceful place for rest',
    category: 'discovery',
    icon: '🧘',
    tone: 'positive',
    context: ['poi', 'safe']
  },
  {
    id: 'historic-site',
    text: 'Historic site worth visiting',
    category: 'discovery',
    icon: '🏛️',
    tone: 'positive',
    context: ['poi', 'discovery']
  },

  // Community Messages
  {
    id: 'join-us',
    text: 'Join us here!',
    category: 'community',
    icon: '🤝',
    tone: 'positive',
    context: ['group', 'community', 'event']
  },
  {
    id: 'meeting-point',
    text: 'Good meeting point',
    category: 'community',
    icon: '📍',
    tone: 'neutral',
    context: ['group', 'community']
  },
  {
    id: 'help-available',
    text: 'Help available here',
    category: 'community',
    icon: '🆘',
    tone: 'positive',
    context: ['safe', 'community', 'resource']
  },
  {
    id: 'volunteers-needed',
    text: 'Volunteers needed',
    category: 'community',
    icon: '🙋',
    tone: 'neutral',
    context: ['civic', 'community']
  },
  {
    id: 'community-event',
    text: 'Community event happening',
    category: 'community',
    icon: '🎉',
    tone: 'positive',
    context: ['event', 'community']
  },

  // Achievement Messages
  {
    id: 'milestone-reached',
    text: 'Milestone reached!',
    category: 'achievement',
    icon: '🏆',
    tone: 'positive',
    context: ['achievement', 'community']
  },
  {
    id: 'challenge-completed',
    text: 'Challenge completed here',
    category: 'achievement',
    icon: '✅',
    tone: 'positive',
    context: ['achievement', 'community']
  },
  {
    id: 'personal-best',
    text: 'Personal best achieved!',
    category: 'achievement',
    icon: '🥇',
    tone: 'positive',
    context: ['achievement']
  },
  {
    id: 'level-up',
    text: 'Level up achieved!',
    category: 'achievement',
    icon: '⬆️',
    tone: 'positive',
    context: ['achievement']
  },

  // Safety Messages
  {
    id: 'safe-zone',
    text: 'Safe zone - help available',
    category: 'safety',
    icon: '🛡️',
    tone: 'positive',
    context: ['safe', 'resource']
  },
  {
    id: 'emergency-services',
    text: 'Emergency services nearby',
    category: 'safety',
    icon: '🚨',
    tone: 'neutral',
    context: ['safe', 'resource']
  },
  {
    id: 'well-lit-area',
    text: 'Well-lit safe area',
    category: 'safety',
    icon: '💡',
    tone: 'positive',
    context: ['safe']
  },
  {
    id: 'security-present',
    text: 'Security present',
    category: 'safety',
    icon: '👮',
    tone: 'positive',
    context: ['safe']
  },

  // Civic Action Messages
  {
    id: 'cleanup-needed',
    text: 'Area needs cleanup',
    category: 'community',
    icon: '🧹',
    tone: 'neutral',
    context: ['civic', 'environmental']
  },
  {
    id: 'cleanup-complete',
    text: 'Cleanup completed!',
    category: 'achievement',
    icon: '✨',
    tone: 'positive',
    context: ['civic', 'environmental', 'achievement']
  },
  {
    id: 'petition-here',
    text: 'Petition drive happening',
    category: 'community',
    icon: '📝',
    tone: 'neutral',
    context: ['civic', 'petition']
  },
  {
    id: 'volunteer-opportunity',
    text: 'Volunteer opportunity',
    category: 'community',
    icon: '🤲',
    tone: 'positive',
    context: ['civic', 'community']
  },
  {
    id: 'donation-drive',
    text: 'Donation drive active',
    category: 'community',
    icon: '💝',
    tone: 'positive',
    context: ['civic', 'community']
  }
];

// Get messages by category
export const getMessagesByCategory = (category: MessageTemplate['category']): MessageTemplate[] => {
  return messageTemplates.filter(template => template.category === category);
};

// Get messages by context
export const getMessagesByContext = (context: string): MessageTemplate[] => {
  return messageTemplates.filter(template => template.context.includes(context));
};

// Get appropriate messages for a sign category
export const getMessagesForSignCategory = (signCategory: string): MessageTemplate[] => {
  const contextMap: Record<string, string[]> = {
    'danger': ['danger', 'warning', 'safety'],
    'warning': ['warning', 'safety'],
    'safe': ['safe', 'safety', 'helpful'],
    'poi': ['poi', 'discovery', 'helpful'],
    'resource': ['resource', 'helpful'],
    'group': ['group', 'community'],
    'event': ['event', 'community'],
    'route': ['route', 'direction', 'helpful'],
    'civic': ['civic', 'community'],
    'environmental': ['civic', 'environmental', 'community'],
    'community': ['community', 'civic'],
    'petition': ['civic', 'petition', 'community']
  };

  const contexts = contextMap[signCategory] || ['helpful'];
  const relevantMessages = new Set<MessageTemplate>();

  contexts.forEach(context => {
    getMessagesByContext(context).forEach(message => {
      relevantMessages.add(message);
    });
  });

  return Array.from(relevantMessages);
};

// Predefined message combinations for complex situations
export const messageCombinations = {
  'danger-with-alternative': [
    messageTemplates.find(m => m.id === 'danger-ahead')!,
    messageTemplates.find(m => m.id === 'safe-route')!
  ],
  'construction-detour': [
    messageTemplates.find(m => m.id === 'construction-zone')!,
    messageTemplates.find(m => m.id === 'turn-left')!
  ],
  'community-cleanup': [
    messageTemplates.find(m => m.id === 'cleanup-needed')!,
    messageTemplates.find(m => m.id === 'volunteers-needed')!
  ],
  'achievement-celebration': [
    messageTemplates.find(m => m.id === 'milestone-reached')!,
    messageTemplates.find(m => m.id === 'well-done')!
  ]
};

// Get random encouraging message
export const getRandomEncouragement = (): MessageTemplate => {
  const encouragementMessages = getMessagesByCategory('encouragement');
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
};

// Get random helpful message
export const getRandomHelpful = (): MessageTemplate => {
  const helpfulMessages = getMessagesByCategory('helpful');
  return helpfulMessages[Math.floor(Math.random() * helpfulMessages.length)];
};