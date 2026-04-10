import { useState, useEffect, useRef } from "react";

const CHARS = "0123456789X!#$%&";

export function useScramble(finalValue: string, duration = 400, trigger?: number) {
  const [display, setDisplay] = useState(finalValue);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    const len = finalValue.length;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const lockedChars = Math.floor(progress * len);

      let result = "";
      for (let i = 0; i < len; i++) {
        if (i < lockedChars) {
          result += finalValue[i];
        } else if (finalValue[i] === " " || finalValue[i] === "," || finalValue[i] === ".") {
          result += finalValue[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(finalValue);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [finalValue, duration, trigger]);

  return display;
}
