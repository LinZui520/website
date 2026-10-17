/** 着色强度下限：只有一张照片的地区也要和“未访问”区分开 */
export const MIX_MIN = 0.25;

/** 着色强度上限：给 hover 的极值色留出空间，避免两者撞色 */
export const MIX_MAX = 0.85;

/** 无照片但需要显示为“已访问”的地区（如世界地图上的中国/台湾入口） */
export const FORCED_VISITED_INTENSITY = 0.5;

/**
 * 把照片数量映射为 0~1 的着色强度。
 * 用对数压缩长尾，避免一个照片极多的地区把其余地区压到几乎看不见；
 * 结果再映射到 [MIX_MIN, MIX_MAX]，保证已访问地区始终可见。
 */
export function photoIntensity(count: number, maxCount: number): number {
  if (count <= 0) return 0;
  if (maxCount <= 1) return MIX_MIN;
  const ratio = Math.min(1, Math.log1p(count) / Math.log1p(maxCount));
  return MIX_MIN + (MIX_MAX - MIX_MIN) * ratio;
}

/**
 * 按强度生成地区填充色：以 --map-ink 为最深色，与未访问色混合。
 * 两个操作数都是主题变量，明暗主题自动适配；oklab 保证插值感知均匀。
 */
export function fillWithIntensity(intensity: number): string {
  if (intensity <= 0) return 'var(--map-unvisited)';
  const percent = (intensity * 100).toFixed(1);
  return `color-mix(in oklab, var(--map-ink) ${percent}%, var(--map-unvisited))`;
}

/** 按照片数量生成地区填充色 */
export function getPhotoFill(count: number, maxCount: number): string {
  return fillWithIntensity(photoIntensity(count, maxCount));
}
