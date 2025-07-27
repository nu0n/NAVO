import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  HardDrive, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Database,
  Save,
  FileText
} from 'lucide-react';
import {
  createBackup,
  restoreFromBackup,
  clearAllData,
  getStorageInfo
} from '../utils/localStorage';

interface DataManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ isOpen, onClose }) => {
  const [backupData, setBackupData] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const storageInfo = getStorageInfo();

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateBackup = () => {
    const backup = createBackup();
    if (backup) {
      setBackupData(backup);
      showNotification('success', 'Backup created successfully!');
    } else {
      showNotification('error', 'Failed to create backup');
    }
  };

  const handleDownloadBackup = () => {
    if (!backupData) {
      showNotification('error', 'No backup data available');
      return;
    }

    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civil-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Backup downloaded successfully!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (restoreFromBackup(content)) {
        showNotification('success', 'Data restored successfully! Please refresh the page.');
      } else {
        showNotification('error', 'Failed to restore data. Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (clearAllData()) {
      showNotification('success', 'All data cleared successfully! Please refresh the page.');
      setShowClearConfirm(false);
    } else {
      showNotification('error', 'Failed to clear data');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

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
                <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Data Management
                </h2>
                <p className="text-sm text-gray-400">Backup, restore, and manage your CIVIL data</p>
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

          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-6 p-4 rounded-2xl border ${
                  notification.type === 'success' 
                    ? 'bg-green-500/20 border-green-400/30 text-green-300'
                    : notification.type === 'error'
                    ? 'bg-red-500/20 border-red-400/30 text-red-300'
                    : 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                  {notification.type === 'info' && <Shield className="w-5 h-5" />}
                  <span className="font-medium">{notification.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Storage Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-3">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white">Storage Information</h3>
            </div>
            
            {storageInfo.available ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Used Storage:</span>
                  <span className="text-white font-medium">{formatBytes(storageInfo.usedSize)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available Storage:</span>
                  <span className="text-white font-medium">{formatBytes(storageInfo.remainingSize)}</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${storageInfo.usagePercentage}%` }}
                    className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {storageInfo.usagePercentage.toFixed(1)}% used
                </div>
              </div>
            ) : (
              <div className="text-red-400 text-sm">
                Local storage is not available in your browser
              </div>
            )}
          </div>

          {/* Backup Section */}
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <Save className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-300">Create Backup</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Create a backup of all your CIVIL data including profile, achievements, and settings.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateBackup}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Create Backup</span>
                </motion.button>
                
                {backupData && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadBackup}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Restore Section */}
            <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <Upload className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-300">Restore from Backup</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Restore your CIVIL data from a previously created backup file.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Choose Backup File</span>
                </motion.button>
              </div>
            </div>

            {/* Clear Data Section */}
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-red-300">Clear All Data</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Permanently delete all CIVIL data from your device. This action cannot be undone.
              </p>
              
              {!showClearConfirm ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Clear All Data</span>
                </motion.button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-xl">
                    <p className="text-red-300 text-sm font-medium">
                      ⚠️ Are you sure? This will permanently delete all your CIVIL data!
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClearAllData}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors"
                    >
                      Yes, Delete Everything
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl text-white font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-400/30 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-purple-300">Privacy & Security</h3>
            </div>
            <p className="text-sm text-gray-400">
              All your CIVIL data is stored locally on your device. We never send your personal information to external servers. 
              Your privacy and data security are our top priorities.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};