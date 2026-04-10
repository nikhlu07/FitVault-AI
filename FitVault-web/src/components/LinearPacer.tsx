interface LinearPacerProps {
  currentDay: number;
  totalDays: number;
}

const LinearPacer = ({ currentDay, totalDays }: LinearPacerProps) => {
  const progress = (currentDay / totalDays) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
          DAY {currentDay} / {totalDays}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">
          {Math.round(progress)}% COMPLETE
        </span>
      </div>
      <div className="relative h-2 bg-optical-ash w-full">
        <div
          className="absolute inset-y-0 left-0 bg-foreground transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        {/* Infrared playhead */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[2px] h-7 bg-infrared transition-all duration-500"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LinearPacer;
