import * as Icons from "lucide-react";

interface Icons {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 18, color='Black' }: Icons) {
  const LucideIcon = Icons[name] as React.FC<{ size?: number; color?: string }>;
  if (!LucideIcon) return null; // fallback if icon doesn't exist

  return <LucideIcon size={size} color={color} />;
}
