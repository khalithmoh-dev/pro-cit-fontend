import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface Icons {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 18, color='Black' }: DynamicIconProps) {
  const LucideIcon = Icons[name] as React.FC<{ size?: number; color?: string }>;
  if (!LucideIcon) return null; // fallback if icon doesn't exist

  return <LucideIcon size={size} color={"var(--text-color)"} />;
}
