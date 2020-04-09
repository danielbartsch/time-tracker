import { padNumber } from './utils'
import { monthNames, weekDays, weekDaysLong } from './config'

export const addDays = (date: Date, days: number): Date => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const getEasterDate = (date: Date): Date => {
  const a = Math.floor(date.getFullYear() % 19)
  const b = Math.floor(date.getFullYear() / 100)
  const c = Math.floor(date.getFullYear() % 100)
  const d = Math.floor(b / 4)
  const e = Math.floor(b % 4)
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = Math.floor((19 * a + b - d - g + 15) % 30)
  const i = Math.floor(c / 4)
  const k = Math.floor(c % 4)
  const l = Math.floor((32 + 2 * e + 2 * i - h - k) % 7)
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = Math.floor(((h + l - 7 * m + 114) % 31) + 1)
  return new Date(date.getFullYear(), month - 1, day)
}

export const dateString = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

export const isEqual = (dateA: Date, dateB: Date): boolean =>
  dateString(dateA) === dateString(dateB)

type FormatPart =
  | 'Y4'
  | 'Y2'
  | 'M2'
  | 'M1'
  | 'MM'
  | 'D2'
  | 'D1'
  | 'W0'
  | 'W9'
  | 'h2'
  | 'h1'
  | 'm2'
  | 'm1'
  | 's2'
  | 's1'
const formatParts: Array<[FormatPart, (date: Date) => string]> = [
  ['Y4', date => padNumber(date.getFullYear(), 4)],
  ['Y2', date => padNumber(date.getFullYear() % 100, 2)],
  ['M2', date => padNumber(date.getMonth() + 1, 2)],
  ['M1', date => String(date.getMonth() + 1)],
  ['MM', date => monthNames[date.getMonth()]],
  ['D2', date => padNumber(date.getDate(), 2)],
  ['D1', date => String(date.getDate())],
  ['W0', date => weekDays[date.getDay()]],
  ['W9', date => weekDaysLong[date.getDay()]],
  ['h2', date => padNumber(date.getHours(), 2)],
  ['h1', date => String(date.getHours())],
  ['m2', date => padNumber(date.getMinutes(), 2)],
  ['m1', date => String(date.getMinutes())],
  ['s2', date => padNumber(date.getSeconds(), 2)],
  ['s1', date => String(date.getSeconds())],
]

export const toString = (date: Date, format: string): string =>
  formatParts.reduce(
    (previousDateString, [formatPart, toStringPart]) =>
      previousDateString.replace(formatPart, toStringPart(date)),
    format
  )

export const fromString = (date: string, format: string): Date => {
  const capturePositions = formatParts
    .map(([formatPart]) => ({
      formatPart,
      start: format.indexOf(formatPart),
      end: format.indexOf(formatPart) + formatPart.length,
    }))
    .filter(({ start }) => start > -1)
    .sort((a, b) => a.start - b.start)

  let dateString = date.slice()

  const { Y4, Y2, M2, M1, MM, D2, D1, h2, h1, m2, m1, s2, s1 } = capturePositions.reduce<{
    [key: string]: number | null
  }>(
    (previousDateInfo, { formatPart, start, end }) => {
      previousDateInfo[formatPart] = Number(dateString.substring(start, end))
      dateString = dateString.substring(0, start) + formatPart + dateString.substring(end)
      return previousDateInfo
    },
    {
      Y4: null,
      Y2: null,
      M2: null,
      M1: null,
      MM: null,
      D2: null,
      D1: null,
      W0: null,
      W9: null,
      h2: null,
      h1: null,
      m2: null,
      m1: null,
      s2: null,
      s1: null,
    }
  )

  return new Date(
    Y2 ?? Y4 ?? 0,
    MM ?? M1 ?? M2 ?? 0,
    D1 ?? D2 ?? 0,
    h1 ?? h2 ?? 0,
    m1 ?? m2 ?? 0,
    s1 ?? s2 ?? 0,
    0
  )
}
