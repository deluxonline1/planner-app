import { cn } from "@/lib/utils";

/** Tailwind paleta za korisničke kategorije */
export function categoryDotClass(color: string) {
  const map: Record<string, string> = {
    violet: "bg-violet-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    fuchsia: "bg-fuchsia-500",
    lime: "bg-lime-500",
    orange: "bg-orange-500",
    slate: "bg-slate-500",
  };
  return map[color] ?? "bg-zinc-500";
}

export function categorySoftClass(color: string) {
  const map: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    fuchsia: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    lime: "bg-lime-500/10 text-lime-800 dark:text-lime-200",
    orange: "bg-orange-500/10 text-orange-800 dark:text-orange-200",
    slate: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  };
  return cn("rounded-md px-2 py-0.5 text-xs font-medium", map[color] ?? map.slate);
}

export const CATEGORY_COLOR_OPTIONS = [
  { value: "violet", label: "Ljubičasta" },
  { value: "sky", label: "Plava" },
  { value: "emerald", label: "Zelena" },
  { value: "amber", label: "Žuta" },
  { value: "rose", label: "Roze" },
  { value: "fuchsia", label: "Fuksija" },
  { value: "orange", label: "Narandžasta" },
  { value: "slate", label: "Siva" },
] as const;
