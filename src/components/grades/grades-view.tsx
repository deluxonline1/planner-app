"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppStore } from "@/context/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function GradesView() {
  const { grades, dispatch } = useAppStore();
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [value, setValue] = React.useState("5");

  const chartData = React.useMemo(() => {
    const map = new Map<string, number[]>();
    for (const g of grades) {
      const arr = map.get(g.subject) ?? [];
      arr.push(g.value);
      map.set(g.subject, arr);
    }
    return [...map.entries()].map(([name, vals]) => ({
      name,
      prosek: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
    }));
  }, [grades]);

  const overall = React.useMemo(() => {
    if (!grades.length) return 0;
    const s = grades.reduce((a, g) => a + g.value, 0);
    return Math.round((s / grades.length) * 100) / 100;
  }, [grades]);

  function addGrade() {
    const v = Number(value);
    if (!subject.trim() || Number.isNaN(v) || v < 1 || v > 5) return;
    dispatch({
      type: "ADD_GRADE",
      payload: { subject: subject.trim(), value: v },
    });
    setSubject("");
    setValue("5");
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ocene</h1>
          <p className="text-muted-foreground">
            Prati predmete i proseke — spremno za sinhronizaciju sa Supabase kasnije.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Dodaj ocenu
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/80 shadow-sm md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ukupan prosek</CardTitle>
            <CardDescription>Sve unete ocene</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">{overall || "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Prosek po predmetu</CardTitle>
            <CardDescription>Vizuelni pregled uspeha</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Dodaj ocene da vidiš grafikon.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" domain={[0, 5]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    formatter={(v: number) => [`${v}`, "Prosek"]}
                  />
                  <Bar dataKey="prosek" fill="var(--foreground)" radius={[0, 6, 6, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Lista ocena</CardTitle>
          <CardDescription>Sve pojedinačne ocene</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {grades.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2"
            >
              <div>
                <p className="font-medium">{g.subject}</p>
                <p className="text-xs text-muted-foreground">Ocena {g.value}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => dispatch({ type: "DELETE_GRADE", id: g.id })}
                aria-label="Obriši ocenu"
              >
                <Trash2 className="size-4" />
              </Button>
            </motion.div>
          ))}
          {grades.length === 0 && (
            <p className="text-sm text-muted-foreground">Nema unetih ocena.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj ocenu</DialogTitle>
            <DialogDescription>Skala 1–5 (prilagođeno srednjoj školi u Srbiji).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="gr-subject">Predmet</Label>
              <Input
                id="gr-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="npr. Matematika"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gr-val">Ocena (1–5)</Label>
              <Input
                id="gr-val"
                type="number"
                min={1}
                max={5}
                step={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={addGrade}>Sačuvaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
