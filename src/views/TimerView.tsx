import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Wind, Moon, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';
import { cn } from '../lib/utils';
import { CircularTimer } from '../components/CircularTimer';
import { getZenRank } from '../utils/zenRanks';

interface TimerViewProps {
  startDate: Date | null;
  currentTime: Date;
  zenQuote: string;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  setShowSOS: (show: boolean) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  startDate,
  currentTime,
  zenQuote,
  isMusicPlaying,
  toggleMusic,
  setShowSOS
}) => {
  if (!startDate) return null;
  const diff = differenceInSeconds(currentTime, startDate);
  const days = Math.floor(diff / (24 * 3600));
  const hours = Math.floor((diff % (24 * 3600)) / 3600);
  
  const zenRank = getZenRank(days);

  // Calculate progress for the dial (e.g., 21 days is a milestone)
  const progress = Math.min((days / 21) * 100, 100);

  return (
    <div className="flex flex-col items-center pt-[var(--safe-area-inset-top)] pb-32">
      <div className="w-full px-8 flex justify-between items-center h-16 mb-4">
        <ArrowLeft size={24} className="text-zen-text-muted cursor-pointer" />
        <h2 className="text-sm font-bold tracking-widest text-zen-text uppercase">止念计时</h2>
        <button 
          onClick={toggleMusic}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            isMusicPlaying ? "bg-zen-accent text-white" : "bg-zen-accent-light/20 text-zen-accent border border-zen-accent/10"
          )}
        >
          {isMusicPlaying ? <Wind size={20} className="animate-spin-slow" /> : <Moon size={20} />}
        </button>
      </div>

      {/* 顶部建议/设计区 (P0修正) */}
      <div className="w-full px-8 mb-8">
        <div className="card-clean p-6 bg-[#E9F1F2]/50 border-none shadow-none flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zen-accent/60 mb-1">今日正念建议</h3>
            <p className="text-sm font-serif text-zen-text font-bold leading-relaxed line-clamp-2">
              静坐片刻，剥离杂念。感受呼吸的进出。
            </p>
          </div>
          <motion.div 
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-zen-accent/10"
          >
            <Sparkles size={48} />
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2 text-zen-accent">
          <Moon size={16} fill="currentColor" />
          <span className="text-sm font-bold">目前境界</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-zen-text">{zenRank.description}</h3>
      </div>

      <CircularTimer 
        days={days} 
        progress={progress} 
        rankName={zenRank.name}
        rankColor={zenRank.color}
      />

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-zen-text-muted">
          <RefreshCw size={14} />
          <span className="text-sm font-medium">已坚持 {days} 天 {hours} 小时</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSOS(true)}
          className="px-12 py-4 glass-button-primary rounded-full font-bold tracking-widest text-sm uppercase"
        >
          一键止念
        </motion.button>
      </div>

      <div className="mt-16 w-full px-8">
        <div className="card-clean p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-zen-50 border border-zen-200 rounded-2xl flex items-center justify-center text-zen-text">
            <Sparkles size={24} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-zen-text-muted font-bold uppercase tracking-widest mb-1">每日提醒</p>
            <p className="text-sm text-zen-text font-serif italic">“{zenQuote}”</p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full px-8 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-zen-text uppercase tracking-widest">最近任务</h4>
          <ChevronRight size={20} className="text-zen-text-muted" />
        </div>
        <div className="space-y-4">
          <div className="card-clean p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-zen-50 border border-zen-200 rounded-xl flex items-center justify-center text-zen-text">
              <Wind size={20} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-zen-text">完成一次冥想呼吸</p>
          </div>
        </div>
      </div>
    </div>
  );
};
