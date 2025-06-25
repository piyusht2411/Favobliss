import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  disabled?: boolean;
}

export const IconButton = ({
  onClick,
  icon,
  className,
  disabled,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center bg-white shadow-md p-2 hover:scale-110 transition",
        className
      )}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};
