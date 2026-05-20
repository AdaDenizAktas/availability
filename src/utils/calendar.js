const WEEKDAY_SHORT = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
}

const WEEKDAY_LONG = {
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  de: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  es: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
}

export function toLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function isDateInRange(isoDate, start, end) {
  return isoDate >= start && isoDate <= end
}

export function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function startOfWeek(date) {
  const current = new Date(date)
  const weekday = (current.getDay() + 6) % 7
  current.setDate(current.getDate() - weekday)
  current.setHours(0, 0, 0, 0)
  return current
}

export function endOfWeek(date) {
  return addDays(startOfWeek(date), 6)
}

export function shiftMonth(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

export function shiftWeek(date, delta) {
  return addDays(startOfWeek(date), delta * 7)
}

export function formatReadableDate(isoDate, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(toLocalDate(isoDate))
}

export function formatDateRange(start, end, locale = 'en') {
  if (start === end) return formatReadableDate(start, locale)
  return `${formatReadableDate(start, locale)} → ${formatReadableDate(end, locale)}`
}

export function formatMonthTitle(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function formatDayTitle(date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function formatWeekRangeLabel(date, locale = 'en') {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  return formatDateRange(toISODate(start), toISODate(end), locale)
}

export function getWeekdayLabels(locale = 'en') {
  return WEEKDAY_SHORT[locale] ?? WEEKDAY_SHORT.en
}

export function getWeekdayLong(locale = 'en') {
  return WEEKDAY_LONG[locale] ?? WEEKDAY_LONG.en
}

export function buildWeekDays(date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(start, index)
    return {
      date: current,
      iso: toISODate(current)
    }
  })
}

export function buildMonthGrid(focusDate) {
  const year = focusDate.getFullYear()
  const month = focusDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstWeekday = (firstDay.getDay() + 6) % 7
  const gridStart = addDays(firstDay, -firstWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const current = addDays(gridStart, index)
    return {
      date: current,
      iso: toISODate(current),
      inMonth: current.getMonth() === month
    }
  })
}
