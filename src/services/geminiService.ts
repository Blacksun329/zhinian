// Gemini API 临时屏蔽，未配置 API Key
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const QUOTE_POOL = {
  0: [ // 困兽
    "念头如云，你如天空。云会散去，天空永恒。",
    "万事起于一瞬，止于静心。",
    "此刻的痛苦，是觉醒的前奏。",
    "不要与念头搏斗，看护它，随它去。"
  ],
  1: [ // 见山
    "山是山，水是水。看清事物的本来面目。",
    "不再逃避，便是勇敢的开始。",
    "心有所定，万物不挠。",
    "静坐常思己过，闲谈莫论人非。"
  ],
  2: [ // 听风
    "风起于青萍之末，止于林木之间。",
    "听外界嘈杂，见内心清朗。",
    "世界从未变过，变的是你的眼睛。",
    "顺应自然，不疾不徐。"
  ],
  3: [ // 拔剑
    "斩断乱麻，需有大勇之心。",
    "真正的自由，是拥有拒绝诱惑的权力。",
    "你是自己世界的守门人。",
    "克制，是通往高贵的唯一路径。"
  ],
  4: [ // 明心
    "菩提本无树，明镜亦非台。",
    "照见五蕴皆空，度一切苦厄。",
    "心如朗月，何惧阴霾。",
    "世界即是你，你即是世界。"
  ],
  5: [ // 归真
    "返璞归真，大象无形。",
    "一花一世界，一叶一菩提。",
    "生命本自具足，无需外求。",
    "心安之处，即是故乡。"
  ]
};

export async function getZenQuote(rank: number = 0) {
  const quotes = QUOTE_POOL[rank as keyof typeof QUOTE_POOL] || QUOTE_POOL[0];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
