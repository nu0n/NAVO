import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { X, MapPin, Camera, Type, Tag, AlertTriangle, Clock, Users, ChevronUp, ChevronDown, Zap, Sparkles, Heart, MessageSquare } from 'lucide-react';
import { Sign } from '../types';
import { MessageSelector } from './MessageSelector';
import { CameraCapture } from './CameraCapture';

// Move categories array outside component to avoid initialization issues
const categories = [
  { 
    id: 'poi', 
    name: 'Point of Interest', 
    icon: '🎯', 
    color: 'bg-blue-500',
    description: 'Museums, landmarks, attractions',
    gradient: 'from-blue-400 via-cyan-500 to-teal-500',
    glow: 'shadow-blue-500/50'
  },
  { 
    id: 'danger', 
    name: 'Danger Zone', 
    icon: '⚠️', 
    color: 'bg-red-500',
    description: 'High crime areas, construction zones',
    gradient: 'from-red-400 via-pink-500 to-orange-500',
    glow: 'shadow-red-500/50'
  },
  { 
    id: 'group', 
    name: 'Group Activity', 
    icon: '👥', 
    color: 'bg-green-500',
    description: 'Events, meetups, gatherings',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    glow: 'shadow-green-500/50'
  },
  { 
    id: 'safe', 
    name: 'Safe Zone', 
    icon: '🛡️', 
    color: 'bg-emerald-500',
    description: 'Police stations, hospitals, embassies',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50'
  },
  { 
    id: 'resource', 
    name: 'Resource Hub', 
    icon: '🏪', 
    color: 'bg-purple-500',
    description: 'ATMs, WiFi, restrooms, food',
    gradient: 'from-purple-400 via-violet-500 to-indigo-500',
    glow: 'shadow-purple-500/50'
  },
  { 
    id: 'event', 
    name: 'Live Event', 
    icon: '🎉', 
    color: 'bg-orange-500',
    description: 'Festivals, concerts, temporary events',
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    glow: 'shadow-orange-500/50'
  },
  { 
    id: 'route', 
    name: 'Route Info', 
    icon: '🛣️', 
    color: 'bg-indigo-500',
    description: 'Traffic, road closures, shortcuts',
    gradient: 'from-indigo-400 via-purple-500 to-pink-500',
    glow: 'shadow-indigo-500/50'
  },
  { 
    id: 'warning', 
    name: 'Warning', 
    icon: '🚨', 
    color: 'bg-yellow-500',
    description: 'Weather alerts, temporary hazards',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    glow: 'shadow-yellow-500/50'
  },
  { 
    id: 'civic', 
    name: 'Civic Action', 
    icon: '🏛️', 
    color: 'bg-green-600',
    description: 'Community service, volunteering, petitions',
    gradient: 'from-green-500 via-emerald-600 to-teal-700',
    glow: 'shadow-green-600/50'
  },
  { 
    id: 'environmental', 
    name: 'Environmental', 
    icon: '🌱', 
    color: 'bg-green-700',
    description: 'Cleanup drives, tree planting, conservation',
    gradient: 'from-green-600 via-emerald-700 to-teal-800',
    glow: 'shadow-green-700/50'
  },
  { 
    id: 'community', 
    name: 'Community', 
    icon: '🤝', 
    color: 'bg-blue-600',
    description: 'Neighborhood meetings, local initiatives',
    gradient: 'from-blue-500 via-indigo-600 to-purple-700',
    glow: 'shadow-blue-600/50'
  },
  { 
    id: 'petition', 
    name: 'Petition Drive', 
    icon: '📝', 
    color: 'bg-purple-600',
    description: 'Government petitions, policy changes',
    gradient: 'from-purple-500 via-violet-600 to-indigo-700',
    glow: 'shadow-purple-600/50'
  }
];

export const SignCreationBottomSheet: React.FC = () => {
  const { 
    isCreatingSign, 
    setIsCreatingSign, 
    userLocation, 
    addSign, 
    user 
  } = useGameStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Sign['category'] | null>(null);
  const [dragY, setDragY] = useState(0);
  const [showMessageSelector, setShowMessageSelector] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'poi' as Sign['category'],
    imageUrl: '',
    zoneType: 'point' as Sign['zoneType'],
    radius: 50,
    alertDistance: 100,
    severity: 'medium' as Sign['severity'],
    timeRestriction: {
      startTime: '',
      endTime: '',
      days: [] as number[]
    },
    civicAction: {
      type: 'cleanup' as 'cleanup' | 'petition' | 'volunteer' | 'donation' | 'education' | 'advocacy',
      impactPoints: 100,
      verificationRequired: false,
      organizationPartner: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when closing
  useEffect(() => {
    if (!isCreatingSign) {
      setIsExpanded(false);
      setSelectedCategory(null);
      setSelectedMessage('');
      setCapturedImage(null);
      setFormData({
        title: '',
        description: '',
        category: 'poi',
        imageUrl: '',
        zoneType: 'point',
        radius: 50,
        alertDistance: 100,
        severity: 'medium',
        timeRestriction: {
          startTime: '',
          endTime: '',
          days: []
        },
        civicAction: {
          type: 'cleanup',
          impactPoints: 100,
          verificationRequired: false,
          organizationPartner: ''
        }
      });
    }
  }, [isCreatingSign]);

  const handleCategorySelect = (category: Sign['category']) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category });
    setIsExpanded(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || (info.velocity.y >= 0 && info.offset.y > 100);
    
    if (shouldClose && isExpanded) {
      setIsExpanded(false);
      setSelectedCategory(null);
    } else if (shouldClose && !isExpanded) {
      setIsCreatingSign(false);
    }
    
    setDragY(0);
  };

  const handleMessageSelect = (messageTemplate: any) => {
    setSelectedMessage(messageTemplate.text);
    setFormData({
      ...formData,
      title: messageTemplate.text,
      description: `${messageTemplate.text} ${messageTemplate.icon}`
    });
  };

  const handleCapturePhoto = (photoData: string) => {
    setCapturedImage(photoData);
    setFormData({
      ...formData,
      imageUrl: photoData
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation || !user || !selectedMessage) return;
    
    setIsSubmitting(true);
    
    try {
      const newSign: Sign = {
        id: `sign-${Date.now()}`,
        title: selectedMessage,
        description: selectedMessage,
        category: formData.category,
        imageUrl: formData.imageUrl || undefined,
        latitude: userLocation[1],
        longitude: userLocation[0],
        likes: 0,
        isHighlighted: formData.category === 'danger' || formData.category === 'warning',
        createdBy: user.username,
        createdAt: new Date(),
        zoneType: formData.zoneType,
        radius: formData.zoneType === 'area' ? formData.radius : undefined,
        alertDistance: formData.alertDistance,
        severity: formData.severity,
        isActive: true,
        timeRestriction: (formData.timeRestriction.startTime || formData.timeRestriction.endTime || formData.timeRestriction.days.length > 0) 
          ? formData.timeRestriction 
          : undefined,
        civicAction: ['civic', 'environmental', 'community', 'petition'].includes(formData.category) 
          ? formData.civicAction 
          : undefined
      };

      addSign(newSign);
      setIsCreatingSign(false);
    } catch (error) {
      console.error('Error creating sign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreatingSign) return null;

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const isCivicCategory = ['civic', 'environmental', 'community', 'petition'].includes(selectedCategory || '');

  // Get theme colors
  const theme = user?.preferences.selectedTheme || { gradients: { primary: 'from-cyan-400 via-purple-500 to-pink-500' } };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 modal-base"
        onClick={() => setIsCreatingSign(false)}
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ y: "100%" }}
          animate={{ 
            y: isExpanded ? "5%" : "50%",
            transition: { type: "spring", damping: 30, stiffness: 300 }
          }}
          exit={{ y: "100%" }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-2xl rounded-t-3xl shadow-2xl overflow-hidden border-t border-white/20 max-h-[90vh]"
          style={{ y: dragY }}
        >
          {/* Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${theme.gradients.primary} opacity-20`}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Drag Handle with Glow */}
          <div className="flex justify-center pt-4 pb-2">
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 10px rgba(236, 72, 153, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-12 h-1.5 bg-gradient-to-r ${theme.gradients.primary} rounded-full`}
            />
          </div>

          {/* Header */}
          <div className="relative px-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <motion.h2 
                  className={`text-xl font-black bg-gradient-to-r ${theme.gradients.primary} bg-clip-text text-transparent`}
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34, 211, 238, 0.5)",
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                      "0 0 10px rgba(236, 72, 153, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {selectedCategory ? 'Create Navigation Point' : 'Choose Category'}
                </motion.h2>
                <p className="text-sm text-gray-400">
                  {selectedCategory ? 'Select a predefined message' : 'What type of point do you want to create?'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedCategory && (
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white" />}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingSign(false)}
                  className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="relative px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]" style={{ scrollbarWidth: 'thin' }}>
            {!selectedCategory ? (
              /* Category Selection with Holographic Cards */
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(category.id as Sign['category'])}
                    className="relative group"
                  >
                    {/* Card Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                    
                    <div className="relative p-4 rounded-2xl border border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 transition-all text-left backdrop-blur-sm">
                      <div className="flex items-center space-x-3 mb-3">
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
                          className={`p-3 rounded-2xl bg-gradient-to-br ${category.gradient} text-white text-lg shadow-lg border border-white/20`}
                        >
                          {category.icon}
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-white">{category.name}</div>
                          {['civic', 'environmental', 'community', 'petition'].includes(category.id) && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Heart className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-300 font-bold">Civic Impact</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{category.description}</div>
                      
                      {/* Floating Particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                          style={{
                            left: `${30 + i * 20}%`,
                            top: `${20 + i * 15}%`,
                          }}
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              /* Form with Message Selection */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Category Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  {/* Category Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategoryData?.gradient} rounded-2xl blur-lg opacity-20`} />
                  
                  <div className="relative flex items-center space-x-3 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className={`p-3 rounded-2xl bg-gradient-to-br ${selectedCategoryData?.gradient} text-white text-xl shadow-lg border border-white/20`}
                    >
                      {selectedCategoryData?.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{selectedCategoryData?.name}</div>
                      <div className="text-sm text-gray-400">{selectedCategoryData?.description}</div>
                      {isCivicCategory && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Heart className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-300 font-bold">+{formData.civicAction.impactPoints} Civic Points</span>
                        </div>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsExpanded(false);
                      }}
                      className="p-2 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                </motion.div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    {/* Message Selection */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-bold text-white mb-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>Select Message</span>
                      </label>
                      
                      {!selectedMessage ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowMessageSelector(true)}
                          className="w-full p-4 bg-black/60 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-2xl hover:border-cyan-400/50 transition-all text-gray-400 hover:text-cyan-300"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <MessageSquare className="w-5 h-5" />
                            <span>Choose a predefined message</span>
                          </div>
                        </motion.button>
                      ) : (
                        <div className="relative">
                          <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-300 font-bold">Selected Message:</span>
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowMessageSelector(true)}
                                className="text-xs px-2 py-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-lg text-cyan-200 transition-colors"
                              >
                                Change
                              </motion.button>
                            </div>
                            <p className="text-white mt-2 font-medium">{selectedMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-bold text-white mb-2">
                        <Camera className="w-4 h-4 text-pink-400" />
                        <span>Add Photo (Optional)</span>
                      </label>
                      
                      {!capturedImage ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCamera(true)}
                          className="w-full p-4 bg-black/60 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-2xl hover:border-pink-400/50 transition-all text-gray-400 hover:text-pink-300"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Camera className="w-5 h-5" />
                            <span>Take a photo or upload image</span>
                          </div>
                        </motion.button>
                      ) : (
                        <div className="relative">
                          <div className="p-4 bg-pink-500/20 border border-pink-400/30 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Camera className="w-4 h-4 text-pink-400" />
                                <span className="text-pink-300 font-bold">Photo Added</span>
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCapturedImage(null)}
                                className="text-xs px-2 py-1 bg-pink-500/30 hover:bg-pink-500/50 rounded-lg text-pink-200 transition-colors"
                              >
                                Remove
                              </motion.button>
                            </div>
                            <div className="relative rounded-xl overflow-hidden aspect-video">
                              <img 
                                src={capturedImage} 
                                alt="Sign" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Civic Action Specific Fields */}
                    {isCivicCategory && (
                      <div className="space-y-4 p-4 bg-green-500/10 border border-green-400/30 rounded-2xl">
                        <h4 className="font-bold text-green-300 flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>Civic Impact Settings</span>
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-green-300 mb-2 block">Impact Points</label>
                            <input
                              type="number"
                              value={formData.civicAction.impactPoints}
                              onChange={(e) => setFormData({
                                ...formData,
                                civicAction: { ...formData.civicAction, impactPoints: parseInt(e.target.value) || 100 }
                              })}
                              min="50"
                              max="500"
                              className="w-full px-3 py-2 bg-black/60 border border-green-400/30 rounded-xl text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-bold text-green-300 mb-2 block">Organization Partner</label>
                            <input
                              type="text"
                              value={formData.civicAction.organizationPartner}
                              onChange={(e) => setFormData({
                                ...formData,
                                civicAction: { ...formData.civicAction, organizationPartner: e.target.value }
                              })}
                              placeholder="Optional"
                              className="w-full px-3 py-2 bg-black/60 border border-green-400/30 rounded-xl text-white placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button with Holographic Effect */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting || !selectedMessage}
                        className="relative w-full group"
                      >
                        {/* Button Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategoryData?.gradient || theme.gradients.primary} rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity`} />
                        
                        <div className={`relative px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border border-white/20 ${
                          selectedCategoryData 
                            ? `bg-gradient-to-r ${selectedCategoryData.gradient} hover:shadow-xl text-white`
                            : `bg-gradient-to-r ${theme.gradients.primary} text-white`
                        } disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed`}>
                          <motion.span
                            animate={!isSubmitting ? { 
                              textShadow: [
                                "0 0 10px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.8)",
                                "0 0 10px rgba(255,255,255,0.5)"
                              ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {isSubmitting ? 'Creating Navigation Point...' : `Create ${selectedCategoryData?.name}`}
                            {isCivicCategory && !isSubmitting && ' 🌟'}
                          </motion.span>
                          
                          {/* Loading Particles */}
                          {isSubmitting && [...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${40 + i * 10}%`,
                                top: "50%",
                              }}
                              animate={{
                                y: [0, -10, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Quick Create Button (when not expanded) */}
                {!isExpanded && selectedMessage && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsExpanded(true)}
                    className="relative w-full group"
                  >
                    {/* Button Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategoryData?.gradient || theme.gradients.primary} rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity`} />
                    
                    <div className={`relative px-6 py-4 rounded-2xl font-bold transition-all shadow-lg border border-white/20 ${
                      selectedCategoryData 
                        ? `bg-gradient-to-r ${selectedCategoryData.gradient} hover:shadow-xl text-white`
                        : `bg-gradient-to-r ${theme.gradients.primary} text-white`
                    }`}>
                      <motion.span
                        animate={{ 
                          textShadow: [
                            "0 0 10px rgba(255,255,255,0.5)",
                            "0 0 20px rgba(255,255,255,0.8)",
                            "0 0 10px rgba(255,255,255,0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Continue with {selectedCategoryData?.name}
                        {isCivicCategory && ' 🌟'}
                      </motion.span>
                    </div>
                  </motion.button>
                )}
              </form>
            )}
          </div>
        </motion.div>

        {/* Message Selector Modal */}
        {showMessageSelector && (
          <MessageSelector
            isOpen={showMessageSelector}
            onClose={() => setShowMessageSelector(false)}
            onSelectMessage={handleMessageSelect}
            signCategory={selectedCategory || undefined}
            title="Choose Your Message"
            description="Select a predefined message for your navigation point"
          />
        )}

        {/* Camera Component */}
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handleCapturePhoto}
          prompt="Take a photo for your navigation point"
        />
      </motion.div>
    </AnimatePresence>
  );
};