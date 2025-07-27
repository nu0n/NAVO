import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { civicActions, getRecommendedActions } from '../data/civicActions';
import { X, MapPin, Clock, Users, Award, Camera, QrCode, CheckCircle, Heart, Search, Filter, Info, MapPinOff, Compass, ArrowRight, Zap, Star, AlertTriangle, ListChecks as ListChecksIcon, Map, Navigation, Target } from 'lucide-react';
import { CivicAction, TaskItem } from '../types';
import { CameraCapture } from './CameraCapture';
import { generateTasksForPeriod } from '../data/taskTemplates';

interface CivicActionHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CivicActionHub: React.FC<CivicActionHubProps> = ({ isOpen, onClose }) => {
  const { user, userLocation, completeCivicAction, completeTask, addTaskList } = useGameStore();
  const [selectedAction, setSelectedAction] = useState<CivicAction | null>(null);
  const [filter, setFilter] = useState<'all' | CivicAction['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  useEffect(() => {
    if (!isOpen) {
      setSelectedAction(null);
      setCapturedPhoto(null);
      setShowSuccess(false);
      setCurrentStep(1);
    }
  }, [isOpen]);
  
  if (!user) return null;

  const getActionIcon = (type: CivicAction['type']) => {
    switch (type) {
      case 'cleanup': return '🧹';
      case 'petition': return '📝';
      case 'volunteer': return '🤝';
      case 'donation': return '💝';
      case 'education': return '🎓';
      case 'advocacy': return '📢';
      default: return '🌟';
    }
  };

  const getActionTheme = (type: CivicAction['type']) => {
    switch (type) {
      case 'cleanup':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-500',
          border: 'border-green-400/50',
          glow: 'shadow-green-500/50'
        };
      case 'petition':
        return {
          gradient: 'from-blue-400 via-indigo-500 to-purple-500',
          border: 'border-blue-400/50',
          glow: 'shadow-blue-500/50'
        };
      case 'volunteer':
        return {
          gradient: 'from-purple-400 via-pink-500 to-rose-500',
          border: 'border-purple-400/50',
          glow: 'shadow-purple-500/50'
        };
      case 'donation':
        return {
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          border: 'border-yellow-400/50',
          glow: 'shadow-yellow-500/50'
        };
      case 'education':
        return {
          gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
          border: 'border-cyan-400/50',
          glow: 'shadow-cyan-500/50'
        };
      case 'advocacy':
        return {
          gradient: 'from-pink-400 via-purple-500 to-indigo-500',
          border: 'border-pink-400/50',
          glow: 'shadow-pink-500/50'
        };
      default:
        return {
          gradient: 'from-gray-400 via-slate-500 to-gray-600',
          border: 'border-gray-400/50',
          glow: 'shadow-gray-500/50'
        };
    }
  };

  const getVerificationIcon = (method: CivicAction['verificationMethod']) => {
    switch (method) {
      case 'photo': return <Camera className="w-4 h-4" />;
      case 'qr_code': return <QrCode className="w-4 h-4" />;
      case 'partner_confirm': return <CheckCircle className="w-4 h-4" />;
      case 'self_report': return <Heart className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const filteredActions = civicActions
    .filter(action => {
      // Filter by type
      if (filter !== 'all' && action.type !== filter) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          action.title.toLowerCase().includes(searchLower) ||
          action.description.toLowerCase().includes(searchLower) ||
          action.type.toLowerCase().includes(searchLower) ||
          (action.organizationPartner && action.organizationPartner.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .filter(action => action.isActive);

  const handleCompleteAction = (actionId: string) => {
    const action = civicActions.find(a => a.id === actionId);
    if (!action) return;
    
    setSelectedAction(action);
    setCurrentStep(1);
  };
  
  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
    setShowCamera(false);
    setCurrentStep(3); // Move to verification step
  };
  
  const submitAction = async (action: CivicAction) => {
    if (!completeCivicAction) return;
    
    setIsSubmitting(true);
    
    try {
      // Create tasks for this civic action
      const actionTasks = generateCivicActionTasks(action);
      
      // Create a task list for this action
      const taskList = {
        id: `civic-action-${action.id}-${Date.now()}`,
        name: action.title,
        description: action.description,
        category: 'civic' as const,
        tasks: actionTasks,
        progress: 0,
        isCompleted: false,
        createdAt: new Date()
      };
      
      // Add task list to user's task lists
      addTaskList(taskList);
      
      // Complete the first task automatically
      if (actionTasks.length > 0) {
        completeTask(actionTasks[0].id, capturedPhoto || undefined);
      }
      
      // Complete the civic action
      completeCivicAction(action.id);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedAction(null);
        setCapturedPhoto(null);
        setShowSuccess(false);
        setCurrentStep(1);
      }, 3000);
    } catch (error) {
      console.error('Error completing action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterTypes: Array<{ id: 'all' | CivicAction['type'], name: string, icon: string }> = [
    { id: 'all', name: 'All Actions', icon: '🌟' },
    { id: 'cleanup', name: 'Cleanup', icon: '🧹' },
    { id: 'petition', name: 'Petitions', icon: '📝' },
    { id: 'volunteer', name: 'Volunteer', icon: '🤝' },
    { id: 'donation', name: 'Donations', icon: '💝' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'advocacy', name: 'Advocacy', icon: '📢' }
  ];

  const getLocationRecommendations = (actionType: CivicAction['type']): string[] => {
    switch (actionType) {
      case 'cleanup':
        return [
          'Local parks and green spaces',
          'Community beaches and waterfronts',
          'Public trails and hiking paths',
          'Neighborhood streets and sidewalks',
          'School grounds and playgrounds'
        ];
      case 'petition':
        return [
          'Community centers and libraries',
          'Farmers markets and local events',
          'College campuses and educational institutions',
          'Shopping centers and plazas',
          'Online platforms and social media'
        ];
      case 'volunteer':
        return [
          'Food banks and homeless shelters',
          'Animal shelters and rescue organizations',
          'Hospitals and healthcare facilities',
          'Senior centers and retirement homes',
          'Youth centers and after-school programs'
        ];
      case 'donation':
        return [
          'Thrift stores and donation centers',
          'Schools and educational foundations',
          'Religious organizations and places of worship',
          'Disaster relief collection points',
          'Online giving platforms and websites'
        ];
      case 'education':
        return [
          'Libraries and community learning centers',
          'Schools and universities',
          'Community centers and recreation facilities',
          'Online webinars and virtual events',
          'Local government meetings and town halls'
        ];
      case 'advocacy':
        return [
          'City hall and government buildings',
          'Community forums and public meetings',
          'Local business associations',
          'Social media and digital platforms',
          'Public squares and demonstration areas'
        ];
      default:
        return [
          'Community centers and public spaces',
          'Local organizations and non-profits',
          'Schools and educational institutions',
          'Parks and recreational areas',
          'Online platforms and digital communities'
        ];
    }
  };

  const findLocationTips = (actionType: CivicAction['type']): string[] => {
    switch (actionType) {
      case 'cleanup':
        return [
          'Contact your local parks department for cleanup permits and supplies',
          'Check community bulletin boards for organized cleanup events',
          'Use apps like "Clean Swell" or "Litterati" to find and track cleanup locations',
          'Join neighborhood social media groups to coordinate with others',
          'Look for areas with visible litter problems that need attention'
        ];
      case 'petition':
        return [
          'Research local issues that affect your community directly',
          'Connect with community organizers to understand current campaigns',
          'Check municipal websites for upcoming policy changes or developments',
          'Visit community centers to learn about neighborhood concerns',
          'Use platforms like Change.org to find existing petitions to support'
        ];
      case 'volunteer':
        return [
          'Check VolunteerMatch.org for opportunities in your area',
          'Contact local non-profits directly about their volunteer needs',
          'Visit community centers for volunteer bulletin boards',
          'Reach out to schools, hospitals, and religious organizations',
          'Look for seasonal volunteer opportunities (holidays, disasters, etc.)'
        ];
      case 'donation':
        return [
          'Research organizations with high charity ratings',
          'Look for donation drives at local schools and community centers',
          'Check social media for emergency donation needs',
          'Contact shelters directly to ask about their most-needed items',
          'Find food banks and clothing donation centers near you'
        ];
      case 'education':
        return [
          'Contact libraries about hosting educational workshops',
          'Reach out to schools about guest speaking opportunities',
          'Check community centers for educational program needs',
          'Look for mentoring programs seeking volunteers',
          'Find online platforms where you can share educational content'
        ];
      case 'advocacy':
        return [
          'Research upcoming city council and community board meetings',
          'Connect with established advocacy groups in your area',
          'Check local government websites for public comment opportunities',
          'Look for community forums discussing important local issues',
          'Find social media groups focused on community improvement'
        ];
      default:
        return [
          'Use community bulletin boards and social media groups',
          'Contact local government offices for information',
          'Visit community centers and libraries for opportunities',
          'Connect with neighborhood associations and groups',
          'Search online platforms specific to your interest area'
        ];
    }
  };
  
  // Generate tasks for a civic action
  const generateCivicActionTasks = (action: CivicAction): TaskItem[] => {
    const tasks: TaskItem[] = [];
    const now = new Date();
    const userId = user.id;
    
    // Task 1: Join the action (always first)
    tasks.push({
      id: `civic-${action.id}-join-${userId}-${now.getTime()}`,
      title: `Join: ${action.title}`,
      description: `Sign up to participate in this civic action`,
      category: 'civic',
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      rewards: {
        experience: 50,
        civicScore: 25
      },
      verificationMethod: 'self_report',
      verificationPrompt: 'Confirm that you want to join this civic action',
      isCompleted: false,
      createdAt: now,
      tags: ['civic', action.type, 'signup'],
      priority: 'high'
    });
    
    // Task 2: Prepare for the action
    tasks.push({
      id: `civic-${action.id}-prepare-${userId}-${now.getTime()}`,
      title: `Prepare for ${action.type === 'cleanup' ? 'Cleanup' : 
              action.type === 'petition' ? 'Petition Drive' :
              action.type === 'volunteer' ? 'Volunteering' :
              action.type === 'donation' ? 'Donation' :
              action.type === 'education' ? 'Education Event' : 'Advocacy'}`,
      description: `Gather necessary materials and information for this civic action`,
      category: 'civic',
      difficulty: 'easy',
      estimatedTime: '30 minutes',
      rewards: {
        experience: 75,
        civicScore: 35
      },
      verificationMethod: 'photo',
      verificationPrompt: 'Take a photo of your preparation for this civic action',
      isCompleted: false,
      createdAt: now,
      tags: ['civic', action.type, 'preparation'],
      priority: 'medium'
    });
    
    // Task 3: Participate in the action
    tasks.push({
      id: `civic-${action.id}-participate-${userId}-${now.getTime()}`,
      title: `Participate in ${action.title}`,
      description: `Actively participate in this civic action`,
      category: 'civic',
      difficulty: 'medium',
      estimatedTime: action.timeEstimate,
      rewards: {
        experience: 150,
        civicScore: 75
      },
      verificationMethod: action.verificationMethod,
      verificationPrompt: `Document your participation in this ${action.type} action`,
      isCompleted: false,
      createdAt: now,
      tags: ['civic', action.type, 'participation'],
      priority: 'high'
    });
    
    // Task 4: Share your experience
    tasks.push({
      id: `civic-${action.id}-share-${userId}-${now.getTime()}`,
      title: `Share Your ${action.type.charAt(0).toUpperCase() + action.type.slice(1)} Experience`,
      description: `Share your experience with others to inspire more civic engagement`,
      category: 'civic',
      difficulty: 'easy',
      estimatedTime: '15 minutes',
      rewards: {
        experience: 75,
        civicScore: 40
      },
      verificationMethod: 'photo',
      verificationPrompt: 'Take a screenshot of your shared experience (social media, message, etc.)',
      isCompleted: false,
      createdAt: now,
      tags: ['civic', action.type, 'sharing'],
      priority: 'low'
    });
    
    // Task 5: Reflect on impact (final task)
    tasks.push({
      id: `civic-${action.id}-reflect-${userId}-${now.getTime()}`,
      title: `Reflect on Your Civic Impact`,
      description: `Take time to reflect on how your participation made a difference`,
      category: 'civic',
      difficulty: 'easy',
      estimatedTime: '10 minutes',
      rewards: {
        experience: 50,
        civicScore: 25,
        lifeScore: 25
      },
      verificationMethod: 'self_report',
      verificationPrompt: "Confirm that you've reflected on your civic impact",
      isCompleted: false,
      createdAt: now,
      tags: ['civic', action.type, 'reflection'],
      priority: 'low'
    });
    
    return tasks;
  };

  // Render step content based on current step
  const renderStepContent = () => {
    if (!selectedAction) return null;
    
    const theme = getActionTheme(selectedAction.type);
    
    switch (currentStep) {
      case 1: // Join Action
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{selectedAction.title}</h3>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAction(null)}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
            
            <p className="text-gray-300">{selectedAction.description}</p>
            
            {selectedAction.organizationPartner && (
              <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                <div className="text-sm font-bold text-blue-300">Partner Organization</div>
                <div className="text-sm text-blue-200">{selectedAction.organizationPartner}</div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl">
                <div className="text-lg font-bold text-yellow-400">{selectedAction.impactPoints}</div>
                <div className="text-xs text-yellow-300">Impact Points</div>
              </div>
              <div className="text-center p-3 bg-purple-500/20 border border-purple-400/30 rounded-2xl">
                <div className="text-lg font-bold text-purple-400">{selectedAction.participantCount}</div>
                <div className="text-xs text-purple-300">Participants</div>
              </div>
            </div>
            
            {/* Action Steps */}
            <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <ListChecksIcon className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-cyan-300">Action Steps</h4>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: 1, title: "Join the action", desc: "Sign up to participate", active: true },
                  { step: 2, title: "Find a location", desc: `Choose where to complete this action`, active: false },
                  { step: 3, title: "Participate", desc: `Complete the ${selectedAction.type} activity`, active: false },
                  { step: 4, title: "Document", desc: "Take a photo as verification", active: false },
                  { step: 5, title: "Complete tasks", desc: "Finish all related tasks", active: false }
                ].map((step) => (
                  <div key={step.step} className={`flex items-start space-x-3 ${step.active ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      step.active ? 'bg-cyan-500/50 border border-cyan-400' : 'bg-cyan-500/20'
                    }`}>
                      <span className="text-xs font-bold text-cyan-300">{step.step}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{step.title}</div>
                      <div className="text-xs text-gray-400">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Warning about task creation */}
            <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div className="text-sm font-bold text-yellow-300">Action Tasks</div>
              </div>
              <p className="text-sm text-yellow-200 mt-1">
                Joining this action will create 5 tasks in your task list to help you track your progress.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentStep(2)}
              className="w-full py-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-2xl font-bold transition-all shadow-lg"
            >
              Join This Action
            </motion.button>
          </div>
        );
        
      case 2: // Find Location
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Find a Location</h3>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAction(null)}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Map className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-blue-300">Choose Your Location</h4>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Find a suitable location to complete this {selectedAction.type} action. Here are some recommendations:
              </p>
            </div>
            
            {/* Location Recommendations */}
            <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-2xl overflow-y-auto max-h-[200px]" style={{ scrollbarWidth: 'thin' }}>
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-green-400" />
                <h4 className="font-bold text-green-300">Recommended Locations</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {getLocationRecommendations(selectedAction.type).map((location, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Finding Tips */}
            <div className="p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl overflow-y-auto max-h-[200px]" style={{ scrollbarWidth: 'thin' }}>
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-4 h-4 text-yellow-400" />
                <h4 className="font-bold text-yellow-300">Finding the Perfect Spot</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {findLocationTips(selectedAction.type).map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(1)}
                className="flex-1 py-3 bg-gray-600 rounded-xl text-white font-medium"
              >
                Back
              </motion.button>
              
              {selectedAction.verificationMethod === 'photo' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCamera(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white font-bold"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => submitAction(selectedAction)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white font-bold"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Action</span>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        );
        
      case 3: // Verification
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Verify Participation</h3>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCapturedPhoto(null)}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
            
            <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
              <h4 className="font-bold text-blue-300 mb-2">{selectedAction.title}</h4>
              <p className="text-sm text-blue-200 mb-3">Verify your participation with this photo</p>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
              <img 
                src={capturedPhoto || ''} 
                alt="Verification" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-2xl text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-bold">Photo Captured!</p>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCapturedPhoto(null);
                    setShowCamera(true);
                  }}
                  className="flex-1 py-3 bg-gray-600 rounded-xl text-white font-medium"
                >
                  Retake
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => submitAction(selectedAction)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 modal-base flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] shadow-2xl border border-white/20 modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <div className="p-3 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Civic Action Hub
                  </h2>
                  <p className="text-sm text-gray-400">Make a positive impact in your community</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {!selectedAction ? (
              <>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search civic actions..."
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-400/50"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                  {filterTypes.map((filterType) => (
                    <motion.button
                      key={filterType.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(filterType.id)}
                      className={`px-4 py-2 rounded-2xl border-2 transition-all text-sm font-bold ${
                        filter === filterType.id
                          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                          : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{filterType.icon}</span>
                      {filterType.name}
                    </motion.button>
                  ))}
                </div>

                {/* Location-Agnostic Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-blue-300">Complete Actions Anywhere</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    All civic actions can be completed in your local community, no matter where you are. 
                    Each action includes recommendations for finding the perfect location near you.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-blue-300">
                    <MapPinOff className="w-4 h-4" />
                    <span>No specific location required</span>
                    <Compass className="w-4 h-4 ml-4" />
                    <span>Find opportunities anywhere</span>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="overflow-y-auto max-h-[calc(90vh-300px)]" style={{ scrollbarWidth: 'thin' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredActions.map((action, index) => {
                      const theme = getActionTheme(action.type);
                      const isCompleted = user.completedCivicActions.includes(action.id);
                      
                      return (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isCompleted
                              ? 'border-green-400/50 bg-green-500/20'
                              : `${theme.border} hover:${theme.border.replace('/50', '/70')} bg-black/40 hover:bg-black/60`
                          }`}
                          onClick={() => setSelectedAction(action)}
                        >
                          {/* Action Header */}
                          <div className="flex items-start space-x-3 mb-3">
                            <motion.div 
                              animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                              className={`p-3 rounded-2xl bg-gradient-to-br ${theme.gradient} text-white text-lg shadow-lg border border-white/20`}
                            >
                              {getActionIcon(action.type)}
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-sm mb-1">{action.title}</h3>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize bg-gradient-to-r ${theme.gradient} text-white`}>
                                  {action.type}
                                </span>
                                <div className="flex items-center space-x-1 text-xs text-yellow-400">
                                  <Award className="w-3 h-3" />
                                  <span>{action.impactPoints} pts</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-300 mb-3 line-clamp-2">{action.description}</p>

                          {/* Action Details */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{action.timeEstimate}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Users className="w-3 h-3" />
                                <span>{action.participantCount} joined</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              {getVerificationIcon(action.verificationMethod)}
                              <span>Verification: {action.verificationMethod.replace('_', ' ')}</span>
                            </div>
                          </div>

                          {/* Completion Status */}
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20"
                            >
                              <CheckCircle className="w-4 h-4 text-white fill-current" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Empty State */}
                  {filteredActions.length === 0 && (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-400 mb-2">No actions found</h3>
                      <p className="text-gray-500">Try adjusting your search or filter to find civic actions</p>
                    </div>
                  )}
                </div>
              </>
            ) : showSuccess ? (
              <div className="space-y-4 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white">Action Joined!</h3>
                <p className="text-gray-300">You've successfully joined this civic action</p>
                
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-purple-300">Rewards Earned</h4>
                  </div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Zap className="w-4 h-4" />
                      <span>+50 XP</span>
                    </div>
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <Heart className="w-4 h-4" />
                      <span>+25 Civic</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ListChecksIcon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-blue-300">Tasks Created</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Tasks for this action have been added to your task list. Complete them to earn additional rewards!
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSuccess(false);
                    setSelectedAction(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>View Tasks</span>
                  </div>
                </motion.button>
              </div>
            ) : (
              renderStepContent()
            )}

            {/* Camera Component */}
            <CameraCapture
              isOpen={showCamera}
              onClose={() => setShowCamera(false)}
              onCapture={handlePhotoCapture}
              prompt={selectedAction ? `Take a photo of your participation in this ${selectedAction.type} action` : ''}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};