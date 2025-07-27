import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { 
  X, 
  Briefcase, 
  Upload, 
  Camera, 
  CheckCircle, 
  Award, 
  FileText, 
  Zap,
  Gavel,
  Stethoscope,
  School,
  Building,
  Landmark,
  Rocket
} from 'lucide-react';

interface ProfessionalVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  profession: string;
  achievementId: string;
}

export const ProfessionalVerification: React.FC<ProfessionalVerificationProps> = ({ 
  isOpen, 
  onClose, 
  profession,
  achievementId
}) => {
  const { user, completeLifeAchievement } = useGameStore();
  const [verificationMethod, setVerificationMethod] = useState<'document' | 'photo' | 'self_attestation'>('document');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  if (!user || !isOpen) return null;

  const getProfessionIcon = () => {
    switch (profession.toLowerCase()) {
      case 'doctor': return <Stethoscope className="w-6 h-6" />;
      case 'lawyer': return <Gavel className="w-6 h-6" />;
      case 'teacher': return <School className="w-6 h-6" />;
      case 'engineer': return <Building className="w-6 h-6" />;
      case 'mayor': return <Landmark className="w-6 h-6" />;
      case 'congressman': return <Landmark className="w-6 h-6" />;
      case 'entrepreneur': return <Rocket className="w-6 h-6" />;
      default: return <Briefcase className="w-6 h-6" />;
    }
  };

  const getVerificationRequirements = () => {
    switch (profession.toLowerCase()) {
      case 'doctor':
        return [
          'Medical license or certificate',
          'Hospital/clinic ID badge',
          'Professional association membership',
          'Medical school diploma'
        ];
      case 'lawyer':
        return [
          'Bar association membership',
          'Law firm ID or business card',
          'Court appearance documentation',
          'Legal certification'
        ];
      case 'teacher':
        return [
          'Teaching credential or license',
          'School ID badge',
          'Education degree',
          'Class roster or teaching schedule'
        ];
      case 'engineer':
        return [
          'Engineering license or certification',
          'Professional association membership',
          'Company ID showing engineering role',
          'Engineering project documentation'
        ];
      case 'mayor':
        return [
          'Election certification',
          'Government ID or badge',
          'Official letterhead with your name and title',
          'News article mentioning your position'
        ];
      case 'congressman':
        return [
          'Election certification',
          'Congressional ID or badge',
          'Official government documentation',
          'News article mentioning your position'
        ];
      case 'entrepreneur':
        return [
          'Business registration documents',
          'Company financial statements',
          'Proof of ownership',
          'Business tax documents'
        ];
      default:
        return [
          'Professional certification',
          'Company ID or business card',
          'Proof of employment',
          'Professional association membership'
        ];
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = () => {
    // In a real app, this would access the camera
    // For demo purposes, we'll simulate a photo capture
    const simulatedPhoto = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`;
    setUploadedFile(simulatedPhoto);
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerified(true);
      setIsSubmitting(false);
      
      // After verification, complete the achievement
      setTimeout(() => {
        completeLifeAchievement(achievementId);
        onClose();
      }, 2000);
    }, 2000);
  };

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
                <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  {getProfessionIcon()}
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Professional Verification
                </h2>
                <p className="text-sm text-gray-400 capitalize">{profession} Achievement Verification</p>
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

          {/* Verification Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-blue-300">Professional Achievement Verification</h3>
            </div>
            <p className="text-sm text-gray-400">
              To verify your professional achievement, please provide documentation that confirms your professional status and accomplishment. Your privacy is important - all verification is processed locally on your device.
            </p>
          </div>

          {!isVerified ? (
            <>
              {/* Verification Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Verification Method</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'document', name: 'Document', icon: <FileText className="w-5 h-5" /> },
                    { id: 'photo', name: 'Photo', icon: <Camera className="w-5 h-5" /> },
                    { id: 'self_attestation', name: 'Self Attestation', icon: <CheckCircle className="w-5 h-5" /> }
                  ].map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVerificationMethod(method.id as any)}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        verificationMethod === method.id
                          ? 'border-blue-400/50 bg-blue-500/20 text-blue-300'
                          : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                      }`}
                    >
                      <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 mb-2">
                        {method.icon}
                      </div>
                      <div className="font-bold">{method.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Verification Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Required Documentation</h3>
                
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-3">
                    Please provide one of the following documents to verify your professional status:
                  </p>
                  <ul className="space-y-2">
                    {getVerificationRequirements().map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          {index + 1}
                        </div>
                        <span className="text-white">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Upload/Capture Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  {verificationMethod === 'document' ? 'Upload Document' : 
                   verificationMethod === 'photo' ? 'Take Photo' : 'Self Attestation'}
                </h3>
                
                {!uploadedFile ? (
                  <div className="p-8 bg-black/40 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center">
                    {verificationMethod === 'document' ? (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-400 mb-4">Drag and drop your document or click to browse</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="document-upload"
                        />
                        <label
                          htmlFor="document-upload"
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium cursor-pointer"
                        >
                          Select Document
                        </label>
                      </>
                    ) : verificationMethod === 'photo' ? (
                      <>
                        <Camera className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-400 mb-4">Take a photo of your professional ID or credentials</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCapturePhoto}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                        >
                          Take Photo
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-400 mb-4">I attest that I am a professional {profession} and have completed this achievement</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setUploadedFile('self-attestation')}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                        >
                          Confirm Attestation
                        </motion.button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h4 className="font-bold text-green-300">
                          {verificationMethod === 'document' ? 'Document Uploaded' : 
                           verificationMethod === 'photo' ? 'Photo Captured' : 'Attestation Confirmed'}
                        </h4>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUploadedFile(null)}
                        className="p-2 hover:bg-black/20 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4 text-green-300" />
                      </motion.button>
                    </div>
                    
                    {verificationMethod !== 'self_attestation' && uploadedFile !== 'self-attestation' && (
                      <div className="bg-black/40 rounded-xl p-2 mb-4">
                        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-600" />
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-green-200">
                      {verificationMethod === 'document' ? 'Your document has been uploaded and is ready for verification.' : 
                       verificationMethod === 'photo' ? 'Your photo has been captured and is ready for verification.' : 
                       'Your self-attestation has been recorded and is ready for verification.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {uploadedFile && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl text-white font-bold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Submit for Verification'
                  )}
                </motion.button>
              )}
            </>
          ) : (
            // Verification Success
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1, repeat: 3 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Verification Successful!</h3>
              <p className="text-gray-400 mb-6">Your professional achievement has been verified and added to your profile.</p>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-purple-300">Achievement Unlocked</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Congratulations on completing this professional milestone! Your achievement will be reflected in your profile and will unlock new opportunities.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-blue-300">Privacy & Security</span>
            </div>
            <p className="text-sm text-gray-400">
              All verification is processed locally on your device. Your professional documents and credentials are never uploaded to any server or shared with third parties.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};