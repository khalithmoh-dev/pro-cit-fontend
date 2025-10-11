import Typography from "@mui/material/Typography"

interface LabelProps {
  labelName: string
  required?: boolean
  className?: string
}

const FormLabel = (props: LabelProps) => {
  return (
    <Typography className={`form-label fwd-1 ${props.className}`}
      sx={{
        marginBottom: '2px'
      }}
    >
      {props.labelName}
      {props.required && (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
      )}
    </Typography>
  )
}

export default FormLabel
 