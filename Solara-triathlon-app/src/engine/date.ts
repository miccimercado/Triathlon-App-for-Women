export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date | string, days: number): Date {
  const result = new Date(typeof date === 'string' ? `${date}T12:00:00Z` : date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function startOfWeek(date: Date = new Date()): Date {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const day = result.getUTCDay();
  result.setUTCDate(result.getUTCDate() - ((day + 6) % 7));
  return result;
}

export function weeksBetween(start: Date, end: Date): number {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (7 * 86400000)));
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

export function formatDay(date: string): string {
  return new Intl.DateTimeFormat('en-CA', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

