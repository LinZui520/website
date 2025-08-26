import { useEffect, useRef, useCallback } from 'react';
import { PhotoVO } from '../pages/trail/type';

interface MasonryLayoutOptions {
  columnCount?: {
    default: number;
    768: number;
    1280: number;
  };
  gap?: {
    default: number;
    768: number;
    1280: number;
  };
}

const useMasonryLayout = (items: PhotoVO[], options: MasonryLayoutOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useRef 存储配置，避免依赖项变化
  const configRef = useRef({
    columnCount: options.columnCount || { default: 1, 768: 2, 1280: 3 },
    gap: options.gap || { default: 16, 768: 48, 1280: 72 }
  });

  // 创建稳定的 layoutItems 函数，没有外部依赖
  const layoutItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { columnCount, gap } = configRef.current;
    const width = window.innerWidth;

    // 直接计算列数和间距，避免依赖外部函数
    const cols = width >= 1280 ? columnCount[1280] : width >= 768 ? columnCount[768] : columnCount.default;
    const currentGap = width >= 1280 ? gap[1280] : width >= 768 ? gap[768] : gap.default;

    const containerWidth = container.offsetWidth;
    const itemWidth = (containerWidth - currentGap * (cols - 1)) / cols;

    // 初始化列高度数组
    const columnHeights = new Array(cols).fill(0);

    // 获取所有子元素
    const items = Array.from(container.children) as HTMLElement[];

    items.forEach((item) => {
      // 找到最短的列
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // 设置元素样式
      item.style.display = 'block';
      item.style.position = 'absolute';
      item.style.width = `${itemWidth}px`;
      item.style.left = `${shortestColumnIndex * (itemWidth + currentGap)}px`;
      item.style.top = `${columnHeights[shortestColumnIndex]}px`;

      // 更新列高度
      const itemHeight = item.offsetHeight;
      columnHeights[shortestColumnIndex] += itemHeight + currentGap;
      // 更新容器高度
      container.style.height = `${Math.max(...columnHeights)}px`;
    });
  }, []);

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', layoutItems);

    return () => window.removeEventListener('resize', layoutItems);
  }, [layoutItems]);

  // 当新项目添加时重新布局
  useEffect(() => layoutItems(), [items.length, layoutItems]);

  return { containerRef, layoutItems };
};

export default useMasonryLayout;
