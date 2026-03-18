import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Flame, Sparkles, Wind, X, MessageSquareOff, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { generateZenName } from '../utils/zenNames';
import { storageService } from '../services/storageService';

interface Post {
  id: number;
  content: string;
  candles: number;
  created_at: string;
}

interface CommunityViewProps {
  newPost: string;
  setNewPost: (val: string) => void;
  handlePost: () => void;
  posts: Post[];
  lightCandle: (id: number) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  newPost,
  setNewPost,
  handlePost,
  posts,
  lightCandle
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [postNames, setPostNames] = useState<Record<number, string>>({});
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // Generate names for existing posts if not already present
    const names = { ...postNames };
    let changed = false;
    posts.forEach(post => {
      if (!names[post.id]) {
        names[post.id] = generateZenName();
        changed = true;
      }
    });
    if (changed) setPostNames(names);
  }, [posts]);

  const startPostFlow = () => {
    setIsMeditating(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setIsMeditating(false);
          setShowEditor(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const submitPost = () => {
    handlePost();
    setShowEditor(false);
  };

  const submitComment = (postId: number) => {
    if (!commentText.trim()) return;
    storageService.saveComment(postId, commentText);
    setCommentText('');
    setCommentingPostId(null);
    // Force refresh posts (ideally handle this via state lift or emitter)
    window.location.reload(); // Simple sync for now, or could pass a refresh handler
  };

  return (
    <div className="flex flex-col pt-[var(--safe-area-inset-top)] pb-32 h-full relative">
      <div className="w-full px-8 flex justify-between items-center h-16 mb-4">
        <ArrowLeft size={24} className="text-zen-text-muted cursor-pointer" />
        <h2 className="text-sm font-bold tracking-widest text-zen-text uppercase">同修</h2>
        <div className="w-6" />
      </div>

      <div className="px-8 mb-6">
        <div className="card-clean p-4 bg-zen-50 border-none flex items-center gap-3">
          <MessageSquareOff size={16} className="text-zen-text-muted" />
          <p className="text-[10px] font-bold text-zen-text-muted uppercase tracking-widest">这里只有陪伴，没有喧嚣</p>
        </div>
      </div>

      <div className="px-8 space-y-6 flex-1 overflow-y-auto no-scrollbar">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-2 border-zen-accent/10 pl-6 py-2 relative group"
          >
            <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-zen-accent/20 group-hover:bg-zen-accent transition-colors" />
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black tracking-widest text-zen-accent/60 uppercase">
                {postNames[post.id] || "同修人"}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <span className="text-[10px] font-bold text-zinc-400">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: zhCN })}
              </span>
            </div>

            <p className="text-base text-zen-text font-serif leading-relaxed mb-4 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => lightCandle(post.id)}
                className="flex items-center gap-2 text-zen-text-muted hover:text-zen-accent transition-colors py-1.5 px-4 rounded-full bg-zen-50 border border-transparent hover:border-zen-accent/20"
              >
                <Flame size={14} className={cn(post.candles > 0 && "text-orange-500")} />
                <span className="text-[10px] font-black">{post.candles || "同修"}</span>
              </button>
              
              <button 
                onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                className="flex items-center gap-2 text-zen-text-muted hover:text-zen-accent transition-colors py-1.5 px-4 rounded-full bg-zen-50 border border-transparent hover:border-zen-accent/20"
              >
                <MessageSquareOff size={14} />
                <span className="text-[10px] font-black">留言</span>
              </button>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-4 ml-2 space-y-3 bg-zen-50/50 p-4 rounded-2xl border border-zen-100/50">
                {post.comments.map(c => (
                  <div key={c.id} className="text-xs">
                    <span className="text-zen-accent font-black tracking-widest mr-2 uppercase opacity-50">同参:</span>
                    <span className="text-zen-text italic">{c.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Comment Input */}
            <AnimatePresence>
              {commentingPostId === post.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 flex gap-2 overflow-hidden"
                >
                  <input 
                    autoFocus
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="说点什么..."
                    className="flex-1 bg-white border border-zen-100 rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-zen-accent outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                  />
                  <button 
                    onClick={() => submitComment(post.id)}
                    className="px-4 py-2 bg-zen-accent text-white rounded-full text-[10px] font-bold"
                  >
                    发送
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <button
        onClick={startPostFlow}
        className="fixed bottom-32 right-8 w-14 h-14 rounded-full bg-zen-accent text-white shadow-xl shadow-zen-accent/20 flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
      >
        <Plus size={28} />
      </button>

      {/* Post Meditiation Barrier */}
      <AnimatePresence>
        {isMeditating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-4 border-zen-accent/20 flex items-center justify-center mb-8"
            >
              <span className="text-4xl font-serif font-bold text-zen-accent">{countdown}</span>
            </motion.div>
            <h3 className="text-xl font-serif font-bold text-zen-text mb-2">深呼吸，清净心</h3>
            <p className="text-sm text-zen-text-muted font-serif italic">“凡所有相，皆是虚妄。”</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[100] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <button onClick={() => setShowEditor(false)} className="text-zen-text-muted">
                <X size={24} />
              </button>
              <h3 className="text-sm font-bold tracking-widest text-zen-text uppercase">同修寄语</h3>
              <button
                onClick={submitPost}
                disabled={!newPost.trim()}
                className="text-zen-accent font-black tracking-widest text-sm uppercase disabled:opacity-30"
              >
                发布
              </button>
            </div>

            <textarea
              autoFocus
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="分享此刻的觉察，不求回应，只为记录..."
              className="flex-1 w-full bg-transparent border-none focus:ring-0 text-xl text-zen-text font-serif leading-relaxed resize-none p-0"
            />

            <div className="mt-8 p-6 bg-zen-50 rounded-[32px] border border-zen-100 flex items-center gap-4">
              <Sparkles className="text-zen-accent" size={24} />
              <p className="text-xs text-zen-text-muted font-serif leading-relaxed">
                “此刻您是：<span className="text-zen-accent font-bold">{generateZenName()}</span>。
                在这里，文字既出，便是尘埃落定。”
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
