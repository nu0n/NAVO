import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { healthIntegration } from '../services/healthIntegration';
import { 
  X, 
  Activity, 
  Heart, 
  Footprints, 
  Flame, 
  Moon, 
  Scale, 
  Plus,
  ArrowRight,
  RefreshCw,
  Smartphone,
  Bluetooth,
  CheckCircle,
  Zap,
  Award,
  Target
} from 'lucide-react';

interface HealthIntegrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthIntegrationPanel: React.FC<HealthIntegrationPanelProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useGameStore();
  const [healthData, setHealthData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedApp, setConnectedApp] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    steps: 0,
    calories: 0,
    sleepHours: 0,
    workouts: 0,
    weight: 0
  });

  useEffect(() => {
    if (isOpen) {
      refreshHealthData();
    }
  }, [isOpen]);

  const refreshHealthData = () => {
    const todayData = healthIntegration.getTodaysData();
    setHealthData(todayData);
    
    const weekly = healthIntegration.getWeeklyData();
    setWeeklyData(weekly);
    
    const healthInsights = healthIntegration.getHealthInsights();
    setInsights(healthInsights);
  };

  const handleConnectApp = async (appName: 'googlefit' | 'applehealth' | 'fitbit' | 'strava') => {
    setIsConnecting(true);
    
    try {
      const success = await healthIntegration.connectToFitnessApp(appName);
      if (success) {
        setConnectedApp(appName);
        refreshHealthData();
        
        // Update user profile with health data
        if (user && healthData) {
          updateUserProfile({
            healthProfile: {
              ...user.healthProfile,
              lastHealthUpdate: new Date(),
              currentWeight: healthData.weight || user.healthProfile.currentWeight,
              sleepHours: healthData.sleepHours || user.healthProfile.sleepHours
            }
          });
        }
      }
    } catch (error) {
      console.error('Error connecting to fitness app:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualSubmit = () => {
    healthIntegration.addManualEntry(manualEntry);
    refreshHealthData();
    setShowManualEntry(false);
    
    // Update user profile with manual data
    if (user) {
      updateUserProfile({
        healthProfile: {
          ...user.healthProfile,
          lastHealthUpdate: new Date(),
          currentWeight: manualEntry.weight || user.healthProfile.currentWeight,
          sleepHours: manualEntry.sleepHours || user.healthProfile.sleepHours
        }
      });
    }
  };

  const getMaxSteps = () => {
    if (weeklyData.length === 0) return 10000;
    return Math.max(...weeklyData.map((d: any) => d.steps), 10000);
  };

  if (!user || !isOpen) return null;

  return (
    <AnimatePresence>
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
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Health Tracking
                </h2>
                <p className="text-sm text-gray-400">
                  {connectedApp ? `Connected to ${connectedApp}` : 'Track your health metrics'}
                </p>
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

          {/* Today's Stats */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Today's Activity</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshHealthData}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
            </div>

            {healthData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Footprints className="w-5 h-5 text-blue-400" />
                    <div className="text-sm font-bold text-blue-300">Steps</div>
                  </div>
                  <div className="text-2xl font-black text-white">{healthData.steps.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Goal: 10,000</div>
                  <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (healthData.steps / 10000) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>

                {healthData.calories && (
                  <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <div className="text-sm font-bold text-orange-300">Calories</div>
                    </div>
                    <div className="text-2xl font-black text-white">{healthData.calories}</div>
                    <div className="text-xs text-gray-400 mt-1">Active calories burned</div>
                  </div>
                )}

                {healthData.sleepHours && (
                  <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <div className="text-sm font-bold text-indigo-300">Sleep</div>
                    </div>
                    <div className="text-2xl font-black text-white">{healthData.sleepHours.toFixed(1)}h</div>
                    <div className="text-xs text-gray-400 mt-1">Goal: 8 hours</div>
                    <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (healthData.sleepHours / 8) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {healthData.heartRate && (
                  <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <div className="text-sm font-bold text-red-300">Heart Rate</div>
                    </div>
                    <div className="text-2xl font-black text-white">{healthData.heartRate} bpm</div>
                    <div className="text-xs text-gray-400 mt-1">Resting heart rate</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">No health data yet</h3>
                <p className="text-gray-500">Connect a fitness app or enter data manually</p>
              </div>
            )}
          </div>

          {/* Weekly Progress */}
          {weeklyData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
              
              <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
                <div className="flex items-end justify-between h-40 mb-2">
                  {weeklyData.map((day: any, index: number) => {
                    const dayName = new Date(day.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
                    const percentage = (day.steps / getMaxSteps()) * 100;
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          className="w-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg"
                        />
                        <div className="text-xs text-gray-400 mt-2">{dayName}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Health Insights */}
          {insights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Health Insights</h3>
              
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl"
                  >
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-green-400 mt-0.5" />
                      <p className="text-sm text-gray-200">{insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Connect Apps */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Connect Health Apps</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Google Fit', id: 'googlefit', icon: <Smartphone className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
                { name: 'Apple Health', id: 'applehealth', icon: <Heart className="w-6 h-6" />, color: 'from-red-400 to-pink-600' },
                { name: 'Fitbit', id: 'fitbit', icon: <Activity className="w-6 h-6" />, color: 'from-teal-400 to-green-600' },
                { name: 'Strava', id: 'strava', icon: <Zap className="w-6 h-6" />, color: 'from-orange-400 to-red-600' }
              ].map((app) => (
                <motion.button
                  key={app.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnectApp(app.id as any)}
                  disabled={isConnecting || connectedApp === app.id}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    connectedApp === app.id
                      ? 'border-green-400/50 bg-green-500/20'
                      : `border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60`
                  }`}
                >
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${app.color}`}>
                    {app.icon}
                  </div>
                  <div className="font-bold text-white mt-2">{app.name}</div>
                  <div className="text-xs mt-1">
                    {connectedApp === app.id ? (
                      <span className="text-green-400 flex items-center justify-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Tap to connect</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Manual Entry */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Manual Entry</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-300 text-sm"
              >
                {showManualEntry ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showManualEntry ? 'Cancel' : 'Add Data'}</span>
              </motion.button>
            </div>

            {showManualEntry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/40 rounded-2xl p-4 border border-white/10 mb-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Steps</label>
                    <input
                      type="number"
                      value={manualEntry.steps}
                      onChange={(e) => setManualEntry({...manualEntry, steps: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Calories</label>
                    <input
                      type="number"
                      value={manualEntry.calories}
                      onChange={(e) => setManualEntry({...manualEntry, calories: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Sleep (hours)</label>
                    <input
                      type="number"
                      value={manualEntry.sleepHours}
                      onChange={(e) => setManualEntry({...manualEntry, sleepHours: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white"
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Workouts</label>
                    <input
                      type="number"
                      value={manualEntry.workouts}
                      onChange={(e) => setManualEntry({...manualEntry, workouts: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={manualEntry.weight}
                      onChange={(e) => setManualEntry({...manualEntry, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManualSubmit}
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white font-medium"
                >
                  Save Health Data
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Health Goals */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Health Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Daily Steps', target: 10000, current: healthData?.steps || 0, unit: 'steps', icon: <Footprints className="w-5 h-5" />, color: 'from-blue-400 to-cyan-500' },
                { name: 'Sleep Quality', target: 8, current: healthData?.sleepHours || 0, unit: 'hours', icon: <Moon className="w-5 h-5" />, color: 'from-indigo-400 to-purple-500' },
                { name: 'Weekly Workouts', target: 3, current: weeklyData.reduce((sum, day) => sum + (day.workouts || 0), 0), unit: 'sessions', icon: <Activity className="w-5 h-5" />, color: 'from-green-400 to-teal-500' },
                { name: 'Active Calories', target: 2000, current: healthData?.calories || 0, unit: 'kcal', icon: <Flame className="w-5 h-5" />, color: 'from-orange-400 to-red-500' }
              ].map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color}`}>
                        {goal.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{goal.name}</h4>
                        <p className="text-xs text-gray-400">Target: {goal.target} {goal.unit}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">{goal.current}</div>
                  </div>
                  
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                      className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                    <span>{goal.target - goal.current} to go</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-300">Health Achievement Tracking</span>
            </div>
            <p className="text-sm text-gray-400">
              Your health data is used to automatically track progress toward health-related achievements. Connect a fitness app or enter data manually to unlock health achievements.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};