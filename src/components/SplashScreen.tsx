import React from 'react';
import { motion } from 'motion/react';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#E9F1F2] flex flex-col items-center justify-center p-8"
    >
      <div className="w-full flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.2
          }}
          className="w-[45%] max-w-[280px] aspect-square flex items-center justify-center bg-white rounded-[32px] shadow-sm overflow-hidden p-6"
        >
          <img 
            src="/logo.svg" 
            alt="止念 Logo" 
            className="w-full h-full object-contain"
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl font-serif font-bold text-zen-text tracking-[0.3em] mb-2">止念</h1>
          <p className="text-xs text-zen-text-muted tracking-[0.5em] uppercase font-bold">Zen Mind</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-[10px] text-zen-text-muted font-bold tracking-widest uppercase"
      >
        专注当下 · 找回自我
      </motion.div>
    </motion.div>
  );
};
