import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { themes } from '../data/themes';
import { X, Palette, Sparkles, Zap, Waves, Sun, Leaf } from 'lucide-react';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { user, updateUserPreferences } = useGameStore();
  
  if (!user) return null;

  const handleThemeSelect = (themeId: string) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (selectedTheme) {
      updateUserPreferences({ selectedTheme });
    }
  };

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'neon-nexus': return <Zap className="w-6 h-6" />;
      case 'aurora-dreams': return <Sparkles className="w-6 h-6" />;
      case 'solar-flare': return <Sun className="w-6 h-6" />;
      case 'midnight-ocean': return <Waves className="w-6 h-6" />;
      case 'forest-guardian': return <Leaf className="w-6 h-6" />;
      default: return <Palette className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
                  <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Theme Nexus
                  </h2>
                  <p className="text-sm text-gray-400">Choose your visual experience</p>
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

            {/* Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme, index) => {
                const isSelected = user.preferences.selectedTheme?.id === theme.id;
                
                return (
                  <motion.button
                    key={theme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-cyan-400/50 bg-cyan-500/20 shadow-cyan-500/50 shadow-lg'
                        : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    {/* Theme Preview */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradients.primary} rounded-2xl opacity-10`} />
                    
                    <div className="relative">
                      {/* Theme Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <motion.div 
                          animate={isSelected ? { 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className={`p-3 rounded-2xl bg-gradient-to-br ${theme.gradients.primary} text-white shadow-lg border border-white/20`}
                        >
                          {getThemeIcon(theme.id)}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">{theme.name}</h3>
                          <p className="text-sm text-gray-400">{theme.description}</p>
                        </div>
                      </div>

                      {/* Color Palette Preview */}
                      <div className="flex space-x-2 mb-4">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                        <div className="flex-1" />
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20"
                          >
                            <span className="text-white text-xs">✓</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                          <span>{theme.animations.particles ? 'Particle Effects' : 'Clean Animations'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
                          <span>{theme.animations.morphing ? 'Morphing UI' : 'Stable UI'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-cyan-500 rounded-full" />
                          <span>Duration: {theme.animations.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
              <p className="text-sm text-gray-400 text-center">
                Themes change the entire visual experience of SignQuest. Each theme has unique colors, animations, and effects.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};