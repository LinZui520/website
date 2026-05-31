/**
 * 从 localStorage 读取 seed；首次访问时生成并存储
 */
const SEED_KEY = 'ZHUGUI_SEED';

const initSeed = (): number => {
  const stored = localStorage.getItem(SEED_KEY);
  if (stored !== null) {
    const parsed = parseInt(stored, 10);
    if (Number.isFinite(parsed)) return parsed;
    // 不合法（用户手动篡改）：清除旧值，重新生成
    localStorage.removeItem(SEED_KEY);
  }
  const seed = Math.floor(Math.random() * 0x100000000);
  localStorage.setItem(SEED_KEY, String(seed));
  return seed;
};

/**
 * Mulberry32 伪随机数生成器
 * 每次调用推进内部状态，返回不同的值，整个序列由 seed 决定
 */
const createRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    // [0, 1)
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
};

const rng = createRng(initSeed());

/**
 * 返回 [3, 5) * scale 秒的随机延迟
 * 每次调用值不同，序列由用户专属 seed 决定
 */
export const random = (scale = 1): number => (3 + rng() * 2) * scale;
