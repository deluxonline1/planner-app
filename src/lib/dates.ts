import { format, formatDistanceToNow, isSameDay, parseISO } from "date-fns";
import { srLatn } from "date-fns/locale/sr-Latn";

export function formatDate(iso: string) {
  try {
    return format(parseISO(iso), "d. MMM yyyy", { locale: srLatn });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string) {
  try {
    return format(parseISO(iso), "d. MMM yyyy, HH:mm", { locale: srLatn });
  } catch {
    return iso;
  }
}

export function countdownTo(iso: string) {
  try {
    const target = parseISO(iso);
    return formatDistanceToNow(target, { addSuffix: true, locale: srLatn });
  } catch {
    return "—";
  }
}

export function isSameDayIso(a: Date, isoYmd: string) {
  try {
    return isSameDay(a, parseISO(isoYmd));
  } catch {
    return false;
  }
}

export function startOfWeekMonday(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function toYmd(d: Date) {
  return d.toISOString().slice(0, 10);
}
