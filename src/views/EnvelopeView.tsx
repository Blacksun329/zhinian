import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Settings, Mail, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { IncineratorEffect } from '../components/IncineratorEffect';

interface Envelope {
  id: number;
  content: string;
  created_at: string;
}

interface EnvelopeViewProps {
  newEnvelope: string;
  setNewEnvelope: (val: string) => void;
  handleSendEnvelope: () => void;
  envelopes: Envelope[];
}

export const EnvelopeView: React.FC<EnvelopeViewProps> = ({
  newEnvelope,
  setNewEnvelope,
  handleSendEnvelope,
  envelopes
}) => {
  const [isBurning, setIsBurning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const startPress = useCallback(() => {
    if (!newEnvelope.trim()) return;
    setIsPressing(true);
    const timer = setTimeout(() => {
      setIsBurning(true);
      setIsPressing(false);
    }, 1500);
    setPressTimer(timer);
  }, [newEnvelope]);

  const endPress = useCallback(() => {
    setIsPressing(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  }, [pressTimer]);

  const onBurnComplete = () => {
    handleSendEnvelope();
    setIsBurning(false);
  };

  return (
    <div className="flex flex-col pt-12 pb-32 h-full relative">
      <IncineratorEffect isActive={isBurning} onComplete={onBurnComplete} />
      
      <div className="w-full px-8 flex justify-between items-center mb-12">
        <ArrowLeft size={24} className="text-zen-text-muted" />
        <h2 className="text-sm font-bold tracking-widest text-zen-text uppercase">破执</h2>
        <button onClick={() => setShowHistory(!showHistory)} className="text-zen-text-muted hover:text-zen-text transition-colors">
          <History size={24} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div
            key="input-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-8 flex-1 flex flex-col"
          >
            <div className="card-clean p-8 flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]">
              <motion.div 
                animate={isBurning ? { opacity: 0, scale: 0.95, filter: 'blur(10px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="flex-1 flex flex-col"
              >
                <textarea
                  value={newEnvelope}
                  onChange={(e) => setNewEnvelope(e.target.value)}
                  disabled={isBurning}
                  placeholder="此刻疯狂的念头，写下来，让它随火而去..."
                  className="w-full flex-1 bg-transparent border-none focus:ring-0 text-lg text-zen-text placeholder-zen-text-muted/30 resize-none font-serif leading-relaxed"
                />
              </motion.div>
              
              <div className="flex flex-col items-center mt-8">
                <motion.button
                  onMouseDown={startPress}
                  onMouseUp={endPress}
                  onMouseLeave={endPress}
                  onTouchStart={startPress}
                  onTouchEnd={endPress}
                  animate={isBurning ? { opacity: 0, scale: 0 } : (isPressing ? { scale: 0.9, backgroundColor: '#f97316' } : { scale: 1 })}
                  className="w-20 h-20 rounded-full flex items-center justify-center bg-zen-accent text-white shadow-xl transition-all duration-500"
                >
                  <motion.div
                    animate={isPressing ? { rotate: [0, 45, -45, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    {isPressing ? <History size={32} className="animate-pulse" /> : <Mail size={32} />}
                  </motion.div>
                </motion.button>
                <motion.p 
                  animate={isBurning ? { opacity: 0 } : { opacity: 1 }}
                  className="mt-4 text-[10px] font-bold text-zen-text-muted uppercase tracking-[0.2em]"
                >
                  {isPressing ? "释放中..." : (newEnvelope.trim() ? "长按以释放念头" : "写下念头以解锁释放")}
                </motion.p>
              </div>

              {isPressing && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-orange-500"
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-8 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] no-scrollbar"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-zen-text-muted uppercase tracking-widest">往日执念</h4>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-[10px] font-bold text-zen-accent border border-zen-accent/30 px-2 py-1 rounded"
              >
                返回
              </button>
            </div>
            {envelopes.map((env) => (
              <motion.div
                key={env.id}
                className="card-clean p-6 opacity-60 hover:opacity-100 transition-opacity"
              >
                <p className="text-sm text-zen-text-muted font-serif leading-relaxed line-clamp-3">{env.content}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-zen-text-muted font-bold uppercase tracking-widest">
                  <Mail size={12} />
                  已焚 · {formatDistanceToNow(new Date(env.created_at), { addSuffix: true, locale: zhCN })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
