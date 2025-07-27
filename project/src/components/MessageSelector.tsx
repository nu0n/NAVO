import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageTemplate, getMessagesForSignCategory, getMessagesByCategory } from '../data/messageTemplates';
import { X, Search, Filter, Heart, Star, CheckCircle } from 'lucide-react';

interface MessageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage: (message: MessageTemplate) => void;
  signCategory?: string;
  title?: string;
  description?: string;
}

export const MessageSelector: React.FC<MessageSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMessage, 
  signCategory,
  title = "Select Message",
  description = "Choose a predefined message for your sign"
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Messages', icon: '🌟', color: 'from-gray-500 to-gray-600' },
    { id: 'warning', name: 'Warning', icon: '⚠️', color: 'from-red-500 to-orange-600' },
    { id: 'helpful', name: 'Helpful', icon: '💡', color: 'from-blue-500 to-cyan-600' },
    { id: 'encouragement', name: 'Encouragement', icon: '💪', color: 'from-green-500 to-emerald-600' },
    { id: 'direction', name: 'Direction', icon: '🧭', color: 'from-purple-500 to-indigo-600' },
    { id: 'discovery', name: 'Discovery', icon: '🔍', color: 'from-yellow-500 to-orange-600' },
    { id: 'community', name: 'Community', icon: '🤝', color: 'from-pink-500 to-rose-600' },
    { id: 'achievement', name: 'Achievement', icon: '🏆', color: 'from-amber-500 to-yellow-600' },
    { id: 'safety', name: 'Safety', icon: '🛡️', color: 'from-teal-500 to-cyan-600' }
  ];

  const getFilteredMessages = (): MessageTemplate[] => {
    let messages: MessageTemplate[] = [];

    if (signCategory) {
      // Get messages appropriate for the sign category
      messages = getMessagesForSignCategory(signCategory);
    } else if (selectedCategory === 'all') {
      // Get all messages
      messages = getMessagesByCategory('warning')
        .concat(getMessagesByCategory('helpful'))
        .concat(getMessagesByCategory('encouragement'))
        .concat(getMessagesByCategory('direction'))
        .concat(getMessagesByCategory('discovery'))
        .concat(getMessagesByCategory('community'))
        .concat(getMessagesByCategory('achievement'))
        .concat(getMessagesByCategory('safety'));
    } else {
      // Get messages by selected category
      messages = getMessagesByCategory(selectedCategory as MessageTemplate['category']);
    }

    // Filter by search term
    if (searchTerm) {
      messages = messages.filter(message => 
        message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return messages;
  };

  const getToneColor = (tone: MessageTemplate['tone']) => {
    switch (tone) {
      case 'positive': return 'text-green-400 border-green-400/30 bg-green-500/20';
      case 'cautious': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      case 'urgent': return 'text-red-400 border-red-400/30 bg-red-500/20';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-500/20';
    }
  };

  const handleMessageSelect = (message: MessageTemplate) => {
    onSelectMessage(message);
    onClose();
  };

  if (!isOpen) return null;

  const filteredMessages = getFilteredMessages();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-60 modal-high flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          className="relative bg-black/80 backdrop-blur-2xl rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20"
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
                <div className="p-3 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="text-sm text-gray-400">{description}</p>
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

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-12 pr-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50"
            />
          </div>

          {/* Category Filter - Only show if not filtering by sign category */}
          {!signCategory && (
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-bold ${
                    selectedCategory === category.id
                      ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-gray-300'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Message Grid */}
          <div className="overflow-y-auto max-h-[calc(90vh-220px)]" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMessages.map((message, index) => (
                <motion.button
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMessageSelect(message)}
                  className="relative p-4 rounded-2xl border-2 border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 transition-all text-left group"
                >
                  {/* Message Content */}
                  <div className="flex items-start space-x-3 mb-3">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg shadow-lg border border-white/20"
                    >
                      {message.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm mb-1">{message.text}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full font-bold capitalize bg-gray-600/30 text-gray-300">
                          {message.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize border ${getToneColor(message.tone)}`}>
                          {message.tone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Context Tags */}
                  <div className="flex flex-wrap gap-1">
                    {message.context.slice(0, 3).map(context => (
                      <span
                        key={context}
                        className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded-full"
                      >
                        {context}
                      </span>
                    ))}
                    {message.context.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded-full">
                        +{message.context.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Selection Indicator */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Empty State */}
            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-2">No messages found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="font-bold text-pink-300">Safe Communication</span>
            </div>
            <p className="text-sm text-gray-400">
              All messages are pre-approved and moderated to ensure a safe, positive community experience. 
              Found {filteredMessages.length} messages for your selection.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};