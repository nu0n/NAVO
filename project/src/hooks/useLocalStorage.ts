import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  saveUserProfile,
  loadUserProfile,
  saveUserSigns,
  loadUserSigns,
  saveNavigationAlerts,
  loadNavigationAlerts,
  saveOnboardingState,
  loadOnboardingState,
  migrateData,
  setupAutoBackup
} from '../utils/localStorage';

export const useLocalStorage = () => {
  const {
    user,
    signs,
    navigationAlerts,
    showOnboarding,
    isInitialized,
    setUser,
    setSigns,
    setShowOnboarding,
    setIsInitialized
  } = useGameStore();

  // Load data on app initialization
  const loadAllData = useCallback(async () => {
    try {
      // Migrate data if needed
      migrateData();
      
      // Load onboarding state first
      const onboardingCompleted = loadOnboardingState();
      
      if (onboardingCompleted) {
        // Load user profile
        const savedProfile = loadUserProfile();
        if (savedProfile) {
          setUser(savedProfile);
        }
        
        // Load user signs
        const savedSigns = loadUserSigns();
        if (savedSigns.length > 0) {
          setSigns(savedSigns);
        }
        
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
      
      // Setup auto-backup
      setupAutoBackup();
    } catch (error) {
      // Silent fail, continue with default state
    } finally {
      setIsInitialized(true);
    }
  }, [setUser, setSigns, setShowOnboarding, setIsInitialized]);

  // Save data when state changes (only after initialization)
  useEffect(() => {
    if (isInitialized && user) {
      saveUserProfile(user);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (isInitialized && signs.length > 0) {
      saveUserSigns(signs);
    }
  }, [signs, isInitialized]);

  useEffect(() => {
    if (isInitialized && navigationAlerts.length > 0) {
      saveNavigationAlerts(navigationAlerts);
    }
  }, [navigationAlerts, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveOnboardingState(!showOnboarding);
    }
  }, [showOnboarding, isInitialized]);

  // Initialize data loading on mount
  useEffect(() => {
    if (!isInitialized) {
      loadAllData();
    }
  }, [loadAllData, isInitialized]);

  return {
    loadAllData,
    isInitialized
  };
};