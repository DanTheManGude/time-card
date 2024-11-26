export const fontFamilies = [
  "Book Antiqua",
  "Palatino",
  "Palatino Linotype",
  "Palatino LT STD",
  "Georgia",
  "serif",
];

export const LOCAL_STORAGE_KEY = "TIME_CARD_PAY_PERIOD";

export const NORMAL_ESTIMATED_QUARTER_HOURS = 8.5 * 4;
export const FRIDAY_ESTIMATED_QUARTER_HOURS = 6 * 4;
export const HOLIDAY_QUARTER_HOURS = 8 * 4;

export const JANUARY = 0;
export const FEBRUARY = 1;
export const MARCH = 2;
export const APRIL = 3;
export const MAY = 4;
export const JUNE = 5;
export const JULY = 6;
export const AUGUST = 7;
export const SEPTEMBER = 8;
export const OCTOBER = 9;
export const NOVEMBER = 10;
export const DECEMBER = 11;

export const SUNDAY = 0;
export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;

export const STATIC_HOLIDAYS: Holiday[] = [
  { month: JANUARY, day: 1 }, // New Year's Day
  { month: JULY, day: 4 }, // Fourth of July
  { month: DECEMBER, day: 25 }, // Christmas
  { month: APRIL, day: 18 }, // Easter 2025
];

export const weekDayTimePriority = [
  WEDNESDAY,
  MONDAY,
  TUESDAY,
  THURSDAY,
].reduce<{ [key: number]: number }>(
  (acc, weekDay, index) => ({ ...acc, [weekDay]: index }),
  {}
);
