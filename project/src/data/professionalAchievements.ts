import { LifeAchievement } from '../types';

export const professionalAchievements: LifeAchievement[] = [
  // DOCTOR / MEDICAL PROFESSIONAL ACHIEVEMENTS
  {
    id: 'doctor-first-patient',
    name: 'First Patient Saved',
    description: 'Successfully treat and help your first patient recover',
    icon: '🩺',
    category: 'career',
    ageRange: { min: 25, max: 35, optimal: 27 },
    difficulty: 'medium',
    timeToComplete: '1 month',
    requiredData: ['current_role'],
    profession: 'doctor',
    rewards: {
      experience: 500,
      lifeScore: 300,
      careerScore: 400,
      title: 'Healer',
      badge: 'first-patient'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['medical', 'compassionate', 'professional']
  },
  {
    id: 'doctor-medical-conference',
    name: 'Medical Conference Speaker',
    description: 'Present at a medical conference or participate in a medical symposium',
    icon: '🎤',
    category: 'career',
    ageRange: { min: 28, max: 50, optimal: 32 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role', 'experience_years'],
    profession: 'doctor',
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 700,
      title: 'Medical Expert',
      badge: 'conference-speaker'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['leadership', 'knowledge-sharing', 'expert']
  },
  {
    id: 'doctor-research-publication',
    name: 'Medical Research Published',
    description: 'Publish a medical research paper or article in a peer-reviewed journal',
    icon: '📄',
    category: 'career',
    ageRange: { min: 30, max: 60, optimal: 35 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'doctor',
    rewards: {
      experience: 1200,
      lifeScore: 800,
      careerScore: 1000,
      title: 'Medical Researcher',
      badge: 'published-researcher'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['research', 'innovative', 'academic']
  },
  {
    id: 'doctor-report-malpractice',
    name: 'Medical Ethics Guardian',
    description: 'Report medical malpractice or unethical behavior to protect patients',
    icon: '⚖️',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '1 month',
    requiredData: ['current_role'],
    profession: 'doctor',
    rewards: {
      experience: 600,
      lifeScore: 400,
      careerScore: 300,
      title: 'Ethics Guardian',
      badge: 'medical-ethics'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['ethical', 'courageous', 'patient-advocate']
  },
  {
    id: 'doctor-volunteer-clinic',
    name: 'Community Health Hero',
    description: 'Volunteer at a free clinic or provide medical services to underserved communities',
    icon: '🏥',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'doctor',
    rewards: {
      experience: 700,
      lifeScore: 600,
      careerScore: 400,
      title: 'Community Healer',
      badge: 'volunteer-doctor'
    },
    verificationMethod: 'community_verify',
    aiPersonalized: true,
    tags: ['altruistic', 'community-focused', 'compassionate']
  },
  {
    id: 'doctor-specialty-certification',
    name: 'Medical Specialization',
    description: 'Obtain certification in a medical specialty or subspecialty',
    icon: '🎓',
    category: 'career',
    ageRange: { min: 28, max: 45, optimal: 32 },
    difficulty: 'legendary',
    timeToComplete: '1-3 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'doctor',
    rewards: {
      experience: 1500,
      lifeScore: 1000,
      careerScore: 1500,
      title: 'Specialist',
      badge: 'medical-specialist'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['specialized', 'dedicated', 'expert']
  },

  // NURSE ACHIEVEMENTS
  {
    id: 'nurse-patient-care-excellence',
    name: 'Patient Care Excellence',
    description: 'Receive recognition for exceptional patient care and compassion',
    icon: '💉',
    category: 'career',
    ageRange: { min: 22, max: 65, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'nurse',
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 300,
      title: 'Compassionate Caregiver',
      badge: 'patient-care'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['compassionate', 'dedicated', 'patient-focused']
  },
  {
    id: 'nurse-advanced-certification',
    name: 'Nursing Specialization',
    description: 'Obtain advanced certification in a nursing specialty',
    icon: '🏅',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'nurse',
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 700,
      title: 'Specialized Nurse',
      badge: 'nursing-specialist'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['specialized', 'skilled', 'professional']
  },
  {
    id: 'nurse-disaster-response',
    name: 'Emergency Response Hero',
    description: 'Participate in disaster or emergency response efforts',
    icon: '🚑',
    category: 'civic',
    ageRange: { min: 22, max: 65, optimal: 35 },
    difficulty: 'hard',
    timeToComplete: '1-3 months',
    requiredData: ['current_role'],
    profession: 'nurse',
    rewards: {
      experience: 900,
      lifeScore: 800,
      careerScore: 500,
      title: 'Crisis Responder',
      badge: 'emergency-hero'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['brave', 'crisis-management', 'humanitarian']
  },

  // MAYOR / CITY OFFICIAL ACHIEVEMENTS
  {
    id: 'mayor-traffic-improvement',
    name: 'Traffic Flow Master',
    description: 'Improve city traffic flow by 5% through infrastructure or policy changes',
    icon: '🚦',
    category: 'civic',
    ageRange: { min: 35, max: 70, optimal: 45 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'mayor',
    careerMetrics: {
      targetImprovement: 5 // 5% traffic improvement
    },
    rewards: {
      experience: 1000,
      lifeScore: 800,
      careerScore: 900,
      title: 'Traffic Optimizer',
      badge: 'traffic-master'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['infrastructure', 'problem-solver', 'data-driven']
  },
  {
    id: 'mayor-pothole-elimination',
    name: 'Road Repair Champion',
    description: 'Fix 100+ potholes or complete major road repair project in your city',
    icon: '🛣️',
    category: 'civic',
    ageRange: { min: 35, max: 70, optimal: 45 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'mayor',
    careerMetrics: {
      targetCount: 100 // 100 potholes fixed
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 600,
      title: 'Infrastructure Hero',
      badge: 'road-warrior'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['infrastructure', 'practical', 'community-focused']
  },
  {
    id: 'mayor-public-transport',
    name: 'Transit Revolution',
    description: 'Improve public transportation routes, frequency, or accessibility by 10%',
    icon: '🚌',
    category: 'civic',
    ageRange: { min: 35, max: 70, optimal: 45 },
    difficulty: 'legendary',
    timeToComplete: '2 years',
    requiredData: ['current_role'],
    profession: 'mayor',
    careerMetrics: {
      targetImprovement: 10 // 10% improvement in public transport
    },
    rewards: {
      experience: 1500,
      lifeScore: 1200,
      careerScore: 1300,
      title: 'Transit Visionary',
      badge: 'transport-revolutionary'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['visionary', 'environmental', 'accessibility']
  },
  {
    id: 'mayor-budget-transparency',
    name: 'Transparency Champion',
    description: 'Implement transparent budget reporting and public financial accountability measures',
    icon: '📊',
    category: 'civic',
    ageRange: { min: 35, max: 70, optimal: 45 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'mayor',
    rewards: {
      experience: 700,
      lifeScore: 600,
      careerScore: 700,
      title: 'Transparency Leader',
      badge: 'open-government'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['transparent', 'accountable', 'democratic']
  },
  {
    id: 'mayor-green-initiative',
    name: 'Green City Pioneer',
    description: 'Launch major environmental initiative: parks, renewable energy, or waste reduction',
    icon: '🌱',
    category: 'environmental',
    ageRange: { min: 35, max: 70, optimal: 45 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'mayor',
    rewards: {
      experience: 900,
      lifeScore: 800,
      careerScore: 700,
      title: 'Environmental Mayor',
      badge: 'green-pioneer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['environmental', 'forward-thinking', 'sustainable']
  },

  // CONGRESSMAN/LEGISLATOR ACHIEVEMENTS
  {
    id: 'congressman-first-bill',
    name: 'Legislative Debut',
    description: 'Propose and introduce your first bill or legislative proposal',
    icon: '📜',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'congressman',
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Legislator',
      badge: 'first-bill'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['legislative', 'initiative', 'democratic']
  },
  {
    id: 'congressman-attendance-record',
    name: 'Perfect Attendance',
    description: 'Maintain 95%+ attendance rate in congressional sessions for one full term',
    icon: '✅',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'congressman',
    careerMetrics: {
      targetAttendance: 95 // 95% attendance rate
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Dedicated Representative',
      badge: 'perfect-attendance'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['dedicated', 'responsible', 'committed']
  },
  {
    id: 'congressman-campaign-promises',
    name: 'Promise Keeper',
    description: 'Successfully pass or advance 75% of your campaign promises into legislation',
    icon: '🤝',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 40 },
    difficulty: 'legendary',
    timeToComplete: '4 years',
    requiredData: ['current_role'],
    profession: 'congressman',
    careerMetrics: {
      targetCompletion: 75 // 75% of campaign promises
    },
    rewards: {
      experience: 1500,
      lifeScore: 1200,
      careerScore: 1400,
      title: 'Promise Keeper',
      badge: 'campaign-champion'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['trustworthy', 'effective', 'accountable']
  },
  {
    id: 'congressman-bipartisan-bill',
    name: 'Bridge Builder',
    description: 'Successfully pass a bipartisan bill with support from both major parties',
    icon: '🌉',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 40 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'congressman',
    rewards: {
      experience: 800,
      lifeScore: 700,
      careerScore: 900,
      title: 'Bipartisan Leader',
      badge: 'bridge-builder'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['collaborative', 'diplomatic', 'unifying']
  },
  {
    id: 'congressman-constituent-meetings',
    name: 'People\'s Representative',
    description: 'Hold 50+ town halls or constituent meetings in one year',
    icon: '🗣️',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'congressman',
    careerMetrics: {
      targetMeetings: 50 // 50 constituent meetings
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 600,
      title: 'People\'s Voice',
      badge: 'constituent-champion'
    },
    verificationMethod: 'community_verify',
    aiPersonalized: true,
    tags: ['accessible', 'community-focused', 'democratic']
  },

  // TEACHER / EDUCATOR ACHIEVEMENTS
  {
    id: 'teacher-student-improvement',
    name: 'Student Success Catalyst',
    description: 'Help 90% of your students improve their grades by at least one letter grade',
    icon: '📈',
    category: 'career',
    ageRange: { min: 22, max: 65, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '1 school year',
    requiredData: ['current_role'],
    profession: 'teacher',
    careerMetrics: {
      targetImprovement: 90 // 90% of students improve
    },
    rewards: {
      experience: 700,
      lifeScore: 600,
      careerScore: 800,
      title: 'Student Champion',
      badge: 'grade-improver'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['educational', 'impactful', 'dedicated']
  },
  {
    id: 'teacher-innovative-curriculum',
    name: 'Education Innovator',
    description: 'Develop and implement an innovative teaching method or curriculum',
    icon: '💡',
    category: 'career',
    ageRange: { min: 25, max: 65, optimal: 32 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'teacher',
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'Education Pioneer',
      badge: 'curriculum-innovator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['innovative', 'creative', 'forward-thinking']
  },
  {
    id: 'teacher-mentorship-program',
    name: 'Mentor Master',
    description: 'Successfully mentor 10+ new teachers or student teachers',
    icon: '👨‍🏫',
    category: 'career',
    ageRange: { min: 30, max: 65, optimal: 40 },
    difficulty: 'medium',
    timeToComplete: '2 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'teacher',
    careerMetrics: {
      targetMentees: 10 // 10 teachers mentored
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Master Mentor',
      badge: 'teacher-mentor'
    },
    verificationMethod: 'community_verify',
    aiPersonalized: true,
    tags: ['mentoring', 'leadership', 'knowledge-sharing']
  },
  {
    id: 'teacher-community-program',
    name: 'Education Outreach',
    description: 'Create or lead an educational program that benefits the wider community',
    icon: '🏫',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'teacher',
    rewards: {
      experience: 700,
      lifeScore: 600,
      careerScore: 500,
      title: 'Community Educator',
      badge: 'education-outreach'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['community-focused', 'educational', 'impactful']
  },

  // ENGINEER / TECHNICAL PROFESSIONAL ACHIEVEMENTS
  {
    id: 'engineer-patent-filed',
    name: 'Innovation Patent',
    description: 'File a patent for an engineering innovation or invention',
    icon: '⚙️',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 32 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role'],
    profession: 'engineer',
    rewards: {
      experience: 1200,
      lifeScore: 800,
      careerScore: 1100,
      title: 'Inventor',
      badge: 'patent-holder'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['innovative', 'technical', 'creative']
  },
  {
    id: 'engineer-safety-improvement',
    name: 'Safety Engineering Hero',
    description: 'Implement engineering solution that improves workplace or public safety',
    icon: '🛡️',
    category: 'civic',
    ageRange: { min: 25, max: 60, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'engineer',
    rewards: {
      experience: 800,
      lifeScore: 700,
      careerScore: 700,
      title: 'Safety Guardian',
      badge: 'safety-engineer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['safety-focused', 'responsible', 'protective']
  },
  {
    id: 'engineer-green-project',
    name: 'Sustainable Engineering',
    description: 'Lead or contribute to a major green/sustainable engineering project',
    icon: '🌿',
    category: 'environmental',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'engineer',
    rewards: {
      experience: 900,
      lifeScore: 800,
      careerScore: 800,
      title: 'Green Engineer',
      badge: 'sustainable-engineer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['environmental', 'sustainable', 'forward-thinking']
  },
  {
    id: 'engineer-open-source',
    name: 'Open Source Contributor',
    description: 'Make significant contributions to open source projects or public knowledge',
    icon: '🌐',
    category: 'career',
    ageRange: { min: 22, max: 60, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'engineer',
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Open Source Champion',
      badge: 'knowledge-sharer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['collaborative', 'knowledge-sharing', 'community-minded']
  },
  {
    id: 'engineer-mentor-junior',
    name: 'Technical Mentor',
    description: 'Mentor 5+ junior engineers or students in technical skills',
    icon: '👨‍💻',
    category: 'career',
    ageRange: { min: 28, max: 60, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'engineer',
    careerMetrics: {
      targetMentees: 5 // 5 engineers mentored
    },
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Engineering Mentor',
      badge: 'tech-mentor'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mentoring', 'leadership', 'knowledge-sharing']
  },

  // SOFTWARE DEVELOPER ACHIEVEMENTS
  {
    id: 'developer-app-launch',
    name: 'App Creator',
    description: 'Design, build, and launch your own application or website',
    icon: '📱',
    category: 'career',
    ageRange: { min: 18, max: 60, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'software developer',
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'App Developer',
      badge: 'app-creator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['creative', 'technical', 'entrepreneurial']
  },
  {
    id: 'developer-open-source-project',
    name: 'Open Source Creator',
    description: 'Create and maintain an open source project with 100+ stars',
    icon: '⭐',
    category: 'career',
    ageRange: { min: 20, max: 60, optimal: 28 },
    difficulty: 'legendary',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'software developer',
    careerMetrics: {
      targetCount: 100 // 100 stars
    },
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1200,
      title: 'Open Source Leader',
      badge: 'star-collector'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['collaborative', 'community-builder', 'technical']
  },
  {
    id: 'developer-tech-talk',
    name: 'Tech Speaker',
    description: 'Present a technical talk at a conference or meetup',
    icon: '🎙️',
    category: 'career',
    ageRange: { min: 22, max: 60, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'software developer',
    rewards: {
      experience: 600,
      lifeScore: 400,
      careerScore: 700,
      title: 'Tech Presenter',
      badge: 'public-speaker'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['public-speaking', 'knowledge-sharing', 'community']
  },
  {
    id: 'developer-hackathon-winner',
    name: 'Hackathon Champion',
    description: 'Win or place in the top 3 at a hackathon or coding competition',
    icon: '🏆',
    category: 'career',
    ageRange: { min: 18, max: 40, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '1 month',
    requiredData: ['current_role'],
    profession: 'software developer',
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 800,
      title: 'Code Champion',
      badge: 'hackathon-winner'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['competitive', 'innovative', 'team-player']
  },

  // LAWYER / LEGAL PROFESSIONAL ACHIEVEMENTS
  {
    id: 'lawyer-pro-bono-cases',
    name: 'Justice for All',
    description: 'Complete 50+ hours of pro bono legal work for underserved communities',
    icon: '⚖️',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'lawyer',
    careerMetrics: {
      targetHours: 50 // 50 hours pro bono
    },
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Justice Advocate',
      badge: 'pro-bono-champion'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['altruistic', 'justice-focused', 'community-service']
  },
  {
    id: 'lawyer-landmark-case',
    name: 'Legal Landmark',
    description: 'Win a significant case that sets legal precedent or creates positive change',
    icon: '🏛️',
    category: 'career',
    ageRange: { min: 30, max: 65, optimal: 40 },
    difficulty: 'legendary',
    timeToComplete: '2-5 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'lawyer',
    rewards: {
      experience: 1500,
      lifeScore: 1000,
      careerScore: 1300,
      title: 'Legal Pioneer',
      badge: 'landmark-lawyer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['impactful', 'precedent-setting', 'influential']
  },
  {
    id: 'lawyer-legal-education',
    name: 'Legal Educator',
    description: 'Provide legal education to 100+ community members through workshops or seminars',
    icon: '📚',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'lawyer',
    careerMetrics: {
      targetCount: 100 // 100 people educated
    },
    rewards: {
      experience: 500,
      lifeScore: 600,
      careerScore: 400,
      title: 'Legal Educator',
      badge: 'knowledge-sharer'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['educational', 'community-focused', 'knowledge-sharing']
  },
  {
    id: 'lawyer-bar-leadership',
    name: 'Bar Association Leader',
    description: 'Serve in a leadership position in a bar association or legal organization',
    icon: '👑',
    category: 'career',
    ageRange: { min: 30, max: 65, optimal: 40 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'lawyer',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Legal Leader',
      badge: 'bar-leader'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['leadership', 'professional', 'influential']
  },

  // ENTREPRENEUR / BUSINESS OWNER ACHIEVEMENTS
  {
    id: 'entrepreneur-first-employee',
    name: 'Team Builder',
    description: 'Hire your first employee and build a team of 5+ people',
    icon: '👥',
    category: 'entrepreneurship',
    ageRange: { min: 20, max: 50, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'entrepreneurship_interest'],
    profession: 'entrepreneur',
    careerMetrics: {
      targetEmployees: 5 // 5 employees hired
    },
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Team Leader',
      badge: 'team-builder'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['leadership', 'growth-minded', 'people-focused']
  },
  {
    id: 'entrepreneur-revenue-milestone',
    name: 'Revenue Rocket',
    description: 'Reach $100K annual revenue in your business',
    icon: '🚀',
    category: 'entrepreneurship',
    ageRange: { min: 22, max: 50, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '2-3 years',
    requiredData: ['current_role', 'entrepreneurship_interest'],
    profession: 'entrepreneur',
    careerMetrics: {
      targetRevenue: 100000 // $100K revenue
    },
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1200,
      title: 'Revenue Master',
      badge: 'revenue-rocket'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['business-savvy', 'growth-focused', 'successful']
  },
  {
    id: 'entrepreneur-first-funding',
    name: 'Funding Secured',
    description: 'Secure your first round of funding or significant business loan',
    icon: '💰',
    category: 'entrepreneurship',
    ageRange: { min: 20, max: 50, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'entrepreneurship_interest'],
    profession: 'entrepreneur',
    rewards: {
      experience: 900,
      lifeScore: 600,
      careerScore: 1000,
      title: 'Funded Founder',
      badge: 'capital-raiser'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['persuasive', 'strategic', 'business-focused']
  },
  {
    id: 'entrepreneur-mentor-startups',
    name: 'Startup Mentor',
    description: 'Mentor 5+ early-stage entrepreneurs or startups',
    icon: '🧠',
    category: 'entrepreneurship',
    ageRange: { min: 30, max: 65, optimal: 40 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'entrepreneur',
    careerMetrics: {
      targetMentees: 5 // 5 startups mentored
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Startup Guide',
      badge: 'founder-mentor'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mentoring', 'knowledge-sharing', 'supportive']
  },
  {
    id: 'entrepreneur-social-impact',
    name: 'Social Entrepreneur',
    description: 'Create a business initiative that generates positive social or environmental impact',
    icon: '🌍',
    category: 'entrepreneurship',
    ageRange: { min: 22, max: 60, optimal: 32 },
    difficulty: 'hard',
    timeToComplete: '1-2 years',
    requiredData: ['current_role', 'entrepreneurship_interest'],
    profession: 'entrepreneur',
    rewards: {
      experience: 800,
      lifeScore: 900,
      careerScore: 700,
      title: 'Impact Entrepreneur',
      badge: 'social-innovator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['socially-conscious', 'innovative', 'purpose-driven']
  },

  // DESIGNER / CREATIVE PROFESSIONAL ACHIEVEMENTS
  {
    id: 'designer-portfolio-excellence',
    name: 'Portfolio Masterpiece',
    description: 'Create a professional portfolio that showcases your best design work',
    icon: '🎨',
    category: 'creative',
    ageRange: { min: 20, max: 40, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'designer',
    rewards: {
      experience: 500,
      lifeScore: 300,
      careerScore: 600,
      title: 'Visual Storyteller',
      badge: 'portfolio-master'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['creative', 'professional', 'visual']
  },
  {
    id: 'designer-award-winning',
    name: 'Award-Winning Design',
    description: 'Win a design award or recognition from a respected industry organization',
    icon: '🏆',
    category: 'creative',
    ageRange: { min: 22, max: 60, optimal: 30 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role'],
    profession: 'designer',
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1100,
      title: 'Award-Winning Designer',
      badge: 'design-champion'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['accomplished', 'recognized', 'excellent']
  },
  {
    id: 'designer-community-project',
    name: 'Design for Good',
    description: 'Complete a pro bono design project for a non-profit or community organization',
    icon: '❤️',
    category: 'civic',
    ageRange: { min: 20, max: 60, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'designer',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 400,
      title: 'Community Designer',
      badge: 'design-for-good'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['altruistic', 'community-focused', 'impactful']
  },
  {
    id: 'designer-mentor-students',
    name: 'Design Mentor',
    description: 'Mentor 5+ design students or junior designers',
    icon: '👨‍🎨',
    category: 'creative',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role', 'experience_years'],
    profession: 'designer',
    careerMetrics: {
      targetMentees: 5 // 5 designers mentored
    },
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Design Guide',
      badge: 'creative-mentor'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mentoring', 'knowledge-sharing', 'supportive']
  },

  // MARKETING PROFESSIONAL ACHIEVEMENTS
  {
    id: 'marketer-campaign-success',
    name: 'Viral Campaign Creator',
    description: 'Create a marketing campaign that exceeds targets by 50%+',
    icon: '📈',
    category: 'career',
    ageRange: { min: 22, max: 50, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'marketer',
    careerMetrics: {
      targetImprovement: 50 // 50% above target
    },
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 900,
      title: 'Campaign Maestro',
      badge: 'viral-creator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['creative', 'strategic', 'results-driven']
  },
  {
    id: 'marketer-social-impact',
    name: 'Purpose-Driven Marketing',
    description: 'Lead a marketing campaign for social good or environmental awareness',
    icon: '🌱',
    category: 'civic',
    ageRange: { min: 22, max: 55, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'marketer',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Impact Marketer',
      badge: 'purpose-driven'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['purpose-driven', 'socially-conscious', 'impactful']
  },
  {
    id: 'marketer-industry-recognition',
    name: 'Marketing Excellence',
    description: 'Win a marketing award or industry recognition for your work',
    icon: '🏅',
    category: 'career',
    ageRange: { min: 25, max: 55, optimal: 32 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'marketer',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Award-Winning Marketer',
      badge: 'marketing-excellence'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['accomplished', 'recognized', 'excellent']
  },

  // FINANCE PROFESSIONAL ACHIEVEMENTS
  {
    id: 'finance-certification',
    name: 'Financial Expert',
    description: 'Obtain a prestigious financial certification (CFA, CFP, CPA, etc.)',
    icon: '📜',
    category: 'career',
    ageRange: { min: 22, max: 45, optimal: 28 },
    difficulty: 'legendary',
    timeToComplete: '1-3 years',
    requiredData: ['current_role'],
    profession: 'finance',
    rewards: {
      experience: 1000,
      lifeScore: 600,
      careerScore: 1200,
      title: 'Certified Financial Expert',
      badge: 'finance-certified'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['professional', 'dedicated', 'expert']
  },
  {
    id: 'finance-community-education',
    name: 'Financial Literacy Champion',
    description: 'Provide financial education to 100+ community members',
    icon: '💰',
    category: 'civic',
    ageRange: { min: 25, max: 65, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'finance',
    careerMetrics: {
      targetCount: 100 // 100 people educated
    },
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Financial Educator',
      badge: 'literacy-champion'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['educational', 'community-focused', 'impactful']
  },
  {
    id: 'finance-ethical-investing',
    name: 'Ethical Finance Pioneer',
    description: 'Develop or implement ethical investment or finance strategies',
    icon: '🌱',
    category: 'financial',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'finance',
    rewards: {
      experience: 800,
      lifeScore: 700,
      careerScore: 800,
      title: 'Ethical Financier',
      badge: 'ethical-investor'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['ethical', 'sustainable', 'forward-thinking']
  },

  // CHEF / CULINARY PROFESSIONAL ACHIEVEMENTS
  {
    id: 'chef-signature-dish',
    name: 'Signature Dish Creator',
    description: 'Create a signature dish that receives recognition or becomes popular',
    icon: '🍽️',
    category: 'creative',
    ageRange: { min: 20, max: 60, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'chef',
    rewards: {
      experience: 600,
      lifeScore: 400,
      careerScore: 700,
      title: 'Culinary Artist',
      badge: 'signature-creator'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['creative', 'innovative', 'skilled']
  },
  {
    id: 'chef-sustainable-menu',
    name: 'Sustainable Cuisine Pioneer',
    description: 'Develop and implement a sustainable, locally-sourced menu',
    icon: '🌱',
    category: 'environmental',
    ageRange: { min: 22, max: 60, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'chef',
    rewards: {
      experience: 700,
      lifeScore: 800,
      careerScore: 600,
      title: 'Eco-Chef',
      badge: 'sustainable-cuisine'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['sustainable', 'environmental', 'innovative']
  },
  {
    id: 'chef-community-feeding',
    name: 'Community Nourisher',
    description: 'Provide meals for 500+ people in need through community initiatives',
    icon: '🍲',
    category: 'civic',
    ageRange: { min: 20, max: 65, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'chef',
    careerMetrics: {
      targetCount: 500 // 500 meals provided
    },
    rewards: {
      experience: 600,
      lifeScore: 800,
      careerScore: 400,
      title: 'Community Chef',
      badge: 'hunger-fighter'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['altruistic', 'community-focused', 'compassionate']
  },
  {
    id: 'chef-culinary-award',
    name: 'Culinary Excellence',
    description: 'Win a culinary award or receive significant recognition for your cooking',
    icon: '🏆',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role'],
    profession: 'chef',
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1100,
      title: 'Award-Winning Chef',
      badge: 'culinary-excellence'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['accomplished', 'recognized', 'excellent']
  },

  // JOURNALIST / MEDIA PROFESSIONAL ACHIEVEMENTS
  {
    id: 'journalist-investigative-story',
    name: 'Truth Revealer',
    description: 'Complete and publish a significant investigative journalism piece',
    icon: '🔍',
    category: 'career',
    ageRange: { min: 22, max: 60, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'journalist',
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'Investigative Journalist',
      badge: 'truth-seeker'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['investigative', 'truth-seeking', 'impactful']
  },
  {
    id: 'journalist-community-voice',
    name: 'Community Voice',
    description: 'Amplify underrepresented voices through a series of stories or features',
    icon: '📣',
    category: 'civic',
    ageRange: { min: 22, max: 60, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'journalist',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Voice Amplifier',
      badge: 'community-journalist'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['inclusive', 'community-focused', 'socially-conscious']
  },
  {
    id: 'journalist-award-winning',
    name: 'Award-Winning Journalist',
    description: 'Win a journalism award or major recognition for your reporting',
    icon: '🏅',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role'],
    profession: 'journalist',
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1100,
      title: 'Distinguished Journalist',
      badge: 'journalism-excellence'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['accomplished', 'recognized', 'excellent']
  },

  // HEALTHCARE ADMINISTRATOR ACHIEVEMENTS
  {
    id: 'healthcare-admin-patient-satisfaction',
    name: 'Patient Experience Champion',
    description: 'Implement changes that improve patient satisfaction scores by 20%+',
    icon: '😊',
    category: 'career',
    ageRange: { min: 28, max: 60, optimal: 35 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'healthcare administrator',
    careerMetrics: {
      targetImprovement: 20 // 20% improvement
    },
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'Patient Champion',
      badge: 'satisfaction-master'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['patient-focused', 'improvement-oriented', 'leadership']
  },
  {
    id: 'healthcare-admin-efficiency',
    name: 'Healthcare Efficiency Expert',
    description: 'Implement process improvements that reduce costs by 15%+ while maintaining quality',
    icon: '⚡',
    category: 'career',
    ageRange: { min: 30, max: 60, optimal: 40 },
    difficulty: 'legendary',
    timeToComplete: '1-2 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'healthcare administrator',
    careerMetrics: {
      targetImprovement: 15 // 15% cost reduction
    },
    rewards: {
      experience: 1000,
      lifeScore: 700,
      careerScore: 1200,
      title: 'Efficiency Innovator',
      badge: 'healthcare-optimizer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['efficient', 'innovative', 'strategic']
  },
  {
    id: 'healthcare-admin-community-program',
    name: 'Community Health Initiative',
    description: 'Launch a community health program that serves 500+ people',
    icon: '🏥',
    category: 'civic',
    ageRange: { min: 28, max: 60, optimal: 38 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'healthcare administrator',
    careerMetrics: {
      targetCount: 500 // 500 people served
    },
    rewards: {
      experience: 800,
      lifeScore: 900,
      careerScore: 700,
      title: 'Community Health Leader',
      badge: 'health-outreach'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['community-focused', 'health-oriented', 'impactful']
  },

  // SCIENTIST / RESEARCHER ACHIEVEMENTS
  {
    id: 'scientist-research-publication',
    name: 'Published Researcher',
    description: 'Publish research in a peer-reviewed journal',
    icon: '📄',
    category: 'career',
    ageRange: { min: 25, max: 70, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '1-2 years',
    requiredData: ['current_role'],
    profession: 'scientist',
    rewards: {
      experience: 900,
      lifeScore: 600,
      careerScore: 1000,
      title: 'Published Scientist',
      badge: 'research-author'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['academic', 'research-focused', 'knowledge-creator']
  },
  {
    id: 'scientist-breakthrough',
    name: 'Scientific Breakthrough',
    description: 'Make a significant scientific discovery or breakthrough in your field',
    icon: '💡',
    category: 'career',
    ageRange: { min: 28, max: 70, optimal: 40 },
    difficulty: 'legendary',
    timeToComplete: '2-5 years',
    requiredData: ['current_role', 'experience_years'],
    profession: 'scientist',
    rewards: {
      experience: 1500,
      lifeScore: 1000,
      careerScore: 1500,
      title: 'Pioneer Scientist',
      badge: 'breakthrough-achiever'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['innovative', 'groundbreaking', 'dedicated']
  },
  {
    id: 'scientist-public-education',
    name: 'Science Communicator',
    description: 'Effectively communicate scientific concepts to the general public through media or events',
    icon: '🎤',
    category: 'civic',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'scientist',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Science Communicator',
      badge: 'public-educator'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['educational', 'communication', 'public-engagement']
  },
  {
    id: 'scientist-mentor-students',
    name: 'Scientific Mentor',
    description: 'Mentor 5+ students or early-career scientists',
    icon: '🧪',
    category: 'career',
    ageRange: { min: 30, max: 70, optimal: 40 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'scientist',
    careerMetrics: {
      targetMentees: 5 // 5 scientists mentored
    },
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Science Mentor',
      badge: 'research-guide'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mentoring', 'knowledge-sharing', 'supportive']
  },

  // ARTIST / CREATIVE ACHIEVEMENTS
  {
    id: 'artist-first-exhibition',
    name: 'Exhibited Artist',
    description: 'Have your work featured in an art exhibition or gallery',
    icon: '🖼️',
    category: 'creative',
    ageRange: { min: 18, max: 70, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'artist',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Gallery Artist',
      badge: 'exhibited-creator'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['creative', 'accomplished', 'expressive']
  },
  {
    id: 'artist-community-project',
    name: 'Community Art Leader',
    description: 'Lead a community art project that engages 50+ participants',
    icon: '🎨',
    category: 'civic',
    ageRange: { min: 20, max: 70, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'artist',
    careerMetrics: {
      targetCount: 50 // 50 participants
    },
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Community Artist',
      badge: 'art-leader'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['community-focused', 'leadership', 'inclusive']
  },
  {
    id: 'artist-sold-work',
    name: 'Professional Artist',
    description: 'Sell your artwork or creative services professionally',
    icon: '💵',
    category: 'creative',
    ageRange: { min: 18, max: 70, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'artist',
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Professional Artist',
      badge: 'art-seller'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['professional', 'business-minded', 'creative']
  },
  {
    id: 'artist-teach-workshop',
    name: 'Art Educator',
    description: 'Teach art skills to others through workshops or classes',
    icon: '👨‍🎨',
    category: 'creative',
    ageRange: { min: 22, max: 70, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'artist',
    rewards: {
      experience: 500,
      lifeScore: 600,
      careerScore: 400,
      title: 'Art Teacher',
      badge: 'creative-educator'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['educational', 'knowledge-sharing', 'patient']
  },

  // MUSICIAN / PERFORMER ACHIEVEMENTS
  {
    id: 'musician-first-performance',
    name: 'Stage Performer',
    description: 'Perform live in front of an audience of 50+ people',
    icon: '🎵',
    category: 'creative',
    ageRange: { min: 16, max: 70, optimal: 22 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'musician',
    careerMetrics: {
      targetCount: 50 // 50 audience members
    },
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Performer',
      badge: 'stage-presence'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['performance', 'courageous', 'artistic']
  },
  {
    id: 'musician-original-composition',
    name: 'Original Composer',
    description: 'Create and perform/publish an original musical composition',
    icon: '🎼',
    category: 'creative',
    ageRange: { min: 16, max: 70, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'musician',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Composer',
      badge: 'original-creator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['creative', 'original', 'artistic']
  },
  {
    id: 'musician-benefit-concert',
    name: 'Music for Change',
    description: 'Organize or perform at a benefit concert for a charitable cause',
    icon: '🎸',
    category: 'civic',
    ageRange: { min: 18, max: 70, optimal: 28 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'musician',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Benefit Performer',
      badge: 'music-for-good'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['altruistic', 'community-focused', 'impactful']
  },
  {
    id: 'musician-recording-release',
    name: 'Recorded Artist',
    description: 'Record and release a professional music album or EP',
    icon: '💿',
    category: 'creative',
    ageRange: { min: 18, max: 70, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'musician',
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'Recording Artist',
      badge: 'album-creator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['professional', 'creative', 'accomplished']
  },

  // WRITER / AUTHOR ACHIEVEMENTS
  {
    id: 'writer-published-work',
    name: 'Published Author',
    description: 'Have your writing published professionally (book, article, etc.)',
    icon: '📚',
    category: 'creative',
    ageRange: { min: 20, max: 70, optimal: 30 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'writer',
    rewards: {
      experience: 800,
      lifeScore: 600,
      careerScore: 900,
      title: 'Published Author',
      badge: 'published-writer'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['creative', 'accomplished', 'professional']
  },
  {
    id: 'writer-workshop-leader',
    name: 'Writing Mentor',
    description: 'Lead writing workshops or classes for 20+ aspiring writers',
    icon: '✏️',
    category: 'creative',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'writer',
    careerMetrics: {
      targetCount: 20 // 20 students
    },
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Writing Coach',
      badge: 'word-mentor'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['educational', 'mentoring', 'knowledge-sharing']
  },
  {
    id: 'writer-community-voice',
    name: 'Community Storyteller',
    description: 'Use your writing to amplify community voices or important social issues',
    icon: '📣',
    category: 'civic',
    ageRange: { min: 20, max: 70, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'writer',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Voice of the Community',
      badge: 'story-amplifier'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['socially-conscious', 'community-focused', 'impactful']
  },

  // SALES PROFESSIONAL ACHIEVEMENTS
  {
    id: 'sales-quota-crusher',
    name: 'Quota Crusher',
    description: 'Exceed your sales targets by 50%+ for three consecutive quarters',
    icon: '🎯',
    category: 'career',
    ageRange: { min: 22, max: 60, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '9 months',
    requiredData: ['current_role'],
    profession: 'sales',
    careerMetrics: {
      targetImprovement: 50 // 50% above target
    },
    rewards: {
      experience: 800,
      lifeScore: 500,
      careerScore: 900,
      title: 'Sales Champion',
      badge: 'quota-crusher'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['high-performing', 'driven', 'results-oriented']
  },
  {
    id: 'sales-team-leader',
    name: 'Sales Team Leader',
    description: 'Lead a sales team to achieve collective targets for two consecutive quarters',
    icon: '👥',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 32 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role', 'experience_years'],
    profession: 'sales',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Sales Leader',
      badge: 'team-motivator'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['leadership', 'motivational', 'team-oriented']
  },
  {
    id: 'sales-ethical-practices',
    name: 'Ethical Sales Champion',
    description: 'Implement or advocate for ethical sales practices in your organization',
    icon: '⚖️',
    category: 'career',
    ageRange: { min: 22, max: 60, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'sales',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Ethical Salesperson',
      badge: 'integrity-champion'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['ethical', 'principled', 'customer-focused']
  },

  // HUMAN RESOURCES PROFESSIONAL ACHIEVEMENTS
  {
    id: 'hr-diversity-initiative',
    name: 'Diversity Champion',
    description: 'Successfully implement diversity and inclusion initiatives in your organization',
    icon: '🌈',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 35 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'hr',
    rewards: {
      experience: 800,
      lifeScore: 700,
      careerScore: 800,
      title: 'Diversity Champion',
      badge: 'inclusion-leader'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['inclusive', 'progressive', 'people-focused']
  },
  {
    id: 'hr-certification',
    name: 'HR Certification',
    description: 'Obtain a professional HR certification (SHRM, HRCI, etc.)',
    icon: '📜',
    category: 'career',
    ageRange: { min: 22, max: 50, optimal: 28 },
    difficulty: 'hard',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'hr',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Certified HR Professional',
      badge: 'hr-certified'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['professional', 'dedicated', 'expert']
  },
  {
    id: 'hr-employee-wellbeing',
    name: 'Wellbeing Advocate',
    description: 'Implement employee wellbeing programs that improve satisfaction by 25%+',
    icon: '❤️',
    category: 'career',
    ageRange: { min: 25, max: 60, optimal: 32 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'hr',
    careerMetrics: {
      targetImprovement: 25 // 25% improvement
    },
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 600,
      title: 'Wellbeing Champion',
      badge: 'employee-advocate'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['compassionate', 'people-focused', 'supportive']
  },

  // RETAIL / SERVICE INDUSTRY ACHIEVEMENTS
  {
    id: 'retail-customer-service-award',
    name: 'Service Excellence',
    description: 'Receive recognition or awards for outstanding customer service',
    icon: '🌟',
    category: 'career',
    ageRange: { min: 16, max: 60, optimal: 22 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'retail',
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Service Star',
      badge: 'customer-champion'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['customer-focused', 'excellent', 'attentive']
  },
  {
    id: 'retail-team-lead',
    name: 'Retail Team Leader',
    description: 'Be promoted to or succeed in a team leadership position',
    icon: '👥',
    category: 'career',
    ageRange: { min: 18, max: 50, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'retail',
    rewards: {
      experience: 600,
      lifeScore: 500,
      careerScore: 700,
      title: 'Retail Leader',
      badge: 'team-captain'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['leadership', 'responsible', 'people-management']
  },
  {
    id: 'retail-community-initiative',
    name: 'Community Retail Hero',
    description: 'Lead a community-focused initiative through your retail position',
    icon: '🏪',
    category: 'civic',
    ageRange: { min: 18, max: 60, optimal: 25 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'retail',
    rewards: {
      experience: 500,
      lifeScore: 600,
      careerScore: 400,
      title: 'Community Retailer',
      badge: 'local-hero'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['community-focused', 'initiative-taking', 'socially-conscious']
  },

  // CONSTRUCTION / TRADES PROFESSIONAL ACHIEVEMENTS
  {
    id: 'trades-certification',
    name: 'Certified Tradesperson',
    description: 'Obtain professional certification or licensure in your trade',
    icon: '🔧',
    category: 'career',
    ageRange: { min: 18, max: 50, optimal: 25 },
    difficulty: 'hard',
    timeToComplete: '1 year',
    requiredData: ['current_role'],
    profession: 'trades',
    rewards: {
      experience: 700,
      lifeScore: 500,
      careerScore: 800,
      title: 'Certified Professional',
      badge: 'trade-certified'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['skilled', 'professional', 'dedicated']
  },
  {
    id: 'trades-community-project',
    name: 'Community Builder',
    description: 'Use your trade skills to complete a project benefiting the community',
    icon: '🏗️',
    category: 'civic',
    ageRange: { min: 18, max: 70, optimal: 30 },
    difficulty: 'medium',
    timeToComplete: '3 months',
    requiredData: ['current_role'],
    profession: 'trades',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Community Builder',
      badge: 'skills-for-good'
    },
    verificationMethod: 'photo',
    aiPersonalized: true,
    tags: ['community-focused', 'skilled', 'generous']
  },
  {
    id: 'trades-apprentice-mentor',
    name: 'Trade Mentor',
    description: 'Successfully mentor 3+ apprentices or new tradespeople',
    icon: '👷',
    category: 'career',
    ageRange: { min: 25, max: 70, optimal: 35 },
    difficulty: 'medium',
    timeToComplete: '1 year',
    requiredData: ['current_role', 'experience_years'],
    profession: 'trades',
    careerMetrics: {
      targetMentees: 3 // 3 apprentices mentored
    },
    rewards: {
      experience: 500,
      lifeScore: 400,
      careerScore: 600,
      title: 'Master Tradesperson',
      badge: 'skills-teacher'
    },
    verificationMethod: 'self_report',
    aiPersonalized: true,
    tags: ['mentoring', 'knowledge-sharing', 'patient']
  },
  {
    id: 'trades-sustainable-practices',
    name: 'Green Builder',
    description: 'Implement or champion sustainable practices in your trade',
    icon: '🌱',
    category: 'environmental',
    ageRange: { min: 20, max: 70, optimal: 32 },
    difficulty: 'medium',
    timeToComplete: '6 months',
    requiredData: ['current_role'],
    profession: 'trades',
    rewards: {
      experience: 600,
      lifeScore: 700,
      careerScore: 500,
      title: 'Sustainable Tradesperson',
      badge: 'green-builder'
    },
    verificationMethod: 'document',
    aiPersonalized: true,
    tags: ['sustainable', 'environmental', 'forward-thinking']
  }
];

// Helper function to get achievements by profession
export const getAchievementsByProfession = (profession: string): LifeAchievement[] => {
  return professionalAchievements.filter(achievement => 
    achievement.profession === profession.toLowerCase()
  );
};

// Helper function to get all available professions
export const getAvailableProfessions = (): string[] => {
  const professions = new Set(
    professionalAchievements.map(achievement => achievement.profession).filter(Boolean)
  );
  return Array.from(professions);
};

// Helper function to detect profession from role
export const detectProfessionFromRole = (role: string): string | null => {
  const roleKeywords = {
    doctor: ['doctor', 'physician', 'surgeon', 'medical', 'md', 'medicine', 'healthcare provider'],
    nurse: ['nurse', 'rn', 'lpn', 'nursing', 'healthcare provider'],
    mayor: ['mayor', 'alcalde', 'city manager', 'municipal', 'city official'],
    congressman: ['congressman', 'representative', 'senator', 'diputado', 'legislator', 'parliament'],
    teacher: ['teacher', 'professor', 'educator', 'instructor', 'academic', 'faculty'],
    engineer: ['engineer', 'engineering', 'technical', 'developer', 'architect'],
    'software developer': ['software', 'developer', 'programmer', 'coder', 'web developer', 'app developer'],
    lawyer: ['lawyer', 'attorney', 'legal', 'counsel', 'advocate', 'barrister', 'solicitor'],
    entrepreneur: ['entrepreneur', 'founder', 'ceo', 'business owner', 'startup', 'small business'],
    designer: ['designer', 'graphic designer', 'ux designer', 'ui designer', 'creative', 'artist'],
    marketer: ['marketer', 'marketing', 'digital marketing', 'brand', 'advertising', 'pr', 'communications'],
    finance: ['finance', 'financial', 'accountant', 'banker', 'investment', 'accounting', 'cfo'],
    chef: ['chef', 'cook', 'culinary', 'kitchen', 'restaurant', 'food', 'pastry'],
    journalist: ['journalist', 'reporter', 'writer', 'editor', 'news', 'media', 'press'],
    'healthcare administrator': ['healthcare admin', 'hospital admin', 'medical director', 'health services manager'],
    scientist: ['scientist', 'researcher', 'lab', 'research', 'phd', 'postdoc', 'scientific'],
    artist: ['artist', 'painter', 'sculptor', 'illustrator', 'visual artist', 'fine art'],
    musician: ['musician', 'singer', 'songwriter', 'composer', 'band', 'music', 'performer'],
    writer: ['writer', 'author', 'novelist', 'poet', 'copywriter', 'content creator'],
    sales: ['sales', 'account executive', 'business development', 'sales rep', 'account manager'],
    hr: ['hr', 'human resources', 'talent', 'recruiting', 'personnel', 'people operations'],
    retail: ['retail', 'store manager', 'cashier', 'sales associate', 'customer service', 'shop'],
    trades: ['construction', 'electrician', 'plumber', 'carpenter', 'mechanic', 'technician', 'tradesperson']
  };

  const lowerRole = role.toLowerCase();
  
  for (const [profession, keywords] of Object.entries(roleKeywords)) {
    if (keywords.some(keyword => lowerRole.includes(keyword))) {
      return profession;
    }
  }
  
  return null;
};

// Helper function to get personalized professional achievements
export const getPersonalizedProfessionalAchievements = (
  userProfile: any
): LifeAchievement[] => {
  const currentRole = userProfile.careerProfile?.currentRole;
  if (!currentRole) return [];
  
  const detectedProfession = detectProfessionFromRole(currentRole);
  if (!detectedProfession) return [];
  
  const professionAchievements = getAchievementsByProfession(detectedProfession);
  const userAge = userProfile.currentAge || 25;
  const experienceYears = userProfile.careerProfile?.experienceYears || 0;
  
  // Filter by age and experience appropriateness
  return professionAchievements.filter(achievement => {
    const ageAppropriate = userAge >= achievement.ageRange.min && userAge <= achievement.ageRange.max;
    
    // Some achievements require minimum experience
    const experienceAppropriate = achievement.difficulty === 'legendary' 
      ? experienceYears >= 5 
      : achievement.difficulty === 'hard' 
      ? experienceYears >= 2 
      : true;
    
    return ageAppropriate && experienceAppropriate;
  }).sort((a, b) => {
    // Sort by age appropriateness and difficulty
    const aAgeDiff = Math.abs(a.ageRange.optimal - userAge);
    const bAgeDiff = Math.abs(b.ageRange.optimal - userAge);
    return aAgeDiff - bAgeDiff;
  });
};