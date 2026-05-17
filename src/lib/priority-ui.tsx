import type { Priority } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const priorityConfig: Record<
  Priority,
  { label: string; className: string }
> = {
  high: {
    label: "Visok",
    className:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
  },
  medium: {
    label: "Srednji",
    className:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
  },
  low: {
    label: "Nizak",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100",
  },
};

export function priorityLabel(p: Priority) {
  return priorityConfig[p].label;
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const c = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn(c.className, className)}>
      {c.label}
    </Badge>
  );
}
