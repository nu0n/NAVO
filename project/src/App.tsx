import React, { useEffect, useState, useMemo, useRef } from 'react';
import { GameMap } from './components/GameMap';
import { PlayerStats } from './components/PlayerStats';
import { GameUI } from './components/GameUI';
import { AvatarCustomization } from './components/AvatarCustomization';
import { SignCreationBottomSheet } from './components/SignCreationBottomSheet';
import { NavigationAlerts } from './components/NavigationAlerts';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DataPromptModal } from './components/DataPromptModal';
import { BoltBadge } from './components/BoltBadge';
import { ProgressTab } from './components/ProgressTab';
import { useGameStore } from './store/gameStore';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getRelevantPrompts, shouldShowDataPrompt } from './data/dataPrompts';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const LoadingScreen = React.memo(() => (
  <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex items-center justify-center z-50">
    {/* Animated Background Particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
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
            scale: [0.5, 1.2, 0.5],
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

    {/* Holographic Grid Background */}
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
    </div>

    {/* Main Loading Content */}
    <div className="relative text-center z-10">
      {/* Rotating Logo */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="text-8xl mb-8 relative"
      >
        <motion.div
          animate={{
            textShadow: [
              "0 0 20px rgba(0, 212, 255, 0.5)",
              "0 0 40px rgba(168, 85, 247, 0.7)",
              "0 0 20px rgba(236, 72, 153, 0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌟
        </motion.div>
        
        {/* Orbital Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-cyan-400/20 rounded-full"
            style={{
              width: `${120 + i * 20}px`,
              height: `${120 + i * 20}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
      
      {/* App Title */}
      <motion.h1 
        className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      >
        CIVIL
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p 
        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-md mx-auto"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Your Life Achievement Guide
      </motion.p>
      
      {/* Loading Progress Bar */}
      <div className="w-80 mx-auto mb-6">
        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-400/30">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
            animate={{ 
              x: ["-100%", "100%"],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.p 
          className="text-sm text-gray-500 mt-3 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing your personalized experience...
        </motion.p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          { icon: '🎯', text: 'Age-Based Goals', delay: 0 },
          { icon: '💪', text: 'Health Tracking', delay: 0.2 },
          { icon: '🚀', text: 'Career Growth', delay: 0.4 },
          { icon: '🤖', text: 'AI Personalized', delay: 0.6 }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.6 }}
            className="p-4 bg-gradient-to-r from-black/40 to-gray-900/40 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <motion.div 
              className="text-3xl mb-2"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: feature.delay 
              }}
            >
              {feature.icon}
            </motion.div>
            <div className="text-sm font-bold text-white">{feature.text}</div>
          </motion.div>
        ))}
      </div>

      {/* Pulsing Dots */}
      <div className="flex justify-center space-x-2 mt-8">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>

    {/* Corner Accents */}
    <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400/30 rounded-tl-lg" />
    <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/30 rounded-tr-lg" />
    <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-pink-400/30 rounded-bl-lg" />
    <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400/30 rounded-br-lg" />
  </div>
));

function App() {
  const { 
    setUserLocation, 
    setMapViewState, 
    mapViewState, 
    user, 
    showOnboarding, 
    showDataPrompt,
    currentDataPrompt,
    setShowDataPrompt,
    completeOnboarding,
    isInitialized
  } = useGameStore();

  const { isInitialized: storageInitialized } = useLocalStorage();
  const [hasCheckedDataPrompt, setHasCheckedDataPrompt] = useState(false);
  const [showCopyright, setShowCopyright] = useState(true);
  const gameMapRef = useRef<any>(null);
  const mapViewStateRef = useRef(mapViewState);

  // Update ref when mapViewState changes
  useEffect(() => {
    mapViewStateRef.current = mapViewState;
  }, [mapViewState]);

  const handleGeolocation = useMemo(() => {
    if (!user || !isInitialized || !navigator.geolocation) return null;

    return () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setMapViewState({
            ...mapViewStateRef.current,
            longitude,
            latitude,
            zoom: 18,
            pitch: 60,
            bearing: 0
          });
        },
        (error) => {
          setUserLocation([-73.9851, 40.7589]);
          setMapViewState({
            ...mapViewStateRef.current,
            longitude: -73.9851,
            latitude: 40.7589,
            zoom: 18,
            pitch: 60,
            bearing: 0
          });
        }
      );
    };
  }, [user, isInitialized, setUserLocation, setMapViewState]);

  useEffect(() => {
    if (handleGeolocation) {
      handleGeolocation();
    }
  }, [handleGeolocation]);

  useEffect(() => {
    if (user && !showOnboarding && !hasCheckedDataPrompt && isInitialized) {
      setHasCheckedDataPrompt(true);
      
      if (shouldShowDataPrompt(user)) {
        const relevantPrompts = getRelevantPrompts(user.missingDataFields, user.currentAge);
        if (relevantPrompts.length > 0) {
          setShowDataPrompt(true, relevantPrompts[0]);
        }
      }
    }
  }, [user, showOnboarding, hasCheckedDataPrompt, isInitialized, setShowDataPrompt]);

  // Hide copyright after 3 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCopyright(false);
    }, 180000); // 3 minutes = 180000 milliseconds

    return () => clearTimeout(timer);
  }, []);

  const handleDiceRoll = () => {
    if (gameMapRef.current && gameMapRef.current.diceRollForSigns) {
      gameMapRef.current.diceRollForSigns();
    }
  };

  if (!isInitialized || !storageInitialized) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none" />
      
      <OnboardingFlow 
        isOpen={showOnboarding} 
        onComplete={completeOnboarding}
      />
      
      {currentDataPrompt && (
        <DataPromptModal
          isOpen={showDataPrompt}
          onClose={() => setShowDataPrompt(false)}
          prompt={currentDataPrompt}
        />
      )}
      
      {user && (
        <>
          <GameMap ref={gameMapRef} />
          <NavigationAlerts />
          <PlayerStats />
          <GameUI onDiceRoll={handleDiceRoll} />
          <AvatarCustomization />
          <SignCreationBottomSheet />
          <ProgressTab />
          {/* Copyright Disclaimer */}
          {showCopyright && (
            <motion.div 
              className="fixed bottom-1 left-1 z-30 pointer-events-none flex items-center space-x-1"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/60 text-gray-300 text-[10px] px-2 py-0.5 rounded-full shadow-lg pointer-events-auto flex items-center space-x-1">
                <a
                  href="https://x.com/n_lore97"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold tracking-wide hover:text-cyan-300 transition-colors pointer-events-auto"
                  title="Follow LORË on X"
                >
                  © LORË
                </a>
                <a
                  href="https://buymeacoffee.com/n.lore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 flex items-center text-yellow-300 hover:text-yellow-400 transition-colors pointer-events-auto"
                  title="Support us with a tip!"
                >
                  <Coffee className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </>
      )}
      
      {/* Bolt Badge */}
      <BoltBadge />

      {/* Hide only the left Mapbox attribution bar, keep the logo */}
      <style>{`
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default App;