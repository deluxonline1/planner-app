"use client";

import * as React from "react";
import { parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useAppStore } from "@/context/app-store";
import {
  addDays,
  formatDate,
  startOfWeekMonday,
  toYmd,
} from "@/lib/dates";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/lib/priority-ui";
import { categoryDotClass } from "@/lib/category-ui";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const { tasks, exams, categories } = useAppStore();
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const weekStart = React.useMemo(() => startOfWeekMonday(new Date()), []);
  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const selectedKey = selected ? toYmd(selected) : "";

  const tasksForSelected = React.useMemo(
    () => tasks.filter((t) => t.dueDate === selectedKey),
    [tasks, selectedKey],
  );

  const examsForSelected = React.useMemo(
    () =>
      exams.filter((e) => {
        try {
          return toYmd(parseISO(e.date)) === selectedKey;
        } catch {
          return false;
        }
      }),
    [exams, selectedKey],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Kalendar</h1>
        <p className="text-muted-foreground">
          Nedeljni planer i mesečni pregled sa zadacima i ispitima.
        </p>
      </div>

      <Tabs defaultValue="week" className="space-y-6">
        <TabsList>
          <TabsTrigger value="week">Nedeljni planer</TabsTrigger>
          <TabsTrigger value="month">Mesečni pregled</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[720px] grid-cols-7 gap-3">
              {weekDays.map((d, i) => {
                const key = toYmd(d);
                const dayTasks = tasks.filter((t) => t.dueDate === key);
                const dayExams = exams.filter((e) => {
                  try {
                    return toYmd(parseISO(e.date)) === key;
                  } catch {
                    return false;
                  }
                });
                const isToday = key === toYmd(new Date());
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card
                      className={cn(
                        "h-full min-h-[280px] border-border/80 shadow-sm",
                        isToday && "ring-2 ring-primary/30",
                      )}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold capitalize">
                          {formatDate(key)}
                        </CardTitle>
                        {isToday && (
                          <CardDescription className="text-xs font-medium text-primary">
                            Danas
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Zadaci
                          </p>
                          {dayTasks.length === 0 ? (
                            <p className="text-xs text-muted-foreground">—</p>
                          ) : (
                            <ul className="space-y-1.5">
                              {dayTasks.map((t) => {
                                const cat = categories.find((c) => c.id === t.categoryId);
                                return (
                                  <li
                                    key={t.id}
                                    className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5"
                                  >
                                    <p className="font-medium leading-snug">{t.title}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-1">
                                      <PriorityBadge priority={t.priority} className="text-[10px]" />
                                      {cat && (
                                        <span
                                          className={cn(
                                            "inline-flex items-center gap-1 text-[10px] text-muted-foreground",
                                          )}
                                        >
                                          <span
                                            className={cn(
                                              "size-1.5 rounded-full",
                                              categoryDotClass(cat.color),
                                            )}
                                          />
                                          {cat.name}
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                        <Separator />
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Ispiti
                          </p>
                          {dayExams.length === 0 ? (
                            <p className="text-xs text-muted-foreground">—</p>
                          ) : (
                            <ul className="space-y-1.5">
                              {dayExams.map((e) => (
                                <li
                                  key={e.id}
                                  className="rounded-md border border-border/60 bg-primary/5 px-2 py-1.5"
                                >
                                  <p className="font-medium leading-snug">{e.title}</p>
                                  <p className="text-[11px] text-muted-foreground">{e.subject}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="month" className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <Calendar mode="single" selected={selected} onSelect={setSelected} />
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {selected ? formatDate(selectedKey) : "Izaberi datum"}
              </CardTitle>
              <CardDescription>Zadaci i ispiti za izabrani dan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Zadaci</h3>
                {tasksForSelected.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nema zadataka sa rokom ovog dana.</p>
                ) : (
                  <ul className="space-y-2">
                    {tasksForSelected.map((t) => (
                      <li key={t.id} className="rounded-lg border border-border/60 px-3 py-2">
                        <p className="font-medium">{t.title}</p>
                        <PriorityBadge priority={t.priority} className="mt-2" />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <Separator />
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Ispiti</h3>
                {examsForSelected.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nema ispita zakazanih ovog dana.</p>
                ) : (
                  <ul className="space-y-2">
                    {examsForSelected.map((e) => (
                      <li key={e.id} className="rounded-lg border border-border/60 px-3 py-2">
                        <p className="font-medium">{e.title}</p>
                        <p className="text-sm text-muted-foreground">{e.subject}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
