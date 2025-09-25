import React from "react";
import Divider from "@mui/material/Divider";

export type SeparatorProps = {
  orientation?: "vertical" | "horizontal";
};

const Separator: React.FC<SeparatorProps> = ({ orientation = "vertical" }) => {
  return <Divider orientation={orientation} flexItem />;
};

export default Separator;
