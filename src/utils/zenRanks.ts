export interface ZenRank {
  level: number;
  name: string;
  description: string;
  color: string;
}

export const ZEN_RANKS: ZenRank[] = [
  { level: 1, name: "困兽", description: "念头汹涌，如困兽斗。", color: "text-zinc-400" },
  { level: 2, name: "见山", description: "见山是山，见水是水。", color: "text-emerald-400" },
  { level: 3, name: "听风", description: "两耳不闻，清风徐来。", color: "text-blue-400" },
  { level: 4, name: "拔剑", description: "拔剑断水，水更流？不，我自流。", color: "text-indigo-400" },
  { level: 5, name: "明心", description: "明心见性，不染尘埃。", color: "text-purple-400" },
  { level: 6, name: "归真", description: "返璞归真，万物齐一。", color: "text-orange-400" },
];

export const getZenRank = (days: number): ZenRank => {
  if (days < 1) return ZEN_RANKS[0];
  if (days < 3) return ZEN_RANKS[1];
  if (days < 7) return ZEN_RANKS[2];
  if (days < 14) return ZEN_RANKS[3];
  if (days < 21) return ZEN_RANKS[4];
  return ZEN_RANKS[5];
};
