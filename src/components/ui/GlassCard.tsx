import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends PropsWithChildren {
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return <div className={cn("glass rounded-2xl p-5 shadow-glow", className)}>{children}</div>;
}
