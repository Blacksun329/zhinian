import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SOSModalProps {
  onClose: () => void;
}

const GUIDANCE_TEXTS = {
  inhale: [
    "吸气，吸收当下的宁静",
    "吸气，感受生命的流动",
    "吸气，让新能量进入",
    "吸气，此时只有你自己"
  ],
  hold: [
    "屏息，静观念头起伏",
    "屏息，寻找内心的定点",
    "屏息，世界为你停留",
    "屏息，你是自己的主宰"
  ],
  exhale: [
    "呼气，吐故鼎新",
    "呼气，念头随风而去",
    "呼气，放下执着与不甘",
    "呼气，找回内在的平和"
  ]
};

export const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [textIndex, setTextIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          if (phase === 'inhale') { setPhase('hold'); setTextIndex(Math.floor(Math.random() * 4)); return 4; }
          if (phase === 'hold') { setPhase('exhale'); setTextIndex(Math.floor(Math.random() * 4)); return 4; }
          if (phase === 'exhale') { setPhase('inhale'); setTextIndex(Math.floor(Math.random() * 4)); return 4; }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Handle wooden fish sound effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [count]);

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return '吸气';
      case 'hold': return '屏息';
      case 'exhale': return '呼气';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-2xl p-6"
    >
      <audio ref={audioRef} src="/muyu.mp3" preload="auto" />
      <div className="w-[calc(100%-2rem)] max-w-sm bg-white/90 rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden border border-white/20">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-zen-text-muted hover:text-zen-text transition-colors z-20"
        >
          <X size={24} />
        </button>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-zen-accent/5 rounded-full blur-3xl"
        />
        
        <div className="mb-12 relative z-10">
          <h2 className="text-2xl font-serif font-bold text-zen-text mb-2">止念呼吸</h2>
          <p className="text-xs text-zen-text-muted tracking-widest uppercase font-bold">Breath of Peace</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div
            animate={{
              scale: phase === 'inhale' ? [1, 1.8] : phase === 'hold' ? 1.8 : [1.8, 1],
              opacity: phase === 'inhale' ? [0.1, 0.4] : phase === 'hold' ? 0.4 : [0.4, 0.1]
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 bg-zen-accent rounded-full blur-[60px]"
          />
          <div className="z-10">
            <motion.div 
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-serif font-bold text-zen-text mb-2 tracking-[0.2em]"
            >
              {getInstruction()}
            </motion.div>
            <motion.div 
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-mono font-black text-zen-accent"
            >
              {count}
            </motion.div>
          </div>
        </div>

        <div className="mt-12 min-h-[3rem] relative z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${phase}-${textIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-zen-text-muted font-serif italic leading-relaxed"
            >
              “{GUIDANCE_TEXTS[phase][textIndex]}”
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
