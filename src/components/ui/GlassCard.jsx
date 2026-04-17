import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ children, className, onClick, delay = 0, hover = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={hover ? { 
        y: -4, 
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        transition: { duration: 0.2 } 
      } : {}}
      onClick={onClick}
      className={twMerge(
        'glass-effect rounded-2xl p-6 relative overflow-hidden group',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
