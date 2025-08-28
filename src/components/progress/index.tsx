import * as React from "react";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export interface ProgressProps extends LinearProgressProps {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, ...props }, ref) => {
    return (
      <Box ref={ref} sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={value}
          {...props}
        />
      </Box>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
