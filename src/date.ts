export const addDays = (date: Date, days: number): Date => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getEasterDate = (date: Date): Date => {
  const a = Math.floor(date.getFullYear() % 19);
  const b = Math.floor(date.getFullYear() / 100);
  const c = Math.floor(date.getFullYear() % 100);
  const d = Math.floor(b / 4);
  const e = Math.floor(b % 4);
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = Math.floor((19 * a + b - d - g + 15) % 30);
  const i = Math.floor(c / 4);
  const k = Math.floor(c % 4);
  const l = Math.floor((32 + 2 * e + 2 * i - h - k) % 7);
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = Math.floor(((h + l - 7 * m + 114) % 31) + 1);
  return new Date(date.getFullYear(), month - 1, day);
};

export const isEqual = (dateA: Date, dateB: Date): boolean =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();
