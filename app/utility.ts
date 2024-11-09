import {
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
  FRIDAY_ESTIMATED_QUARTER_HOURS,
  HOLIDAY_QUARTER_HOURS,
  NORMAL_ESTIMATED_QUARTER_HOURS,
  STATIC_HOLIDAYS,
} from "./constants";

function isWeekday(date: Date) {
  const dayOfWeek = date.getDay();

  return !(dayOfWeek === SUNDAY || dayOfWeek === SATURDAY);
}

function calculateRelativeHoliday(
  countOfDay: number,
  dayOfWeek: number,
  month: number
): Date {
  const date = new Date(new Date().getFullYear(), month, 1);
  let numberOfDay = 0;

  while (numberOfDay < countOfDay) {
    while (date.getDay() != dayOfWeek) {
      date.setDate(date.getDate() + 1);
    }
    numberOfDay++;
    date.setDate(date.getDate() + 1);
  }
  date.setDate(date.getDate() - 1);

  return date;
}

function calculateHolidaysForMonth(targetMonth: number): number[] {
  const holidays = STATIC_HOLIDAYS.filter(
    (holiday) => holiday.month === targetMonth
  ).map((holiday) => holiday.day);

  if (targetMonth === 10) {
    const thanksgving = calculateRelativeHoliday(4, THURSDAY, 10);

    holidays.push(thanksgving.getDate());
    holidays.push(thanksgving.getDate() + 1);
  }

  return holidays;
}

function getFirstAndLastDays(today: Date) {
  let firstDate;
  let lastDate;

  if (today.getDate() <= 15) {
    firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
    lastDate = new Date(today.getFullYear(), today.getMonth(), 15);
  } else {
    const lastWeekdayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    while (!isWeekday(lastWeekdayOfMonth)) {
      lastWeekdayOfMonth.setDate(lastWeekdayOfMonth.getDate() - 1);
    }

    if (today.getDate() <= lastWeekdayOfMonth.getDate()) {
      firstDate = firstDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        16
      );
      lastDate = lastWeekdayOfMonth;
    } else {
      firstDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    }
  }

  return { firstDate, lastDate };
}

const getEstimatedHoursForDay = (day: number) =>
  day === FRIDAY
    ? FRIDAY_ESTIMATED_QUARTER_HOURS
    : NORMAL_ESTIMATED_QUARTER_HOURS;

export function constructNewPayPeriod(): PayPeriod {
  console.log("creating new pay period");
  const { firstDate, lastDate } = getFirstAndLastDays(new Date());

  const days: Day[] = [];

  const holidays = calculateHolidaysForMonth(firstDate.getMonth());

  const currentDate = new Date(firstDate);
  const incrementCurrentDate = () => {
    currentDate.setDate(currentDate.getDate() + 1);
  };

  while (currentDate.getDate() <= lastDate.getDate()) {
    if (isWeekday(currentDate)) {
      if (holidays.includes(currentDate.getDate())) {
        days.push({
          date: new Date(currentDate),
          estimatedQuarterHours: HOLIDAY_QUARTER_HOURS,
          actualQuarterHours: HOLIDAY_QUARTER_HOURS,
        });
      } else {
        days.push({
          date: new Date(currentDate),
          estimatedQuarterHours: getEstimatedHoursForDay(currentDate.getDate()),
        });
      }
    }
    incrementCurrentDate();
  }

  const lastDateInPayPeriod = days.at(-1)?.date;
  if (lastDateInPayPeriod === undefined) {
    throw new Error("No Days in new pay period");
  }

  return recalculatePayPeriod({
    days,
    lastDate: lastDateInPayPeriod,
    quarterHourDifference: 0,
  });
}

export function recalculatePayPeriod(
  existingPayPeriodWithNewDay: PayPeriod
): PayPeriod {
  return existingPayPeriodWithNewDay;
}

export function convertQuarterHoursToString(quarterHours: number) {
  const fullHours = Math.floor(quarterHours / 4);
  const remainingQuarters = quarterHours % 4;
  const quarterHoursAsMinutes = String(remainingQuarters * 15).padStart(2, "0");

  return `${fullHours}:${quarterHoursAsMinutes}`;
}
