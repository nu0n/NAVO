import React from 'react';
import { motion } from 'framer-motion';

export const BoltBadge: React.FC = () => {
  const handleClick = () => {
    console.log('BoltBadge clicked - navigating to https://bolt.new');
  };

  return (
    <motion.a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[4%] right-4 z-50 rounded-full overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      title="Built with Bolt - Click to visit bolt.new"
    >
      <img 
        src="/white_circle_360x360.png" 
        alt="Built with Bolt" 
        className="w-11 h-11 md:w-14 md:h-14"
      />
    </motion.a>
  );
};