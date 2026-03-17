import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Users, 
  Leaf, 
  Flame,
  Compass
} from 'lucide-react';

// Components
import { TabButton } from './components/TabButton';
import { SOSModal } from './components/SOSModal';
import { LiquidBackground } from './components/LiquidBackground';
import { storageService, Post, Envelope } from './services/storageService';

// Views
import { TimerView } from './views/TimerView';
import { EnvelopeView } from './views/EnvelopeView';
import { CommunityView } from './views/CommunityView';
import { TasksView } from './views/TasksView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'envelope' | 'tasks' | 'community'>('timer');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showSOS, setShowSOS] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newEnvelope, setNewEnvelope] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [zenQuote, setZenQuote] = useState('念头如云，你如天空。云会散去，天空永恒。');
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const shuffleTrack = () => {
    import('./config/musicConfig').then(m => {
      const nextIndex = Math.floor(Math.random() * m.MUSIC_TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    });
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
            const handleInteract = () => {
              audioRef.current?.play();
              setIsMusicPlaying(true);
              document.removeEventListener('click', handleInteract);
            };
            document.addEventListener('click', handleInteract);
          });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleTrackEnded = () => {
    shuffleTrack();
    setTimeout(() => {
      if (isMusicPlaying) audioRef.current?.play();
    }, 100);
  };

  const handleSendEnvelope = async () => {
    if (!newEnvelope.trim()) return;
    storageService.saveEnvelope(newEnvelope);
    setNewEnvelope('');
    setEnvelopes(storageService.getEnvelopes());
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    storageService.savePost(newPost);
    setNewPost('');
    setPosts(storageService.getPosts());
  };

  const lightCandle = async (id: number) => {
    storageService.lightCandle(id);
    setPosts(storageService.getPosts());
  };

  // Fetch initial data & Randomize music
  useEffect(() => {
    const fetchData = async () => {
      const startStr = storageService.getTimer();
      const start = new Date(startStr);
      setStartDate(start);

      setPosts(storageService.getPosts());
      setEnvelopes(storageService.getEnvelopes());
      setCompletedTasks(storageService.getCompletedTasks());

      const diffTime = Math.abs(new Date().getTime() - start.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      let rank = 0;
      if (diffDays >= 21) rank = 5;
      else if (diffDays >= 14) rank = 4;
      else if (diffDays >= 7) rank = 3;
      else if (diffDays >= 3) rank = 2;
      else if (diffDays >= 1) rank = 1;

      import('./services/geminiService').then(m => m.getZenQuote(rank).then(setZenQuote));
      shuffleTrack();
    };

    fetchData();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save tasks
  useEffect(() => {
    storageService.saveCompletedTasks(completedTasks);
  }, [completedTasks]);

  return (
    <div className="min-h-dvh bg-zinc-50 flex items-center justify-center md:p-4">
      <div className="w-full h-dvh md:max-w-md md:h-[844px] bg-white md:rounded-[3rem] flex flex-col relative overflow-hidden md:shadow-2xl md:border-[8px] md:border-white ring-1 ring-black/5">
        <LiquidBackground />
        {/* Dynamic Music System */}
        <audio 
          ref={audioRef} 
          src={(() => {
            try {
              // Note: this is a sync wrapper for a file that might be dynamic
              // Correct way would be to import it or use a separate state
              return currentTrackIndex === 0 ? "/bgm.mp3" : `/music/track_${currentTrackIndex}.mp3`;
            } catch {
              return "/bgm.mp3";
            }
          })()} 
          onEnded={handleTrackEnded}
          preload="auto"
        />

        <main className="flex-1 relative z-10 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'timer' && (
                <TimerView 
                  startDate={startDate}
                  currentTime={currentTime}
                  zenQuote={zenQuote}
                  isMusicPlaying={isMusicPlaying}
                  toggleMusic={toggleMusic}
                  setShowSOS={setShowSOS}
                />
              )}
              {activeTab === 'envelope' && (
                <EnvelopeView 
                  newEnvelope={newEnvelope}
                  setNewEnvelope={setNewEnvelope}
                  handleSendEnvelope={handleSendEnvelope}
                  envelopes={envelopes}
                />
              )}
              {activeTab === 'community' && (
                <CommunityView 
                  newPost={newPost}
                  setNewPost={setNewPost}
                  handlePost={handlePost}
                  posts={posts}
                  lightCandle={lightCandle}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksView 
                  completedTasks={completedTasks}
                  setCompletedTasks={setCompletedTasks}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="absolute bottom-0 left-0 right-0 z-50 glass-nav">
          <div className="px-6 h-24 flex justify-around items-center pb-4">
            <TabButton
              active={activeTab === 'timer'}
              icon={Leaf}
              label="观心"
              onClick={() => setActiveTab('timer')}
            />
            <TabButton
              active={activeTab === 'envelope'}
              icon={Flame}
              label="破执"
              onClick={() => setActiveTab('envelope')}
            />
            <TabButton
              active={activeTab === 'community'}
              icon={Users}
              label="同修"
              onClick={() => setActiveTab('community')}
            />
            <TabButton
              active={activeTab === 'tasks'}
              icon={Compass}
              label="重塑"
              onClick={() => setActiveTab('tasks')}
            />
          </div>
        </nav>

        <AnimatePresence>
          {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
