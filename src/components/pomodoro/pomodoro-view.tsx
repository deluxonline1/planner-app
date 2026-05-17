"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useAppStore } from "@/context/app-store";
import { playChime } from "@/lib/sound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const WORK_SECONDS = 25 * 60;

export function PomodoroView() {
  const { pomodoroSessions, dispatch } = useAppStore();
  const [secondsLeft, setSecondsLeft] = React.useState(WORK_SECONDS);
  const [running, setRunning] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const totalMinutes = React.useMemo(
    () => pomodoroSessions.reduce((a, s) => a + s.minutes, 0),
    [pomodoroSessions],
  );

  React.useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          playChime();
          dispatch({ type: "ADD_POMODORO", minutes: 25 });
          return WORK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, dispatch]);

  const progress = Math.round(((WORK_SECONDS - secondsLeft) / WORK_SECONDS) * 100);

  function reset() {
    setRunning(false);
    setSecondsLeft(WORK_SECONDS);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pomodoro</h1>
        <p className="text-muted-foreground">
          25 minuta dubokog fokusa. Zvuk obaveštava kada sesija završi.
        </p>
      </div>

      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Fokus sesija</CardTitle>
          <CardDescription>Start / pauza / reset — tvoja statistika se čuva lokalno.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <motion.div
            className="flex flex-col items-center justify-center gap-6 py-6"
            layout
          >
            <div className="relative flex size-56 items-center justify-center rounded-full border-4 border-border bg-muted/30 shadow-inner">
              <motion.span
                key={secondsLeft}
                initial={{ scale: 0.98, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-5xl font-semibold tracking-tight tabular-nums"
              >
                {mm}:{ss}
              </motion.span>
            </div>
            <Progress value={progress} className="h-2 w-full max-w-xs" />
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="min-w-32 gap-2"
                onClick={() => setRunning((r) => !r)}
              >
                {running ? (
                  <>
                    <Pause className="size-4" /> Pauza
                  </>
                ) : (
                  <>
                    <Play className="size-4" /> Start
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={reset}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </motion.div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ukupno minuta
              </p>
              <p className="mt-1 text-2xl font-semibold">{totalMinutes}</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sesija (min)
              </p>
              <p className="mt-1 text-2xl font-semibold">25</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
