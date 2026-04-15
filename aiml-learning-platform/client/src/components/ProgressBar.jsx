import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, height = 'h-2', showLabel = true, animated = true }) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-[#439FC8]">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#064471]/50 rounded-full overflow-hidden ${height}`}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#1070AE] to-[#439FC8] rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        ) : (
          <div
            className="h-full bg-gradient-to-r from-[#1070AE] to-[#439FC8] rounded-full"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;