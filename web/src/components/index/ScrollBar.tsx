import React, {useCallback, useEffect, useRef, useState} from 'react';

function ScrollBar() {

  const scrollBarPosition = useRef(0)
  const scrollBarHeight = useRef(0)
  const scrollBarThumb = useRef<HTMLButtonElement>(null)
  const scrollBarTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const scrollBarDraggingOffset = useRef(0)

  useEffect(() => {
    const calculateScrollBarHeight = () => {
      const windowHeight = window.innerHeight
      const scrollHeight = document.body.scrollHeight

      scrollBarHeight.current = Math.round((windowHeight / scrollHeight) * 100)

      requestAnimationFrame(calculateScrollBarHeight)
    }

    calculateScrollBarHeight()

    window.addEventListener("resize", calculateScrollBarHeight)

    return () => window.removeEventListener("resize", calculateScrollBarHeight)
  }, [])

  useEffect(() => {
    const calculateScrollBarPosition = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.body.scrollHeight

      scrollBarPosition.current = Math.floor((scrollTop / scrollHeight) * 100)

      scrollBarThumb.current &&
      (scrollBarThumb.current.style.height = `${scrollBarHeight.current}%`) &&
      (scrollBarThumb.current.style.top = `${scrollBarPosition.current}%`)

      requestAnimationFrame(calculateScrollBarPosition)
    }

    calculateScrollBarPosition()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      scrollBarThumb.current && (scrollBarThumb.current.style.opacity = '1')

      scrollBarTimeout.current && clearTimeout(scrollBarTimeout.current)

      scrollBarTimeout.current = setTimeout(() => {
        scrollBarThumb.current && (scrollBarThumb.current.style.opacity = '0')
      }, 2000)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    scrollBarDraggingOffset.current = e.clientY - (scrollBarPosition.current * window.innerHeight / 100)
    setIsDragging(true)
  }

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const scrollHeight = document.body.scrollHeight
    const clickPosition = e.clientY - scrollBarDraggingOffset.current
    const newScrollTop = (clickPosition / window.innerHeight) * scrollHeight

    window.scrollTo(0, newScrollTop)
  }, [isDragging])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp, handleMouseMove, isDragging])

  return (
    <div className="fixed right-0 top-0 w-[8px] h-full" onMouseDown={handleMouseDown}>
      <button
        ref={scrollBarThumb}
        className="bg-[#c1c1c1] relative w-full rounded-[4px] opacity-0 cursor-default duration-500 ease-out transition-all"
      />
    </div>
  );
}

export default ScrollBar;

