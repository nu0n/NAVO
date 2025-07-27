import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { X, Camera, RotateCcw, Check, Image, Upload } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoData: string) => void;
  prompt?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  isOpen, 
  onClose, 
  onCapture,
  prompt 
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [checkingHotDog, setCheckingHotDog] = useState(false);
  const [hotDogChecked, setHotDogChecked] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: isFrontCamera ? "user" : "environment"
  };

  const handleCameraError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraError(typeof error === 'string' ? error : 'Could not access camera. Please check permissions.');
  }, []);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const handleSubmit = () => {
    if (capturedImage) {
      setCheckingHotDog(true);
      setTimeout(() => {
        setCheckingHotDog(false);
        setHotDogChecked(true);
        setTimeout(() => {
          setHotDogChecked(false);
          onCapture(capturedImage);
          onClose();
        }, 1200);
      }, 1500);
      return;
    }
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCapturedImage(result);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setCameraError('Failed to read file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-2 sm:p-6 max-w-lg w-full shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {capturedImage ? 'Review Photo' : 'Take Photo'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-2xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
            
            {prompt && (
              <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
                <p className="text-sm text-blue-200">{prompt}</p>
              </div>
            )}

            {cameraError ? (
              <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-2xl">
                <p className="text-sm text-red-300 mb-3">{cameraError}</p>
                <p className="text-sm text-gray-400">You can upload an image instead:</p>
                <div className="mt-3">
                  <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-medium cursor-pointer">
                    <Image className="w-5 h-5" />
                    <span>Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={retake}
                    className="flex-1 py-3 bg-gray-600 rounded-xl text-white font-medium"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Use Photo</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleCameraError}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCamera}
                    className="p-3 bg-gray-700 rounded-full text-white"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={capture}
                    className="p-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full text-white"
                  >
                    <Camera className="w-6 h-6" />
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-gray-700 rounded-full text-white"
                    >
                      <Upload className="w-5 h-5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-2xl text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-blue-300">Uploading image...</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>

      {/* Hot Dog Checking Overlay */}
      <AnimatePresence>
        {checkingHotDog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center animate-spin-slow shadow-2xl border-4 border-white/10">
                <svg className="w-12 h-12 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-center drop-shadow-lg"
              >
                Checking this is not a hot dog...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hot Dog Checked Overlay */}
      <AnimatePresence>
        {hotDogChecked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 via-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl border-4 border-white/10"
              >
                <Check className="w-12 h-12 text-white animate-pulse" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent text-center drop-shadow-lg"
              >
                Check: Not a hot dog!<br />Thank you!
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};