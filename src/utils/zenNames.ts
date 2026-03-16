const ZEN_PREFIXES = ["无名", "听雨", "扫雪", "坐忘", "拾叶", "看山", "问水", "寻梅", "点灯", "披星", "戴月", "随风"];
const ZEN_SUFFIXES = ["僧", "客", "人", "子", "翁", "徒", "友", "居士", "行者", "使者"];

export const generateZenName = () => {
  const prefix = ZEN_PREFIXES[Math.floor(Math.random() * ZEN_PREFIXES.length)];
  const suffix = ZEN_SUFFIXES[Math.floor(Math.random() * ZEN_SUFFIXES.length)];
  return `${prefix}${suffix}`;
};
