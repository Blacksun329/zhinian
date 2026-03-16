import React from 'react';
import { motion } from 'motion/react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-[#fdfdfb]">
      {/* Liquid Blob 1 */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 120, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 90, 180, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-zen-200/40 rounded-full blur-[120px]"
      />
      
      {/* Liquid Blob 2 */}
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 150, -60, 0],
          scale: [1.1, 0.8, 1.2, 1.1],
          rotate: [0, -120, 60, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-zen-100/50 rounded-full blur-[100px]"
      />

      {/* Liquid Blob 3 */}
      <motion.div
        animate={{
          x: [0, 60, -100, 0],
          y: [0, -100, 50, 0],
          scale: [0.9, 1.3, 1, 0.9],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-zen-50/60 rounded-full blur-[140px]"
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
