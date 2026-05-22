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

  // 每次渲染都同步最新 options，避免 layoutItems 闭包内读到旧值
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const layoutItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const columnCount = optionsRef.current.columnCount || { default: 1, 768: 2, 1280: 3 };
    const gap = optionsRef.current.gap || { default: 16, 768: 48, 1280: 72 };
    const width = window.innerWidth;

    const cols = width >= 1280 ? columnCount[1280] : width >= 768 ? columnCount[768] : columnCount.default;
    const currentGap = width >= 1280 ? gap[1280] : width >= 768 ? gap[768] : gap.default;

    const containerWidth = container.offsetWidth;
    const itemWidth = (containerWidth - currentGap * (cols - 1)) / cols;
    const columnHeights = new Array(cols).fill(0);

    const children = Array.from(container.children) as HTMLElement[];

    children.forEach((child) => {
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));

      child.style.display = 'block';
      child.style.position = 'absolute';
      child.style.width = `${itemWidth}px`;
      child.style.left = `${shortestCol * (itemWidth + currentGap)}px`;
      child.style.top = `${columnHeights[shortestCol]}px`;

      // 图片未加载完时高度不准确，加载后重新布局
      const pendingImgs = (Array.from(child.querySelectorAll('img')) as HTMLImageElement[])
        .filter((img) => !img.complete);
      pendingImgs.forEach((img) => {
        img.addEventListener('load', layoutItems, { once: true });
        img.addEventListener('error', layoutItems, { once: true });
      });

      columnHeights[shortestCol] += child.offsetHeight + currentGap;
    });

    // 循环结束后统一写一次容器高度（columnHeights 末尾已含 gap，保留作为底部间距）
    container.style.height = `${children.length > 0 ? Math.max(...columnHeights) : 0}px`;
  }, []);

  // 用 ResizeObserver 监听容器宽度变化，比 window.resize 更精准
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(layoutItems);
    observer.observe(container);

    return () => observer.disconnect();
  }, [layoutItems]);

  // items 数量变化时重新布局
  useEffect(() => {
    layoutItems();
  }, [items.length, layoutItems]);

  return { containerRef, layoutItems };
};

export default useMasonryLayout;
