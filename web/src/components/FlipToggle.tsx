import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  options: [Option<T>, Option<T>];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

function FlipToggle<T>({ options, value, onChange, className = '' }: Props<T>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const prevValueRef = useRef<T>(value);

  // 始终由动画中点驱动更新，避免标签提前变化
  const [displayValue, setDisplayValue] = useState<T>(value);

  const currentLabel = options.find((option) => option.value === displayValue)?.label ?? '';

  const flipTo = useCallback((target: T, onMidpoint?: () => void) => {
    if (!cardRef.current) return;
    isAnimating.current = true;
    gsap.timeline({ onComplete: () => { isAnimating.current = false; } })
      .to(cardRef.current, { rotationY: 90, duration: 0.18, ease: 'power2.in' })
      .call(() => {
        setDisplayValue(target);
        onMidpoint?.();
      })
      .to(cardRef.current, { rotationY: 0, duration: 0.18, ease: 'power2.out' });
  }, []);

  // 响应外部 value 变化（如地图内部点击）
  useEffect(() => {
    const changed = value !== prevValueRef.current;
    prevValueRef.current = value;

    // 内部点击已发起动画，跳过；此时 setDisplayValue 已在 flipTo 的 onMidpoint 里处理
    if (!changed || isAnimating.current) return;

    flipTo(value);
  }, [value, flipTo]);

  const handleClick = () => {
    if (isAnimating.current) return;
    const next = options.find((option) => option.value !== displayValue)!;
    flipTo(next.value, () => onChange(next.value));
  };

  return (
    <div className={`h-16 w-16 flex items-center justify-center ${className}`} style={{ perspective: '400px' }}>
      <div
        className={
          'h-8 w-12 border border-mint-950 dark:border-mint-50 font-mono cursor-pointer ' +
          'flex items-center justify-center text-sm select-none transition-opacity duration-150 ' +
          'text-mint-950 dark:text-mint-50 hover:opacity-60'
        }
        onClick={handleClick}
        ref={cardRef}
      >
        {currentLabel}
      </div>
    </div>
  );
}

export default FlipToggle;
