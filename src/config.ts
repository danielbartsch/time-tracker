import { addDays, getEasterDate, isEqual } from './date'

export const weekDaysLong = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
]
export const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
export const monthNames = [
  'Jänner',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

export type DayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 0
export type WorkTime = Array<[Date, Date]>

export const defaultWorkTimes: { [key in DayIndex]: WorkTime } = {
  1: [
    [new Date(0, 0, 0, 8, 0, 0, 0), new Date(0, 0, 0, 16, 0, 0, 0)],
    [new Date(0, 0, 0, 12, 0, 0, 0), new Date(0, 0, 0, 12, 30, 0, 0)],
  ],
  2: [
    [new Date(0, 0, 0, 8, 0, 0, 0), new Date(0, 0, 0, 16, 0, 0, 0)],
    [new Date(0, 0, 0, 12, 0, 0, 0), new Date(0, 0, 0, 12, 30, 0, 0)],
  ],
  3: [
    [new Date(0, 0, 0, 8, 0, 0, 0), new Date(0, 0, 0, 16, 0, 0, 0)],
    [new Date(0, 0, 0, 12, 0, 0, 0), new Date(0, 0, 0, 12, 30, 0, 0)],
  ],
  4: [
    [new Date(0, 0, 0, 8, 0, 0, 0), new Date(0, 0, 0, 16, 0, 0, 0)],
    [new Date(0, 0, 0, 12, 0, 0, 0), new Date(0, 0, 0, 12, 30, 0, 0)],
  ],
  5: [
    [new Date(0, 0, 0, 8, 0, 0, 0), new Date(0, 0, 0, 16, 0, 0, 0)],
    [new Date(0, 0, 0, 12, 0, 0, 0), new Date(0, 0, 0, 12, 30, 0, 0)],
  ],
  6: [],
  0: [],
}
export const weekendDays = [6, 0]

export const holidays: Array<[string, (date: Date) => boolean]> = [
  /* austrian holidays */
  ['Neujahr', date => date.getMonth() === 0 && date.getDate() === 1],
  ['Heilige Drei Könige', date => date.getMonth() === 0 && date.getDate() === 6],
  ['Ostersonntag', date => isEqual(getEasterDate(date), date)],
  ['Ostermontag', date => isEqual(addDays(getEasterDate(date), 1), date)],
  ['Staatsfeiertag', date => date.getMonth() === 4 && date.getDate() === 1],
  ['Christi Himmelfahrt', date => isEqual(addDays(getEasterDate(date), 39), date)],
  ['Pfingstsonntag', date => isEqual(addDays(getEasterDate(date), 49), date)],
  ['Pfingstmontag', date => isEqual(addDays(getEasterDate(date), 50), date)],
  ['Fronleichnam', date => isEqual(addDays(getEasterDate(date), 60), date)],
  ['Mariä Himmelfahrt', date => date.getMonth() === 7 && date.getDate() === 15],
  ['Nationalfeiertag', date => date.getMonth() === 9 && date.getDate() === 26],
  ['Allerheiligen', date => date.getMonth() === 10 && date.getDate() === 1],
  ['Mariä Empfängnis', date => date.getMonth() === 11 && date.getDate() === 8],
  ['Heiliger Abend', date => date.getMonth() === 11 && date.getDate() === 24],
  ['Christtag', date => date.getMonth() === 11 && date.getDate() === 25],
  ['Stefanitag', date => date.getMonth() === 11 && date.getDate() === 26],
  ['Silvester', date => date.getMonth() === 11 && date.getDate() === 31],
]
