"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  Settings,
  Sparkles,
  Timer,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAppStore } from "@/context/app-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Zadaci", icon: ListTodo },
  { href: "/calendar", label: "Kalendar", icon: CalendarDays },
  { href: "/exams", label: "Ispiti", icon: GraduationCap },
  { href: "/grades", label: "Ocene", icon: Award },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/settings", label: "Podešavanja", icon: Settings },
] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { profile } = useAppStore();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <div>
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight"
            onClick={onNavigate}
          >
            Delux
          </Link>
          <p className="text-xs text-muted-foreground">Školske obaveze</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {nav.map((item, i) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={item.href} onClick={onNavigate}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Tema
          </span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-2">
          <Avatar className="size-9 border border-border">
            <AvatarFallback>{initials(profile.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profile.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.email}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/settings" onClick={onNavigate} aria-label="Podešavanja">
              <Settings className="size-4" />
            </Link>
          </Button>
        </div>
        <Button variant="outline" className="w-full gap-2" asChild>
          <Link href="/login" onClick={onNavigate}>
            <LogOut className="size-4" />
            Odjava
          </Link>
        </Button>
      </div>
    </div>
  );
}
