import { CivicAction } from '../types';

export const civicActions: CivicAction[] = [
  {
    id: 'park-cleanup-general',
    title: '🌳 Community Park Cleanup',
    description: 'Join or organize a cleanup at your local park. Bring gloves and help make green spaces beautiful! Most parks provide cleaning supplies or you can bring your own.',
    type: 'cleanup',
    impactPoints: 100,
    organizationPartner: 'Local Parks Department',
    verificationMethod: 'photo',
    timeEstimate: '2 hours',
    participantCount: 1243,
    completedBy: ['user1', 'user2', 'user3'],
    createdAt: new Date('2024-01-15'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'petition-bike-lanes',
    title: '🚴 Petition for Protected Bike Lanes',
    description: 'Create or sign a petition for protected bike lanes in your community. Safer cycling means cleaner air and healthier communities!',
    type: 'petition',
    impactPoints: 75,
    organizationPartner: 'Bike Safety Coalition',
    verificationMethod: 'partner_confirm',
    timeEstimate: '30 minutes',
    participantCount: 856,
    completedBy: ['user4', 'user5'],
    createdAt: new Date('2024-01-10'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'food-bank-volunteer',
    title: '🍽️ Food Bank Volunteer Day',
    description: 'Help sort and pack food donations at your local food bank. Every hour of your time helps feed families in need. Find a food bank near you and contact them about volunteer opportunities.',
    type: 'volunteer',
    impactPoints: 150,
    organizationPartner: 'Local Food Banks',
    verificationMethod: 'qr_code',
    timeEstimate: '3 hours',
    participantCount: 712,
    completedBy: ['user6'],
    createdAt: new Date('2024-01-12'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'clothing-donation-drive',
    title: '👕 Clothing Donation Drive',
    description: 'Donate gently used clothing to help those in need. Most communities have donation centers, shelters, or thrift stores that accept clothing donations.',
    type: 'donation',
    impactPoints: 125,
    organizationPartner: 'Community Shelters Alliance',
    verificationMethod: 'photo',
    timeEstimate: '1 hour',
    participantCount: 945,
    completedBy: ['user7', 'user8'],
    createdAt: new Date('2024-01-08'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'climate-education',
    title: '🌍 Climate Change Awareness Workshop',
    description: 'Attend or help organize educational workshops about climate change and sustainable living practices in your community. Libraries, schools, and community centers are great venues.',
    type: 'education',
    impactPoints: 100,
    organizationPartner: 'Green Future Initiative',
    verificationMethod: 'qr_code',
    timeEstimate: '2 hours',
    participantCount: 528,
    completedBy: ['user9'],
    createdAt: new Date('2024-01-14'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'voting-rights-advocacy',
    title: '🗳️ Voter Registration Drive',
    description: 'Help register new voters and advocate for voting rights in your community. Democracy starts with participation! Contact your local election office for guidelines.',
    type: 'advocacy',
    impactPoints: 200,
    organizationPartner: 'Democracy Now Coalition',
    verificationMethod: 'partner_confirm',
    timeEstimate: '4 hours',
    participantCount: 308,
    completedBy: [],
    createdAt: new Date('2024-01-16'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'river-cleanup',
    title: '🌊 Waterway Restoration Project',
    description: 'Join a cleanup effort at a local river, lake, or beach to remove trash and invasive plants. Help restore our waterways to their natural beauty. Check with environmental groups in your area.',
    type: 'cleanup',
    impactPoints: 175,
    organizationPartner: 'Waterway Conservation Society',
    verificationMethod: 'photo',
    timeEstimate: '3 hours',
    participantCount: 619,
    completedBy: ['user10', 'user11'],
    createdAt: new Date('2024-01-11'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'senior-tech-help',
    title: '👴 Tech Support for Seniors',
    description: 'Volunteer to help senior citizens learn to use smartphones, tablets, and computers. Bridge the digital divide! Senior centers, libraries, and community centers often host these programs.',
    type: 'volunteer',
    impactPoints: 125,
    organizationPartner: 'Senior Community Connection',
    verificationMethod: 'qr_code',
    timeEstimate: '2 hours',
    participantCount: 415,
    completedBy: ['user12'],
    createdAt: new Date('2024-01-13'),
    isActive: true
  },
  {
    id: 'community-garden',
    title: '🌱 Community Garden Project',
    description: 'Help plant or maintain a community garden. Grow fresh produce for food banks or beautify public spaces. Many neighborhoods have community gardens or vacant lots that can be transformed.',
    type: 'volunteer',
    impactPoints: 150,
    organizationPartner: 'Urban Gardening Network',
    verificationMethod: 'photo',
    timeEstimate: '3 hours',
    participantCount: 532,
    completedBy: [],
    createdAt: new Date('2024-02-05'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'school-supplies-donation',
    title: '📚 School Supplies Drive',
    description: 'Donate school supplies to help students in need. Many schools, libraries, and community centers organize supply drives before school starts.',
    type: 'donation',
    impactPoints: 100,
    organizationPartner: 'Education For All Foundation',
    verificationMethod: 'photo',
    timeEstimate: '1 hour',
    participantCount: 723,
    completedBy: [],
    createdAt: new Date('2024-02-10'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'recycling-education',
    title: '♻️ Recycling Education Campaign',
    description: 'Help educate your community about proper recycling practices. Create informational materials or host a workshop at a local community center, school, or library.',
    type: 'education',
    impactPoints: 125,
    organizationPartner: 'Sustainable Future Coalition',
    verificationMethod: 'photo',
    timeEstimate: '2 hours',
    participantCount: 347,
    completedBy: [],
    createdAt: new Date('2024-02-15'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'affordable-housing-advocacy',
    title: '🏘️ Affordable Housing Advocacy',
    description: 'Advocate for affordable housing policies in your community. Attend city council meetings, join housing coalitions, or organize awareness events.',
    type: 'advocacy',
    impactPoints: 175,
    organizationPartner: 'Housing Justice Alliance',
    verificationMethod: 'partner_confirm',
    timeEstimate: '3 hours',
    participantCount: 289,
    completedBy: [],
    createdAt: new Date('2024-02-20'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'neighborhood-cleanup',
    title: '🏙️ Neighborhood Cleanup Day',
    description: 'Organize or join a cleanup day in your neighborhood. Pick up litter, remove graffiti, and beautify public spaces. Connect with neighbors to make a bigger impact!',
    type: 'cleanup',
    impactPoints: 150,
    organizationPartner: 'Neighborhood Improvement Association',
    verificationMethod: 'photo',
    timeEstimate: '3 hours',
    participantCount: 876,
    completedBy: [],
    createdAt: new Date('2024-02-25'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'literacy-volunteer',
    title: '📖 Literacy Volunteer Program',
    description: 'Help improve literacy by volunteering as a reading tutor. Libraries, schools, and community centers often have literacy programs looking for volunteers.',
    type: 'volunteer',
    impactPoints: 175,
    organizationPartner: 'Literacy First',
    verificationMethod: 'partner_confirm',
    timeEstimate: '2 hours/week',
    participantCount: 412,
    completedBy: [],
    createdAt: new Date('2024-03-01'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'food-drive-organizer',
    title: '🥫 Food Drive Organizer',
    description: 'Organize a food drive in your community, workplace, or school. Collect non-perishable items for local food banks. Contact food banks first to learn about their most-needed items.',
    type: 'donation',
    impactPoints: 200,
    organizationPartner: 'Community Food Network',
    verificationMethod: 'photo',
    timeEstimate: '5 hours',
    participantCount: 534,
    completedBy: [],
    createdAt: new Date('2024-03-05'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'mental-health-awareness',
    title: '🧠 Mental Health Awareness Campaign',
    description: 'Help reduce stigma around mental health by organizing or participating in awareness events. Schools, community centers, and healthcare facilities are good venues.',
    type: 'education',
    impactPoints: 150,
    organizationPartner: 'Mental Health Alliance',
    verificationMethod: 'photo',
    timeEstimate: '3 hours',
    participantCount: 367,
    completedBy: [],
    createdAt: new Date('2024-03-10'),
    deadline: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: 'public-transit-advocacy',
    title: '🚌 Public Transit Improvement Advocacy',
    description: 'Advocate for better public transportation in your community. Attend transportation board meetings, collect signatures, or organize awareness campaigns.',
    type: 'advocacy',
    impactPoints: 175,
    organizationPartner: 'Sustainable Transit Coalition',
    verificationMethod: 'partner_confirm',
    timeEstimate: '4 hours',
    participantCount: 256,
    completedBy: [],
    createdAt: new Date('2024-03-15'),
    deadline: new Date('2024-12-31'),
    isActive: true
  }
];

export const getCivicActionsByType = (type: CivicAction['type']): CivicAction[] => {
  return civicActions.filter(action => action.type === type && action.isActive);
};

// Helper function to get recommended civic actions based on user profile
export const getRecommendedActions = (user: any): CivicAction[] => {
  if (!user) return civicActions.slice(0, 5);
  
  // Filter based on user interests and goals
  const userInterests = user.interests || [];
  const userGoals = user.goals || [];
  
  // Map interests and goals to action types
  const interestToActionType: Record<string, CivicAction['type'][]> = {
    'social': ['volunteer', 'education'],
    'environmental': ['cleanup', 'education'],
    'education': ['education', 'volunteer'],
    'civic': ['advocacy', 'petition'],
    'financial': ['donation'],
    'career': ['volunteer', 'education']
  };
  
  const goalToActionType: Record<string, CivicAction['type'][]> = {
    'help_others': ['volunteer', 'donation'],
    'social_impact': ['advocacy', 'petition', 'education'],
    'personal_growth': ['volunteer', 'education']
  };
  
  // Collect relevant action types
  const relevantTypes = new Set<CivicAction['type']>();
  
  userInterests.forEach(interest => {
    const types = interestToActionType[interest];
    if (types) types.forEach(type => relevantTypes.add(type));
  });
  
  userGoals.forEach(goal => {
    const types = goalToActionType[goal];
    if (types) types.forEach(type => relevantTypes.add(type));
  });
  
  // Filter actions by relevant types
  let recommendedActions = civicActions.filter(action => 
    relevantTypes.has(action.type) && !user.completedCivicActions.includes(action.id)
  );
  
  // If we don't have enough recommendations, add some general ones
  if (recommendedActions.length < 5) {
    const generalActions = civicActions.filter(action => 
      !recommendedActions.includes(action) && !user.completedCivicActions.includes(action.id)
    );
    recommendedActions = [...recommendedActions, ...generalActions].slice(0, 5);
  }
  
  return recommendedActions;
};