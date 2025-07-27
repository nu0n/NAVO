import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Plus, Target, Compass, Zap, Palette, Trophy, Heart, Star, Database, Users, Brain, Menu, X, Activity, Dice5 } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { AchievementSystem } from './AchievementSystem';
import { CivicActionHub } from './CivicActionHub';
import { LifeAchievementHub } from './LifeAchievementHub';
import { DataManagement } from './DataManagement';
import { SocialFeatures } from './SocialFeatures';
import { AICoach } from './AICoach';
import { AchievementTaskHub } from './AchievementTaskHub';
import { HealthIntegrationPanel } from './HealthIntegrationPanel';
import { UnifiedAchievementHub } from './UnifiedAchievementHub';
import { lifeAchievements } from '../data/lifeAchievements';

const ActionOrb = React.memo(({ 
  onClick, 
  disabled = false, 
  className, 
  children, 
  size = 'medium',
  badge = null,
  id
}: {
  onClick: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  badge?: React.ReactNode;
  id?: string;
}) => {
  const sizeClasses = {
    small: 'w-10 h-10 md:w-12 md:h-12',
    medium: 'w-12 h-12 md:w-14 md:h-14',
    large: 'w-16 h-16 md:w-20 md:h-20'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className="relative group"
      data-id={id}
    >
      <div className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center shadow-lg border border-white/20 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}>
        {children}
        {badge && (
          <div className="absolute -top-1 -right-1">
            {badge}
          </div>
        )}
      </div>
    </motion.button>
  );
});

export const GameUI: React.FC<{ onDiceRoll?: () => void }> = ({ onDiceRoll }) => {
  const { 
    setIsCreatingSign,
    userLocation,
    mapViewState,
    setMapViewState,
    user,
    syncTasksWithAchievements
  } = useGameStore();

  const [modals, setModals] = useState({
    theme: false,
    achievements: false,
    civic: false,
    life: false,
    data: false,
    social: false,
    ai: false,
    achievementTask: false,
    health: false,
    unified: false
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleModal = useCallback((modal: keyof typeof modals) => {
    // Close all other modals first
    const newModals = Object.keys(modals).reduce((acc, key) => {
      acc[key as keyof typeof modals] = false;
      return acc;
    }, {} as typeof modals);
    
    // Then toggle the selected modal
    newModals[modal] = !modals[modal];
    setModals(newModals);
    
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  }, [modals, showMobileMenu]);

  const handleCreateSign = useCallback(() => {
    if (!userLocation) {
      alert('Please enable location access to create signs at your current location.');
      return;
    }
    setIsCreatingSign(true);
  }, [userLocation, setIsCreatingSign]);

  const handleCenterOnPlayer = useCallback(() => {
    if (userLocation) {
      setMapViewState({
        ...mapViewState,
        longitude: userLocation[0],
        latitude: userLocation[1],
        zoom: 18,
        pitch: 60,
        bearing: 0
      });
    }
  }, [userLocation, mapViewState, setMapViewState]);

  const theme = useMemo(() => 
    user?.preferences.selectedTheme || { gradients: { primary: 'from-cyan-400 via-purple-500 to-pink-500' } }
  , [user?.preferences.selectedTheme]);

  const achievementBadge = useMemo(() => {
    if (!user || !user.currentLifeAchievements || user.currentLifeAchievements.length === 0) return null;
    return (
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-4 h-4 md:w-5 md:h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20"
      >
        {user.currentLifeAchievements.length}
      </motion.div>
    );
  }, [user?.currentLifeAchievements?.length]);

  const ageBadge = useMemo(() => {
    if (!user) return null;
    return (
      <motion.div
        animate={{ 
          y: [0, -3, 0],
          boxShadow: [
            "0 0 10px rgba(251, 191, 36, 0.5)",
            "0 0 20px rgba(251, 191, 36, 0.8)",
            "0 0 10px rgba(251, 191, 36, 0.5)"
          ]
        }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2, repeat: Infinity }
        }}
        className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border border-white/20 flex items-center justify-center shadow-lg"
      >
        <span className="text-xs font-black text-white">{user.currentAge}</span>
      </motion.div>
    );
  }, [user?.currentAge]);

  const taskBadge = useMemo(() => {
    if (!user || !user.currentTasks) return null;
    
    // Count incomplete tasks
    const incompleteTaskCount = user.currentTasks.filter(taskId => 
      !user.completedTasks?.includes(taskId)
    ).length;
    
    if (incompleteTaskCount === 0) return null;
    
    return (
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20"
      >
        {incompleteTaskCount}
      </motion.div>
    );
  }, [user?.currentTasks, user?.completedTasks]);

  const primaryActions = [
    { id: 'center', icon: Compass, action: handleCenterOnPlayer, color: 'from-cyan-400 to-blue-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'create', icon: Plus, action: handleCreateSign, color: theme.gradients.primary, size: 'large' as 'large', disabled: !userLocation, badge: undefined }
  ];

  const secondaryActions = [
    { id: 'ai', icon: Brain, action: () => toggleModal('ai'), color: 'from-blue-400 to-indigo-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'social', icon: Users, action: () => toggleModal('social'), color: 'from-pink-400 to-purple-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'unified', icon: Trophy, action: () => toggleModal('unified'), color: 'from-yellow-400 to-orange-600', size: 'medium' as 'medium', disabled: false, badge: achievementBadge },
    { id: 'civic', icon: Heart, action: () => toggleModal('civic'), color: 'from-green-400 to-emerald-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'health', icon: Activity, action: () => toggleModal('health'), color: 'from-green-400 to-blue-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'data', icon: Database, action: () => toggleModal('data'), color: 'from-blue-400 to-indigo-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'dice', icon: Dice5, action: () => onDiceRoll && onDiceRoll(), color: 'from-purple-400 to-cyan-600', size: 'medium' as 'medium', disabled: false, badge: undefined },
    { id: 'theme', icon: Palette, action: () => toggleModal('theme'), color: 'from-pink-400 to-rose-600', size: 'medium' as 'medium', disabled: false, badge: undefined }
  ];

  const MobileMenu = () => (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="mobile-menu absolute bottom-16 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl"
        >
          <div className="grid grid-cols-4 gap-3">
            {secondaryActions.map((action) => (
              <div key={action.id} className="flex flex-col items-center">
                <ActionOrb
                  onClick={() => {
                    action.action();
                    setShowMobileMenu(false);
                  }}
                  className={`bg-gradient-to-br ${action.color}`}
                  size="small"
                  badge={action.badge}
                  id={action.id}
                >
                  <action.icon className="w-4 h-4 text-white" />
                </ActionOrb>
                <span className="text-xs text-white mt-1 text-center capitalize">
                  {action.id === 'unified' ? 'Achievements' : action.id}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleTaskComplete = (task: TaskItem) => {
    if (task.verificationMethod === 'photo' || task.verificationMethod === 'selfie') {
      setSelectedTask(task);
      setShowPhotoCapture(true);
    } else {
      completeTask(task.id);
      // Sync after task completion
      setTimeout(() => {
        syncTasksWithAchievements();
      }, 100);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-10 menu-base">
        <div className="md:hidden">
          <div className="flex justify-center items-center space-x-4 mb-3">
            {primaryActions.map((action) => (
              <ActionOrb
                key={action.id}
                onClick={action.action}
                disabled={action.disabled}
                className={`bg-gradient-to-br ${action.color}`}
                size={action.size || 'medium'}
                id={action.id}
              >
                <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </ActionOrb>
            ))}
          </div>

          <div className="flex justify-center">
            <ActionOrb
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="bg-gradient-to-br from-gray-600 to-gray-800"
              id="menu-toggle"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </ActionOrb>
          </div>

          <MobileMenu />
        </div>

        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-0 w-[700px] h-20 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl mx-auto" />
            
            <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-2xl max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full" />
              
              <div className="relative flex items-center justify-center space-x-3">
                {[...primaryActions.slice(0, 1), ...secondaryActions.slice(0, 3), ...primaryActions.slice(1), ...secondaryActions.slice(3)].map((action) => (
                  <ActionOrb
                    key={action.id}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`${
                      userLocation || action.id !== 'create'
                        ? `bg-gradient-to-br ${action.color}` 
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                    }`}
                    size={action.size || 'medium'}
                    badge={action.badge}
                    id={action.id}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </ActionOrb>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {modals.theme && <ThemeSelector isOpen={modals.theme} onClose={() => toggleModal('theme')} />}
        {modals.achievements && <AchievementSystem isOpen={modals.achievements} onClose={() => toggleModal('achievements')} />}
        {modals.civic && <CivicActionHub isOpen={modals.civic} onClose={() => toggleModal('civic')} />}
        {modals.life && <LifeAchievementHub isOpen={modals.life} onClose={() => toggleModal('life')} />}
        {modals.data && <DataManagement isOpen={modals.data} onClose={() => toggleModal('data')} />}
        {modals.social && <SocialFeatures isOpen={modals.social} onClose={() => toggleModal('social')} />}
        {modals.ai && <AICoach isOpen={modals.ai} onClose={() => toggleModal('ai')} />}
        {modals.achievementTask && <AchievementTaskHub isOpen={modals.achievementTask} onClose={() => toggleModal('achievementTask')} />}
        {modals.health && <HealthIntegrationPanel isOpen={modals.health} onClose={() => toggleModal('health')} />}
        {modals.unified && <UnifiedAchievementHub isOpen={modals.unified} onClose={() => toggleModal('unified')} />}
      </AnimatePresence>
    </>
  );
};