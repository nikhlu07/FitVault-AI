import { useNavigate } from "react-router-dom";

interface DeployButtonProps {
  label: string;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const DeployButton = ({ label, to, onClick, disabled }: DeployButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="bg-infrared px-8 py-4 font-display text-sm uppercase tracking-[0.15em] font-bold text-foreground transition-all hover:shadow-[0_0_0_2px_hsl(var(--absolute-white)),0_0_0_4px_hsl(var(--vantablack))] disabled:opacity-50"
    >
      {label}
    </button>
  );
};

export default DeployButton;
