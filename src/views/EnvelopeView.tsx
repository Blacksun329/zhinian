import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Settings, Mail, History, Flame, Mic, Edit3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '../lib/utils';
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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  const stopVoice = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startVoice = useCallback(() => {
    // Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("您的浏览器不支持语音识别");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setNewEnvelope(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        stopVoice();
      };

      recognitionRef.current = recognition;
    }

    setIsListening(true);
    recognitionRef.current.start();
  }, [setNewEnvelope, stopVoice]);

  const onBurnComplete = () => {
    handleSendEnvelope();
    setIsBurning(false);
  };

  return (
    <div className="flex flex-col pt-[var(--safe-area-inset-top)] pb-32 h-full relative">
      <IncineratorEffect isActive={isBurning} onComplete={onBurnComplete} />
      
      <div className="w-full px-8 flex justify-between items-center h-16 mb-4">
        <ArrowLeft size={24} className="text-zen-text-muted cursor-pointer" />
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
              
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-center justify-center gap-8 mb-4 relative w-full px-12">
                  <button 
                    className="w-14 h-14 rounded-full bg-white border border-zen-200 flex flex-col items-center justify-center text-zen-text-muted hover:text-zen-accent transition-all active:scale-95 shadow-sm"
                  >
                    <Edit3 size={20} className="mb-0.5" />
                    <span className="text-[8px] font-black uppercase">手写</span>
                  </button>

                  <motion.button
                    onMouseDown={startPress}
                    onMouseUp={endPress}
                    onMouseLeave={endPress}
                    onTouchStart={(e) => { e.preventDefault(); startPress(); }}
                    onTouchEnd={(e) => { e.preventDefault(); endPress(); }}
                    style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                    animate={isBurning ? { opacity: 0, scale: 0 } : (isPressing ? { scale: 0.85, filter: 'brightness(1.2)' } : { scale: 1 })}
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] z-10 overflow-hidden group"
                  >
                    <motion.div
                      animate={isPressing ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 2, -2, 0],
                        backgroundColor: ['#ea580c', '#f97316', '#ea580c']
                      } : {}}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <Flame size={32} className={cn("transition-transform duration-500", isPressing && "scale-125")} />
                      <span className="text-[10px] font-black mt-1 uppercase tracking-widest">{isPressing ? "燃起" : "入火"}</span>
                    </motion.div>
                  </motion.button>

                  <button 
                    onMouseDown={startVoice}
                    onMouseUp={stopVoice}
                    onTouchStart={(e) => { e.preventDefault(); startVoice(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopVoice(); }}
                    className={cn(
                      "w-14 h-14 rounded-full border flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm",
                      isListening ? "bg-zen-accent text-white border-transparent animate-pulse" : "bg-white text-zen-text-muted border-zen-200"
                    )}
                  >
                    <Mic size={20} className="mb-0.5" strokeWidth={isListening ? 3 : 2} />
                    <span className="text-[8px] font-black uppercase">{isListening ? "转换" : "语音"}</span>
                  </button>
                </div>

                <motion.p 
                  animate={isBurning ? { opacity: 0 } : { opacity: 1 }}
                  className="mt-6 text-[10px] font-bold text-zen-text-muted uppercase tracking-[0.2em] text-center"
                >
                  {isListening ? "正在将您的声音转为文字..." : (isPressing ? "让念头随火焰消散..." : (newEnvelope.trim() ? "长按中部圆饼焚毁" : "写下执念，或按住语音转换"))}
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
