import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "outline" | "solid";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "solid",
  size = "md",
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all";
  const variantStyles =
    variant === "outline"
      ? "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeStyles =
    size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-lg py-3 px-6"
      : "text-md";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </button>
  );
};
