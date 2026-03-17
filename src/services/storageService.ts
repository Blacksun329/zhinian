export interface Post {
  id: number;
  content: string;
  candles: number;
  created_at: string;
}

export interface Envelope {
  id: number;
  content: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed_at?: string;
}

const STORAGE_KEYS = {
  TIMER: 'zhinian_timer',
  ENVELOPES: 'zhinian_envelopes',
  POSTS: 'zhinian_posts',
  TASKS: 'zhinian_tasks',
};

export const storageService = {
  // Timer
  getTimer: (): string => {
    let timer = localStorage.getItem(STORAGE_KEYS.TIMER);
    if (!timer) {
      timer = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.TIMER, timer);
    }
    return timer;
  },
  resetTimer: (): string => {
    const newDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.TIMER, newDate);
    return newDate;
  },

  // Envelopes
  getEnvelopes: (): Envelope[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ENVELOPES);
    return data ? JSON.parse(data) : [];
  },
  saveEnvelope: (content: string): void => {
    const envelopes = storageService.getEnvelopes();
    const newEnvelope: Envelope = {
      id: Date.now(),
      content,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ENVELOPES, JSON.stringify([newEnvelope, ...envelopes]));
  },

  // Posts
  getPosts: (): Post[] => {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },
  savePost: (content: string): void => {
    const posts = storageService.getPosts();
    const newPost: Post = {
      id: Date.now(),
      content,
      candles: 0,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([newPost, ...posts]));
  },
  lightCandle: (id: number): void => {
    const posts = storageService.getPosts();
    const updated = posts.map(p => p.id === id ? { ...p, candles: p.candles + 1 } : p);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  },

  // Tasks
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  getCompletedTasks: (): number[] => {
    const data = localStorage.getItem('zhinian_completed_tasks');
    return data ? JSON.parse(data) : [];
  },
  saveCompletedTasks: (tasks: number[]): void => {
    localStorage.setItem('zhinian_completed_tasks', JSON.stringify(tasks));
  }
};
