"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useAppStore } from "@/context/app-store";
import type { Priority, Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/lib/priority-ui";
import { CATEGORY_COLOR_OPTIONS, categoryDotClass, categorySoftClass } from "@/lib/category-ui";
import { formatDate } from "@/lib/dates";

type Filter = "all" | "pending" | "completed";

const emptyTask = (): Omit<Task, "id" | "createdAt"> => ({
  title: "",
  description: "",
  completed: false,
  priority: "medium",
  dueDate: undefined,
  categoryId: undefined,
});

export function TasksView() {
  const { tasks, categories, dispatch } = useAppStore();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [draft, setDraft] = React.useState<Omit<Task, "id" | "createdAt">>(emptyTask());

  const [catOpen, setCatOpen] = React.useState(false);
  const [catName, setCatName] = React.useState("");
  const [catColor, setCatColor] = React.useState<string>(CATEGORY_COLOR_OPTIONS[0].value);

  const filtered = React.useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === "pending" && t.completed) return false;
        if (filter === "completed" && !t.completed) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => {
        const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
        const po = order[a.priority] - order[b.priority];
        if (po !== 0) return po;
        return (b.dueDate ?? "").localeCompare(a.dueDate ?? "");
      });
  }, [tasks, filter, search]);

  function openCreate() {
    setEditing(null);
    setDraft(emptyTask());
    setOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setDraft({
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryId: task.categoryId,
    });
    setOpen(true);
  }

  function saveTask() {
    if (!draft.title.trim()) return;
    if (editing) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          ...editing,
          ...draft,
        },
      });
    } else {
      dispatch({ type: "ADD_TASK", payload: draft });
    }
    setOpen(false);
  }

  function deleteTask(id: string) {
    dispatch({ type: "DELETE_TASK", id });
    setOpen(false);
  }

  function addCategory() {
    if (!catName.trim()) return;
    dispatch({
      type: "ADD_CATEGORY",
      payload: { name: catName.trim(), color: catColor },
    });
    setCatName("");
    setCatColor(CATEGORY_COLOR_OPTIONS[0].value);
    setCatOpen(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Zadaci</h1>
          <p className="text-muted-foreground">
            Kreiraj, filtriraj i prati prioritete i rokove.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 shadow-sm">
          <Plus className="size-4" />
          Novi zadatak
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pretraži zadatke..."
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">Svi</TabsTrigger>
            <TabsTrigger value="pending">Aktivni</TabsTrigger>
            <TabsTrigger value="completed">Završeni</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => {
              const cat = categories.find((c) => c.id === t.categoryId);
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center",
                      t.completed && "opacity-70",
                    )}
                  >
                    <div className="flex flex-1 items-start gap-3">
                      <Checkbox
                        checked={t.completed}
                        onCheckedChange={() => dispatch({ type: "TOGGLE_TASK", id: t.id })}
                        aria-label="Završeno"
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p
                          className={cn(
                            "font-medium leading-snug",
                            t.completed && "text-muted-foreground line-through",
                          )}
                        >
                          {t.title}
                        </p>
                        {t.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {t.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <PriorityBadge priority={t.priority} />
                          {t.dueDate && (
                            <Badge variant="outline" className="font-normal">
                              Rok: {formatDate(t.dueDate)}
                            </Badge>
                          )}
                          {cat && (
                            <span className={categorySoftClass(cat.color)}>{cat.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 sm:flex-col md:flex-row">
                      <Button variant="outline" size="icon" onClick={() => openEdit(t)} aria-label="Izmeni">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteTask(t.id)}
                        aria-label="Obriši"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nema zadataka koji odgovaraju filteru.
            </p>
          )}
        </div>

        <CardSide
          categories={categories}
          onAddCategory={() => setCatOpen(true)}
          onDeleteCategory={(id) => dispatch({ type: "DELETE_CATEGORY", id })}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Izmeni zadatak" : "Novi zadatak"}</DialogTitle>
            <DialogDescription>
              Rok, prioritet i kategorija pomažu da zadržiš fokus.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Naslov</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Opis</Label>
              <Textarea
                id="desc"
                rows={3}
                value={draft.description ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Prioritet</Label>
                <Select
                  value={draft.priority}
                  onValueChange={(v) =>
                    setDraft((d) => ({ ...d, priority: v as Priority }))
                  }
                >
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
                <Label htmlFor="due">Rok</Label>
                <Input
                  id="due"
                  type="date"
                  value={draft.dueDate ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      dueDate: e.target.value || undefined,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategorija</Label>
              <Select
                value={draft.categoryId ?? "none"}
                onValueChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    categoryId: v === "none" ? undefined : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Izaberi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Bez kategorije</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", categoryDotClass(c.color))} />
                        {c.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            {editing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteTask(editing.id)}
              >
                Obriši
              </Button>
            )}
            <div className="flex flex-1 justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Otkaži
              </Button>
              <Button type="button" onClick={saveTask}>
                Sačuvaj
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova kategorija</DialogTitle>
            <DialogDescription>Dodeli ime i boju za brz vizuelni pregled.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="catName">Naziv</Label>
              <Input
                id="catName"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="npr. Hemija"
              />
            </div>
            <div className="space-y-2">
              <Label>Boja</Label>
              <Select value={catColor} onValueChange={setCatColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", categoryDotClass(c.value))} />
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={addCategory}>Dodaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardSide({
  categories,
  onAddCategory,
  onDeleteCategory,
}: {
  categories: { id: string; name: string; color: string }[];
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}) {
  return (
    <div className="h-fit rounded-xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">Kategorije</h2>
        <Button size="sm" variant="secondary" onClick={onAddCategory} className="gap-1">
          <Plus className="size-3.5" />
          Dodaj
        </Button>
      </div>
      <Separator className="my-3" />
      <ScrollArea className="h-64 pr-3">
        <ul className="space-y-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2 py-2"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span className={cn("size-2 shrink-0 rounded-full", categoryDotClass(c.color))} />
                <span className="truncate font-medium">{c.name}</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteCategory(c.id)}
                aria-label={`Obriši ${c.name}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
