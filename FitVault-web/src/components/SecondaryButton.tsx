interface SecondaryButtonProps {
  label: string;
  onClick?: () => void;
}

const SecondaryButton = ({ label, onClick }: SecondaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-transparent px-6 py-3 font-display text-xs uppercase tracking-[0.15em] font-semibold text-foreground overflow-hidden border-b-2 border-infrared transition-all duration-300"
    >
      <span className="absolute inset-0 bg-infrared transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <span className="relative z-10 group-hover:text-foreground transition-colors duration-300">
        {label}
      </span>
    </button>
  );
};

export default SecondaryButton;
