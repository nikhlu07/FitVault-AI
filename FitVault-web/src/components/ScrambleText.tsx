import { useScramble } from "@/hooks/useScramble";

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: number;
  duration?: number;
}

const ScrambleText = ({ text, className = "", trigger, duration = 400 }: ScrambleTextProps) => {
  const display = useScramble(text, duration, trigger);
  return <span className={className}>{display}</span>;
};

export default ScrambleText;
