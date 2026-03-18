import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const RollingNumber = ({ value }: { value: number }) => {
  const digits = value.toString().split("");
  return (
    <div className="flex items-center justify-center">
      {digits.map((digit, index) => (
        <div key={`${index}-${digit}`} className="h-[100px] overflow-hidden relative flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: 80, opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ y: -80, opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-8xl font-serif font-black text-zen-text tracking-tighter block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

interface CircularTimerProps {
  days: number;
  progress: number;
  rankName: string;
  rankColor: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({ days, progress, rankName, rankColor }) => {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Background Aura - Breathing Layer 1 */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.2, 0.05],
          backgroundColor: ["#7abeb7", "#3E4B42", "#7abeb7"]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-72 h-72 rounded-full blur-[100px]"
      />

      {/* Background Aura - Breathing Layer 2 */}
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-64 h-64 bg-zen-accent rounded-full blur-[60px]"
      />

      {/* Rotating Glow Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[260px] h-[260px] rounded-full border border-zen-accent/10 border-dashed" />
      </motion.div>

      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 300 300">
        {/* Track */}
        <circle
          className="text-black/5"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="150"
          cy="150"
        />
        
        {/* Progress Bar with Glow */}
        <motion.circle
          className="text-zen-accent"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="150"
          cy="150"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center z-20 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-sm font-serif font-bold tracking-[0.4em] mb-1 transition-colors duration-1000", rankColor)}
          >
            {rankName}
          </motion.span>
          <RollingNumber value={days} />
          <span className="text-[10px] font-serif font-black text-zen-text-muted mt-2 tracking-[0.5em] uppercase">DAYS</span>
        </motion.div>
      </div>
    </div>
  );
};
