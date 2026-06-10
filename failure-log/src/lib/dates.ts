import { format, parseISO, subDays, differenceInCalendarDays, isValid } from 'date-fns'

// "Today" is always the user's local date.
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function yesterdayISO(): string {
  return format(subDays(new Date(), 1), 'yyyy-MM-dd')
}

export function isValidISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && isValid(parseISO(s))
}

export function daysBetween(earlierISO: string, laterISO: string): number {
  return differenceInCalendarDays(parseISO(laterISO), parseISO(earlierISO))
}

export function formatLedgerDate(iso: string): string {
  return format(parseISO(iso), 'dd MMM').toUpperCase()
}

export function formatLedgerYear(iso: string): string {
  return format(parseISO(iso), 'yyyy')
}

export function formatFullDate(iso: string): string {
  return format(parseISO(iso), 'EEEE, d MMMM yyyy')
}
