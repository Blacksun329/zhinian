import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IncineratorEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

export const IncineratorEffect: React.FC<IncineratorEffectProps> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 300 - 150,
        y: Math.random() * 200 - 100,
        size: Math.random() * 4 + 2,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        onComplete();
        setParticles([]);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: p.x,
                y: p.y - 200,
                opacity: 0,
                scale: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-2 h-2 bg-orange-500 rounded-sm blur-[1px]"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: Math.random() > 0.5 ? '#f97316' : '#4b5563'
              }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
            transition={{ duration: 2.5 }}
            className="text-zen-accent font-serif text-xl italic"
          >
            念头燃尽，心归泰然
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
