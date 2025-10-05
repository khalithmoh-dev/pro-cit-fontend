import * as React from "react"
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button"

type Variant = "submit" | "cancel" | "reset | add"
type size = "sm" | "md" | "lg"

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variantType?: Variant
  sizeType?: size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variantType = "submit", sizeType = "md", ...props }, ref) => {
    // Size styles (shadcn style)
    const sizeStyles =
      sizeType === "sm"
        ? { padding: "6px 14px", fontSize: "0.8rem" }
        : sizeType === "lg"
        ? { padding: "12px 24px", fontSize: "1rem" }
        : { padding: "8px 18px", fontSize: "0.875rem" }

    // Variant styles
    const variantStyles =
      variantType === "submit"
        ? {
            backgroundColor: "#2563eb", // blue-600
            color: "#fff",
            "&:hover": { backgroundColor: "#1d4ed8" }, // blue-700
          }
        : variantType === "cancel"
        ? {
            backgroundColor: "#dc2626", // red-600
            color: "#fff",
            "&:hover": { backgroundColor: "#b91c1c" }, // red-700
          }
        : {
            backgroundColor: "#9ca3af", // gray-400
            color: "#fff",
            "&:hover": { backgroundColor: "#6b7280" }, // gray-500
          }

    return (
      <MuiButton
        ref={ref}
        disableElevation
        sx={{
          borderRadius: "0.5rem",
          fontWeight: 500,
          textTransform: "none",
          ...sizeStyles,
          ...variantStyles,
        }}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export default Button
