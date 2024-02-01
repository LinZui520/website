import React, {useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  speed: number;
  waitTime: number;
}

const TypingEffect: React.FC<TypingEffectProps> = React.memo(({ text, speed, waitTime }) => {

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFinish(() => currentIndex === text.length - 1);
      setDisplayText((prevText) => finish ? "" : prevText + text[currentIndex]);
      setCurrentIndex((prevIndex) => finish ? 0 : prevIndex + 1);
    }, finish ? waitTime : speed);

    return () => clearInterval(intervalId);
  }, [currentIndex, text, speed, waitTime, finish]);

  return <span>{displayText}</span>
})

export default TypingEffect;