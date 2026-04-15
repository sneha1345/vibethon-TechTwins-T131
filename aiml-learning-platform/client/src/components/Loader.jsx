import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, text = "Loading..." }) => {
  const containerVariants = {
    start: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const dotVariants = {
    animate: (i) => ({
      y: [0, -20, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeInOut"
      }
    })
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="relative"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-[#1070AE] to-[#439FC8] rounded-2xl flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-bold text-white">AI</span>
        </div>
        <motion.div
          className="absolute -inset-4 bg-gradient-to-br from-[#1070AE] to-[#439FC8] rounded-2xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Animated Dots */}
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dotVariants}
            animate="animate"
            className="w-4 h-4 bg-gradient-to-br from-[#1070AE] to-[#439FC8] rounded-full"
          />
        ))}
      </div>

      {/* Loading Text with Typing Effect */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-[#439FC8] font-medium tracking-wider"
      >
        {text}
      </motion.p>

      {/* Progress Ring */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 -z-10">
        <circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          stroke="rgba(16,112,174,0.2)"
          strokeWidth="4"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="58"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: -90 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            strokeDasharray: "364.4",
            transformOrigin: "center",
            rotate: -90
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1070AE" />
            <stop offset="100%" stopColor="#439FC8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        variants={containerVariants}
        initial="start"
        exit="exit"
        className="fixed inset-0 bg-gradient-to-br from-[#041A2E] to-[#05243B] z-50 flex items-center justify-center"
      >
        <LoaderContent />
      </motion.div>
    );
  }

  return <LoaderContent />;
};

export default Loader;