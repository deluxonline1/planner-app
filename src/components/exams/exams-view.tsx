"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useAppStore } from "@/context/app-store";
import type { Priority } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/lib/priority-ui";
import { formatDateTime, countdownTo } from "@/lib/dates";

export function ExamsView() {
  const { exams, dispatch } = useAppStore();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [datetime, setDatetime] = React.useState("");

  const sorted = React.useMemo(
    () =>
      [...exams].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [exams],
  );

  function resetForm() {
    setTitle("");
    setSubject("");
    setPriority("medium");
    setDatetime("");
  }

  function addExam() {
    if (!title.trim() || !subject.trim() || !datetime) return;
    const iso = new Date(datetime).toISOString();
    dispatch({
      type: "ADD_EXAM",
      payload: { title: title.trim(), subject: subject.trim(), date: iso, priority },
    });
    resetForm();
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ispiti</h1>
          <p className="text-muted-foreground">
            Drži rokove na oku — prioritet i odbrojavanje ostaju uvek vidljivi.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Dodaj ispit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="h-full border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="text-lg leading-snug">{e.title}</CardTitle>
                  <CardDescription>{e.subject}</CardDescription>
                </div>
                <PriorityBadge priority={e.priority} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{formatDateTime(e.date)}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {countdownTo(e.date)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-destructive hover:text-destructive"
                  onClick={() => dispatch({ type: "DELETE_EXAM", id: e.id })}
                >
                  <Trash2 className="size-4" />
                  Obriši
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Još nema ispita. Dodaj prvi klikom iznad.
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novi ispit</DialogTitle>
            <DialogDescription>Unesi predmet, naziv i datum sa vremenom.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ex-title">Naziv</Label>
              <Input id="ex-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-subject">Predmet</Label>
              <Input
                id="ex-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Prioritet</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Visok</SelectItem>
                    <SelectItem value="medium">Srednji</SelectItem>
                    <SelectItem value="low">Nizak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ex-dt">Datum i vreme</Label>
                <Input
                  id="ex-dt"
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={addExam}>Sačuvaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
