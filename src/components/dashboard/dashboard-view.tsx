"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { subDays, format } from "date-fns";
import { srLatn } from "date-fns/locale/sr-Latn";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Flame,
  ListTodo,
  Sparkles,
  Timer,
} from "lucide-react";
import { useAppStore } from "@/context/app-store";
import { quoteForDay } from "@/lib/quotes";
import { countdownTo, formatDateTime, toYmd } from "@/lib/dates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/lib/priority-ui";
import { categoryDotClass } from "@/lib/category-ui";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { tasks, exams, pomodoroSessions, categories, profile } = useAppStore();
  const todayKey = toYmd(new Date());
  const quote = quoteForDay(todayKey);

  const todayTasks = React.useMemo(
    () => tasks.filter((t) => t.dueDate === todayKey),
    [tasks, todayKey],
  );
  const doneToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length || 1;
  const dailyProgress = Math.round((doneToday / totalToday) * 100);

  const upcomingExams = React.useMemo(() => {
    return [...exams]
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [exams]);

  const chartData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    return days.map((d) => {
      const key = toYmd(d);
      const minutes = pomodoroSessions
        .filter((s) => s.date === key)
        .reduce((a, s) => a + s.minutes, 0);
      return {
        key,
        label: format(d, "EEE", { locale: srLatn }),
        hours: Math.round((minutes / 60) * 10) / 10,
      };
    });
  }, [pomodoroSessions]);

  const weekMinutes = pomodoroSessions.reduce((a, s) => a + s.minutes, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Zdravo, {profile.fullName.split(/\s+/)[0]}
          </h1>
          <p className="text-muted-foreground">
            Pregled dana, zadataka i učenja na jednom mestu.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
          <Link href="/tasks">
            Upravljaj zadacima
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Dnevni napredak",
            desc: "Završeni zadaci za danas",
            value: `${doneToday}/${todayTasks.length || 0}`,
            icon: CheckCircle2,
          },
          {
            title: "Aktivni zadaci",
            desc: "Ukupno na listi",
            value: String(tasks.filter((t) => !t.completed).length),
            icon: ListTodo,
          },
          {
            title: "Nadolazeći ispiti",
            desc: "Naredni rokovi",
            value: String(upcomingExams.length),
            icon: Sparkles,
          },
          {
            title: "Vreme fokusa (demo)",
            desc: "Pomodoro minuti (ukupno)",
            value: `${weekMinutes}m`,
            icon: Timer,
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="size-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="size-5 text-orange-500" aria-hidden />
              Fokus ove nedelje
            </CardTitle>
            <CardDescription>
              Sati učenja izračunati iz Pomodoro sesija (demo podaci + tvoja istorija).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis
                  width={32}
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                  formatter={(value: number) => [`${value} h`, "Učenje"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { key?: string } | undefined;
                    return p?.key ?? "";
                  }}
                />
                <Bar
                  dataKey="hours"
                  fill="var(--foreground)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Motivacija</CardTitle>
            <CardDescription>Citat dana</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dnevni zadaci</span>
                <span className="font-medium">{dailyProgress}%</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Zadaci zakazani za danas: {todayTasks.length}. Završeno: {doneToday}.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Današnji zadaci</CardTitle>
              <CardDescription>Brzi pregled rokova za danas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks">Svi</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nema zadataka za danas.{" "}
                <Link href="/tasks" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Dodaj zadatak
                </Link>
              </p>
            ) : (
              todayTasks.map((t) => {
                const cat = categories.find((c) => c.id === t.categoryId);
                return (
                  <div
                    key={t.id}
                    className="flex items-start gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-medium", t.completed && "text-muted-foreground line-through")}>
                        {t.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={t.priority} />
                        {cat && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span
                              className={cn(
                                "size-2 shrink-0 rounded-full",
                                categoryDotClass(cat.color),
                              )}
                            />
                            {cat.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Nadolazeći ispiti</CardTitle>
              <CardDescription>Odbrojavanje do roka</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/exams">Uredi</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nema zakazanih ispita.</p>
            ) : (
              upcomingExams.map((e) => (
                <div key={e.id} className="rounded-lg border border-border/80 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-sm text-muted-foreground">{e.subject}</p>
                    </div>
                    <PriorityBadge priority={e.priority} />
                  </div>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">{formatDateTime(e.date)}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {countdownTo(e.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
