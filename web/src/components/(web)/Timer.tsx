'use client'

import { useEffect, useState } from "react";

const Timer = () => {

  const [count, setCount] = useState(Math.floor(new Date().getTime() / 1000 - new Date(2023, 10, 11, 0, 0, 0).getTime() / 1000))

  useEffect(() => {
    const intervalId = setInterval(() => setCount(prevCount => prevCount + 1), 1000)

    return () => clearInterval(intervalId);
  }, [])

  const formatTime = (time: number): string => {
    const years = Math.floor(time / (365 * 24 * 60 * 60));
    const remainingSecondsInYear = time % (365 * 24 * 60 * 60);

    const months = Math.floor(remainingSecondsInYear / (30 * 24 * 60 * 60));
    const remainingSecondsInMonth = remainingSecondsInYear % (30 * 24 * 60 * 60);

    const days = Math.floor(remainingSecondsInMonth / (24 * 60 * 60));
    const remainingSecondsInDay = remainingSecondsInMonth % (24 * 60 * 60);

    const hours = Math.floor(remainingSecondsInDay / (60 * 60));
    const remainingSecondsInHour = remainingSecondsInDay % (60 * 60);

    const minutes = Math.floor(remainingSecondsInHour / 60);
    const remainingSecondsInMinute = remainingSecondsInHour % 60;

    const seconds = Math.floor(remainingSecondsInMinute);

    return `${years}年 ${months}月 ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
  };


  return <span>{formatTime(count)}</span>
};

export default Timer;
