import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { X, AlertTriangle, Shield, Users, Route, Navigation, Clock, ChevronDown, Zap, Wifi } from 'lucide-react';
import { NavigationAlert } from '../types';

export const NavigationAlerts: React.FC = () => {
  const { user, signs, userLocation, grantExpForSign } = useGameStore();
  const [alerts, setAlerts] = useState<NavigationAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Check if time restriction applies
  const isTimeRestricted = (sign: any): boolean => {
    if (!sign.timeRestriction) return false;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Check day restriction
    if (sign.timeRestriction.days && sign.timeRestriction.days.length > 0) {
      if (!sign.timeRestriction.days.includes(currentDay)) return false;
    }
    
    // Check time restriction
    if (sign.timeRestriction.startTime && sign.timeRestriction.endTime) {
      const [startHour, startMin] = sign.timeRestriction.startTime.split(':').map(Number);
      const [endHour, endMin] = sign.timeRestriction.endTime.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      if (startTime <= endTime) {
        // Same day range
        if (currentTime < startTime || currentTime > endTime) return false;
      } else {
        // Overnight range
        if (currentTime < startTime && currentTime > endTime) return false;
      }
    }
    
    return true;
  };

  // Generate alerts based on proximity
  useEffect(() => {
    if (!userLocation || !user?.preferences) return;

    const newAlerts: NavigationAlert[] = [];
    const now = Date.now();

    signs.forEach(sign => {
      if (!sign.isActive || dismissedAlerts.has(sign.id)) return;
      
      const distance = calculateDistance(
        userLocation[1], userLocation[0],
        sign.latitude, sign.longitude
      );

      const alertDistance = sign.alertDistance || 100;
      
      if (distance <= alertDistance) {
        // Check if this is a time-restricted sign and if it applies now
        if (sign.timeRestriction && !isTimeRestricted(sign)) return;

        let alertType: NavigationAlert['type'] = 'info';
        let suggestedAction = '';
        
        switch (sign.category) {
          case 'danger':
            if (!user.preferences.enableDangerAlerts) return;
            alertType = 'danger';
            suggestedAction = 'Consider taking an alternative route for safety';
            break;
          case 'warning':
            alertType = 'warning';
            suggestedAction = 'Exercise caution in this area';
            break;
          case 'group':
            if (!user.preferences.enableGroupAlerts) return;
            alertType = 'group';
            suggestedAction = 'Check if you want to join this activity';
            break;
          case 'route':
            if (!user.preferences.enableRouteAlerts) return;
            alertType = 'route';
            suggestedAction = 'Route information available';
            break;
          default:
            alertType = 'info';
        }

        const alert: NavigationAlert = {
          id: `alert-${sign.id}-${now}`,
          signId: sign.id,
          type: alertType,
          title: sign.title,
          message: sign.description,
          severity: sign.severity || 'medium',
          distance: Math.round(distance),
          timestamp: new Date(),
          isRead: false,
          suggestedAction
        };

        newAlerts.push(alert);
        grantExpForSign(sign.id, 50);
      }
    });

    setAlerts(prev => {
      // Remove old alerts and add new ones
      const existingSignIds = new Set(prev.map(a => a.signId));
      const newSignIds = new Set(newAlerts.map(a => a.signId));
      
      const filtered = prev.filter(a => newSignIds.has(a.signId));
      const toAdd = newAlerts.filter(a => !existingSignIds.has(a.signId));
      
      return [...filtered, ...toAdd];
    });
  }, [userLocation, signs, user?.preferences, dismissedAlerts, grantExpForSign]);

  const dismissAlert = (alertId: string, signId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setDismissedAlerts(prev => new Set([...prev, signId]));
    
    // Auto-remove from dismissed after 5 minutes
    setTimeout(() => {
      setDismissedAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(signId);
        return newSet;
      });
    }, 5 * 60 * 1000);
  };

  const getAlertIcon = (type: NavigationAlert['type']) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />;
      case 'group': return <Users className="w-4 h-4 md:w-5 md:h-5" />;
      case 'route': return <Route className="w-4 h-4 md:w-5 md:h-5" />;
      default: return <Navigation className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  const getAlertTheme = (severity: NavigationAlert['severity']) => {
    switch (severity) {
      case 'critical': 
        return {
          gradient: 'from-red-500 via-pink-500 to-orange-500',
          border: 'border-red-400/50',
          glow: 'shadow-red-500/50',
          text: 'text-red-100'
        };
      case 'high': 
        return {
          gradient: 'from-orange-500 via-yellow-500 to-red-500',
          border: 'border-orange-400/50',
          glow: 'shadow-orange-500/50',
          text: 'text-orange-100'
        };
      case 'medium': 
        return {
          gradient: 'from-yellow-500 via-amber-500 to-orange-500',
          border: 'border-yellow-400/50',
          glow: 'shadow-yellow-500/50',
          text: 'text-yellow-100'
        };
      case 'low': 
        return {
          gradient: 'from-blue-500 via-cyan-500 to-teal-500',
          border: 'border-blue-400/50',
          glow: 'shadow-blue-500/50',
          text: 'text-blue-100'
        };
      default: 
        return {
          gradient: 'from-gray-600 via-slate-600 to-gray-700',
          border: 'border-gray-400/50',
          glow: 'shadow-gray-500/50',
          text: 'text-gray-100'
        };
    }
  };

  if (alerts.length === 0) return null;

  const visibleAlerts = isCollapsed ? alerts.slice(0, 1) : alerts.slice(0, 3);

  return (
    <div className="fixed top-20 md:top-24 left-2 right-2 md:left-4 md:right-4 z-40 pointer-events-none">
      <AnimatePresence>
        {visibleAlerts.map((alert, index) => {
          const theme = getAlertTheme(alert.severity);
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -100, rotateY: -15 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: index * (isCollapsed ? 0 : 70),
                rotateY: 0,
                scale: 1 - (index * 0.02),
                zIndex: 40 - index
              }}
              exit={{ opacity: 0, x: -100, rotateY: -15 }}
              className="pointer-events-auto mb-2 md:mb-3 relative"
            >
              {/* Holographic Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} rounded-2xl md:rounded-3xl blur-xl opacity-30`} />
              
              {/* Main Alert Container */}
              <div className={`relative bg-black/70 backdrop-blur-xl border ${theme.border} rounded-2xl md:rounded-3xl overflow-hidden ${theme.glow} shadow-2xl`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div
                    className={`w-full h-full bg-gradient-to-br ${theme.gradient}`}
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Floating Particles - Reduced for mobile */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </div>

                <div className="relative p-3 md:p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 md:space-x-3 flex-1">
                      {/* Icon with Holographic Effect */}
                      <motion.div 
                        animate={{ 
                          rotateY: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative mt-0.5"
                      >
                        <div className={`p-2 md:p-3 bg-gradient-to-br ${theme.gradient} rounded-xl md:rounded-2xl shadow-lg border border-white/20`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        
                        {/* Pulsing Ring */}
                        <motion.div
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute inset-0 border-2 ${theme.border} rounded-xl md:rounded-2xl`}
                        />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 md:mb-2">
                          <h3 className={`font-black text-sm md:text-sm ${theme.text} truncate`}>
                            {alert.title}
                          </h3>
                          
                          {/* Distance Badge with Neon Effect */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                "0 0 10px rgba(255,255,255,0.3)",
                                "0 0 20px rgba(255,255,255,0.6)",
                                "0 0 10px rgba(255,255,255,0.3)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="px-2 py-0.5 md:px-3 md:py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex-shrink-0"
                          >
                            <span className="text-xs font-bold text-white">{alert.distance}m</span>
                          </motion.div>
                        </div>
                        
                        {!isCollapsed && (
                          <>
                            <p className={`text-xs md:text-sm opacity-90 mb-2 md:mb-3 leading-relaxed ${theme.text} line-clamp-2`}>
                              {alert.message}
                            </p>
                            
                            {alert.suggestedAction && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/10 backdrop-blur-sm p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/20"
                              >
                                <div className="flex items-center space-x-2">
                                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 flex-shrink-0" />
                                  <p className="text-xs font-medium text-white">
                                    {alert.suggestedAction}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-1 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dismissAlert(alert.id, alert.signId)}
                        className="p-1.5 md:p-2 hover:bg-white/20 rounded-xl md:rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </motion.button>
                      
                      {index === 0 && alerts.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsCollapsed(!isCollapsed)}
                          className="p-1.5 md:p-2 hover:bg-white/20 rounded-xl md:rounded-2xl transition-colors backdrop-blur-sm border border-white/10"
                        >
                          <motion.div
                            animate={{ rotate: isCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Time and severity indicator */}
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/20"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs opacity-75 text-white">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        {/* Signal Strength Indicator */}
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-3 h-3 text-green-400" />
                          <div className="flex space-x-0.5">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 bg-green-400 rounded-full"
                                style={{ height: `${4 + i * 2}px` }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ 
                                  duration: 1, 
                                  repeat: Infinity, 
                                  delay: i * 0.2 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-xs font-bold capitalize px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 ${theme.text}`}
                      >
                        {alert.severity} priority
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Alert Counter with Holographic Effect */}
      {alerts.length > visibleAlerts.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-2 md:mt-4 pointer-events-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-500/30 rounded-xl md:rounded-2xl blur-lg" />
            
            <div className="relative bg-black/80 backdrop-blur-xl text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold shadow-2xl border border-white/20">
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(34, 211, 238, 0.5)",
                    "0 0 20px rgba(168, 85, 247, 0.5)",
                    "0 0 10px rgba(236, 72, 153, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm md:text-base"
              >
                +{alerts.length - visibleAlerts.length} more alerts
              </motion.span>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};