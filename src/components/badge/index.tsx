import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "danger";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let variantClass = "";

  switch (variant) {
    case "default":
      variantClass = "bg-primary text-white";
      break;
    case "secondary":
      variantClass = "bg-secondary text-white";
      break;
    case "destructive":
      variantClass = "bg-danger text-white";
      break;
    case "outline":
      variantClass = "border border-secondary text-secondary bg-transparent";
      break;
    default:
      variantClass = "bg-primary text-white";
  }

  return (
    <span
      className={`badge rounded-pill px-3 py-1 fw-semibold ${variantClass} ${className}`}
      {...props}
    />
  );
}
