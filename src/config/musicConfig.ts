export interface MusicTrack {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'track1', title: '高山流水 - 古琴', url: '/bgm.mp3', tags: ['东方', '清净', '古琴'] },
  { id: 'track2', title: '空山鸟语 - 笛声', url: '/music/flute_birds.mp3', tags: ['东方', '森林', '笛声'] },
  { id: 'track3', title: '雨打芭蕉 - 雨声', url: '/music/rain_zen.mp3', tags: ['自然', '雨声', '冥想'] },
  { id: 'track4', title: '禅茶一味 -  ambient', url: '/music/tea_ambient.mp3', tags: ['东方', '平静', '环境音'] },
];
