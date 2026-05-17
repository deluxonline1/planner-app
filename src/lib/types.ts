export type Priority = "high" | "medium" | "low";

export interface TaskCategory {
  id: string;
  name: string;
  /** Tailwind palette token, e.g. emerald, violet */
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  /** ISO date yyyy-mm-dd */
  dueDate?: string;
  categoryId?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  /** ISO datetime */
  date: string;
  priority: Priority;
}

export interface Grade {
  id: string;
  subject: string;
  /** Ocena 1–5 */
  value: number;
}

export interface PomodoroSession {
  id: string;
  minutes: number;
  /** ISO date */
  date: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  school: string;
}
