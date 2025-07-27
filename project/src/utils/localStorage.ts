import { UserProfile, Sign, NavigationAlert } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'civil_user_profile',
  USER_SIGNS: 'civil_user_signs',
  NAVIGATION_ALERTS: 'civil_navigation_alerts',
  APP_SETTINGS: 'civil_app_settings',
  ONBOARDING_STATE: 'civil_onboarding_state',
  DATA_VERSION: 'civil_data_version'
} as const;

// Current data version for migration purposes
const CURRENT_DATA_VERSION = '1.0.0';

interface AppSettings {
  lastSyncDate: Date;
  dataVersion: string;
  backupCount: number;
  autoBackupEnabled: boolean;
}

interface StorageData {
  userProfile: UserProfile | null;
  userSigns: Sign[];
  navigationAlerts: NavigationAlert[];
  appSettings: AppSettings;
  onboardingCompleted: boolean;
}

// Utility functions for safe JSON operations
const safeStringify = (data: any): string => {
  try {
    return JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });
  } catch (error) {
    return '{}';
  }
};

const safeParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  } catch (error) {
    return null;
  }
};

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Storage operations
export const saveUserProfile = (profile: UserProfile): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const serializedProfile = safeStringify(profile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, serializedProfile);
    
    const settings = getAppSettings();
    settings.lastSyncDate = new Date();
    saveAppSettings(settings);
    
    return true;
  } catch (error) {
    return false;
  }
};

export const loadUserProfile = (): UserProfile | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const serializedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!serializedProfile) return null;
    
    const profile = safeParse(serializedProfile);
    return profile;
  } catch (error) {
    return null;
  }
};

export const saveUserSigns = (signs: Sign[]): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const serializedSigns = safeStringify(signs);
    localStorage.setItem(STORAGE_KEYS.USER_SIGNS, serializedSigns);
    return true;
  } catch (error) {
    return false;
  }
};

export const loadUserSigns = (): Sign[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const serializedSigns = localStorage.getItem(STORAGE_KEYS.USER_SIGNS);
    if (!serializedSigns) return [];
    
    const signs = safeParse(serializedSigns);
    return Array.isArray(signs) ? signs : [];
  } catch (error) {
    return [];
  }
};

export const saveNavigationAlerts = (alerts: NavigationAlert[]): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const serializedAlerts = safeStringify(alerts);
    localStorage.setItem(STORAGE_KEYS.NAVIGATION_ALERTS, serializedAlerts);
    return true;
  } catch (error) {
    return false;
  }
};

export const loadNavigationAlerts = (): NavigationAlert[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const serializedAlerts = localStorage.getItem(STORAGE_KEYS.NAVIGATION_ALERTS);
    if (!serializedAlerts) return [];
    
    const alerts = safeParse(serializedAlerts);
    return Array.isArray(alerts) ? alerts : [];
  } catch (error) {
    return [];
  }
};

export const saveAppSettings = (settings: AppSettings): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const serializedSettings = safeStringify(settings);
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, serializedSettings);
    return true;
  } catch (error) {
    return false;
  }
};

export const getAppSettings = (): AppSettings => {
  const defaultSettings: AppSettings = {
    lastSyncDate: new Date(),
    dataVersion: CURRENT_DATA_VERSION,
    backupCount: 0,
    autoBackupEnabled: true
  };
  
  if (!isLocalStorageAvailable()) return defaultSettings;
  
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (!serializedSettings) return defaultSettings;
    
    const settings = safeParse(serializedSettings);
    return { ...defaultSettings, ...settings };
  } catch (error) {
    return defaultSettings;
  }
};

export const saveOnboardingState = (completed: boolean): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(completed));
    return true;
  } catch (error) {
    return false;
  }
};

export const loadOnboardingState = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const state = localStorage.getItem(STORAGE_KEYS.ONBOARDING_STATE);
    return state ? JSON.parse(state) : false;
  } catch (error) {
    return false;
  }
};

// Backup and restore functionality
export const createBackup = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const backupData: StorageData = {
      userProfile: loadUserProfile(),
      userSigns: loadUserSigns(),
      navigationAlerts: loadNavigationAlerts(),
      appSettings: getAppSettings(),
      onboardingCompleted: loadOnboardingState()
    };
    
    const backup = safeStringify({
      ...backupData,
      backupDate: new Date(),
      version: CURRENT_DATA_VERSION
    });
    
    const settings = getAppSettings();
    settings.backupCount += 1;
    saveAppSettings(settings);
    
    return backup;
  } catch (error) {
    return null;
  }
};

export const restoreFromBackup = (backupString: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const backupData = safeParse(backupString);
    if (!backupData) return false;
    
    if (!backupData.userProfile && !backupData.userSigns) {
      return false;
    }
    
    if (backupData.userProfile) {
      saveUserProfile(backupData.userProfile);
    }
    
    if (backupData.userSigns) {
      saveUserSigns(backupData.userSigns);
    }
    
    if (backupData.navigationAlerts) {
      saveNavigationAlerts(backupData.navigationAlerts);
    }
    
    if (backupData.appSettings) {
      saveAppSettings(backupData.appSettings);
    }
    
    if (backupData.onboardingCompleted !== undefined) {
      saveOnboardingState(backupData.onboardingCompleted);
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Data migration
export const migrateData = (): boolean => {
  const settings = getAppSettings();
  const currentVersion = settings.dataVersion;
  
  if (currentVersion === CURRENT_DATA_VERSION) {
    return true;
  }
  
  try {
    settings.dataVersion = CURRENT_DATA_VERSION;
    saveAppSettings(settings);
    
    return true;
  } catch (error) {
    return false;
  }
};

// Clear all data
export const clearAllData = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

// Get storage usage info
export const getStorageInfo = () => {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      totalSize: 0,
      usedSize: 0,
      remainingSize: 0
    };
  }
  
  try {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    
    const estimatedCapacity = 5 * 1024 * 1024;
    
    return {
      available: true,
      totalSize: estimatedCapacity,
      usedSize: totalSize,
      remainingSize: estimatedCapacity - totalSize,
      usagePercentage: (totalSize / estimatedCapacity) * 100
    };
  } catch (error) {
    return {
      available: false,
      totalSize: 0,
      usedSize: 0,
      remainingSize: 0
    };
  }
};

// Auto-backup functionality
export const setupAutoBackup = () => {
  const settings = getAppSettings();
  if (!settings.autoBackupEnabled) return;
  
  const backupInterval = 24 * 60 * 60 * 1000;
  
  setInterval(() => {
    const backup = createBackup();
    if (backup) {
      const backupKey = `civil_auto_backup_${Date.now()}`;
      try {
        localStorage.setItem(backupKey, backup);
        
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys
          .filter(key => key.startsWith('civil_auto_backup_'))
          .sort()
          .reverse();
        
        backupKeys.slice(3).forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (error) {
        // Silent fail for auto-backup
      }
    }
  }, backupInterval);
};