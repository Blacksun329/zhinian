import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface TabButtonProps {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 relative flex-1",
      active ? "text-zen-accent" : "text-zen-text-muted hover:text-zen-text"
    )}
  >
    <div className="relative mb-1">
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-zen-accent rounded-full"
        />
      )}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
