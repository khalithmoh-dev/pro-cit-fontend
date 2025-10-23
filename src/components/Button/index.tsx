import * as React from "react"
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button"

export type Variant = "submit" | "cancel" | "reset" | "add" | "primary" | "button"
export type Size = "sm" | "md" | "lg"

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variantType?: Variant
  sizeType?: Size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variantType = "submit", 
    sizeType = "md", 
    className = "", 
    sx = {},
    ...props 
  }, ref) => {
    
    // Generate CSS class names based on props
    const getButtonClassNames = () => {
      const baseClass = "btn-base"
      const sizeClass = `btn-${sizeType}`
      const variantClass = `btn-${variantType}`
      
      return `${baseClass} ${sizeClass} ${variantClass} ${className}`.trim()
    }

    return (
      <MuiButton
        ref={ref}
        disableElevation
        className={getButtonClassNames()}
        sx={{
          ...sx,
        }}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export default Button