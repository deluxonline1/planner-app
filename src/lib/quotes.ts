export const motivationalQuotes: string[] = [
  "Mali koraci svaki dan donose velike rezultate.",
  "Fokus je tvoja supermoć — jedan zadatak u jednom trenutku.",
  "Učenje je investicija u sebe koja uvek isplati dividendu.",
  "Disciplina je most između ciljeva i postignuća.",
  "Ne moraš biti savršen — moraš biti dosledan.",
  "Tvoj budući ja će ti zahvaliti na današnjem trudu.",
];

export function quoteForDay(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return motivationalQuotes[h % motivationalQuotes.length];
}
