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
  const {
    columnCount = { default: 1, 768: 2, 1280: 3 },
    gap = { default: 16, 768: 48, 1280: 72 }
  } = options;

  const getColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return columnCount[1280];
    if (width >= 768) return columnCount[768];
    return columnCount.default;
  }, [columnCount]);

  const getGap = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return gap[1280];
    if (width >= 768) return gap[768];
    return gap.default;
  }, [gap]);

  const layoutItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cols = getColumnCount();
    const currentGap = getGap();
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
  }, [getColumnCount, getGap]);

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', layoutItems);

    return () => window.removeEventListener('resize', layoutItems);
  }, [items, layoutItems]);

  // 当新项目添加时重新布局
  useEffect(() => layoutItems(), [items, items.length, layoutItems]);

  return { containerRef, layoutItems };
};

export default useMasonryLayout;
