import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  Sparkles, 
  RefreshCw, 
  Wind, 
  CheckCircle2, 
  Heart,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

interface TasksViewProps {
  completedTasks: number[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<number[]>>;
}

type Category = 'body' | 'feeling' | 'action';

interface Task {
  id: number;
  title: string;
  desc: string;
  icon: any;
  category: Category;
  points: number;
}

export const TasksView: React.FC<TasksViewProps> = ({
  completedTasks,
  setCompletedTasks
}) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const coreGoal = "找回曾经那个专注、热爱生活的自己";

  const dailyTasks: Task[] = [
    { id: 1, title: "清理一件旧物", desc: "扔掉或收起一件让你想起过去的物品", icon: Sparkles, category: 'feeling', points: 10 },
    { id: 2, title: "早睡 30 分钟", desc: "给身体一个深度的修复机会", icon: Activity, category: 'body', points: 15 },
    { id: 3, title: "深呼吸 5 分钟", desc: "感受空气在肺部的进出", icon: Wind, category: 'feeling', points: 5 },
    { id: 4, title: "学习一项新技能", desc: "把注意力集中在成长上", icon: Zap, category: 'action', points: 20 },
    { id: 5, title: "换个壁纸", desc: "给视觉系统一个清爽的信号", icon: RefreshCw, category: 'feeling', points: 5 },
    { id: 6, title: "运动 20 分钟", desc: "产生天然的多巴胺", icon: Heart, category: 'body', points: 15 }
  ];

  const categories = [
    { id: 'all', label: '全部', color: 'bg-zinc-100' },
    { id: 'body', label: '色 · 身体', color: 'bg-emerald-50 text-emerald-700' },
    { id: 'feeling', label: '受 · 感受', color: 'bg-blue-50 text-blue-700' },
    { id: 'action', label: '行 · 行动', color: 'bg-purple-50 text-purple-700' },
  ];

  const toggleTask = (id: number) => {
    setCompletedTasks(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const filteredTasks = activeCategory === 'all' 
    ? dailyTasks 
    : dailyTasks.filter(t => t.category === activeCategory);

  const totalPoints = dailyTasks.reduce((acc, t) => acc + (completedTasks.includes(t.id) ? t.points : 0), 0);
  const maxPoints = dailyTasks.reduce((acc, t) => acc + t.points, 0);
  const progress = (totalPoints / maxPoints) * 100;

  return (
    <div className="flex flex-col pt-[var(--safe-area-inset-top)] pb-32 px-8 h-full">
      <div className="w-full flex justify-between items-center h-16 mb-4">
        <ArrowLeft size={24} className="text-zen-text-muted cursor-pointer" />
        <h2 className="text-sm font-bold tracking-widest text-zen-text uppercase">重塑自我</h2>
        <Bell size={24} className="text-zen-text-muted" />
      </div>

      <div className="mb-8">
        <div className="card-clean p-6 bg-[#E9F1F2]/50 border-none shadow-none flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zen-accent/60 mb-2">成长状态</h3>
            <p className="text-sm font-serif text-zen-text font-bold leading-relaxed">
              您正在逐步找回专注的自己
            </p>
          </div>
          <Activity size={40} className="text-zen-accent/10" />
        </div>
      </div>

      <div className="mb-10">
        <div className="card-clean p-6 bg-zen-accent text-white border-none shadow-lg shadow-zen-accent/20 overflow-hidden relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -right-12 text-white/5"
          >
            <Target size={120} />
          </motion.div>
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">核心重塑目标</h3>
            <p className="text-lg font-serif italic text-white/90 leading-relaxed font-bold">“{coreGoal}”</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <h4 className="text-xs font-bold text-zen-text uppercase tracking-widest">今日正念值</h4>
          <span className="text-xl font-mono font-black text-zen-accent">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-zen-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
        </div>
        <p className="text-[10px] text-zen-text-muted mt-2 font-bold uppercase tracking-widest">距离完成今日重塑还有 {maxPoints - totalPoints} 点影响力</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border",
              activeCategory === cat.id 
                ? "bg-zen-accent text-white border-transparent" 
                : "bg-white text-zen-text-muted border-zinc-100"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 pb-12">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => toggleTask(task.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "card-clean p-5 flex items-center gap-5 group cursor-pointer transition-all duration-300",
                  isCompleted && "bg-zinc-50/50 opacity-70"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-all duration-300 border flex items-center justify-center",
                  isCompleted ? "bg-white text-zen-accent border-zinc-100" : "bg-zen-accent-light/10 text-zen-accent border-transparent"
                )}>
                  <task.icon size={20} strokeWidth={2} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                      task.category === 'body' ? 'bg-emerald-50 text-emerald-600' :
                      task.category === 'feeling' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    )}>
                      {task.category}
                    </span>
                    <span className="text-[8px] font-black text-zen-accent">+{task.points}</span>
                  </div>
                  <h3 className={cn(
                    "font-bold text-sm transition-all duration-300 truncate",
                    isCompleted ? "text-zen-text-muted" : "text-zen-text"
                  )}>
                    {task.title}
                  </h3>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-zen-accent flex items-center justify-center text-white">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-200" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
