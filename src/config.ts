import { addDays, getEasterDate, isEqual } from './date'

export const weekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export const workDays = [1, 2, 3, 4, 5];
export const weekendDays = [6, 0]

export const holidays: Array<[string, ((date: Date) => boolean)]> = [
    /* austrian holidays */
    ['Neujahr', (date) => { return date.getMonth() === 0 && date.getDate() === 1 }],
    ['Heilige Drei Könige', (date) => { return date.getMonth() === 0 && date.getDate() === 6 }],
    ['Ostersonntag', (date) => { return isEqual(getEasterDate(date),date) }],
    ['Ostermontag', (date) => { return isEqual(addDays(getEasterDate(date), 1),date) }],
    ['Staatsfeiertag', (date) => { return date.getMonth() === 4 && date.getDate() === 1 }],
    ['Christi Himmelfahrt', (date) => { return isEqual(addDays(getEasterDate(date), 39),date) }],
    ['Pfingstsonntag', (date) => { return isEqual(addDays(getEasterDate(date), 49),date) }],
    ['Pfingstmontag', (date) => { return isEqual(addDays(getEasterDate(date), 50),date) }],
    ['Fronleichnam', (date) => { return isEqual(addDays(getEasterDate(date), 60),date) }],
    ['Mariä Himmelfahrt', (date) => { return date.getMonth() === 7 && date.getDate() === 15 }],
    ['Nationalfeiertag', (date) => { return date.getMonth() === 9 && date.getDate() === 26 }],
    ['Allerheiligen', (date) => { return date.getMonth() === 10 && date.getDate() === 1 }],
    ['Mariä Empfängnis', (date) => { return date.getMonth() === 11 && date.getDate() === 8 }],
    ['Heiliger Abend', (date) => { return date.getMonth() === 11 && date.getDate() === 24 }],
    ['Christtag', (date) => { return date.getMonth() === 11 && date.getDate() === 25 }],
    ['Stefanitag', (date) => { return date.getMonth() === 11 && date.getDate() === 26 }],
    ['Silvester', (date) => { return date.getMonth() === 11 && date.getDate() === 31 }],
]