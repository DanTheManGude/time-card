import {
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
  FRIDAY_ESTIMATED_QUARTER_HOURS,
  HOLIDAY_QUARTER_HOURS,
  NORMAL_ESTIMATED_QUARTER_HOURS,
  STATIC_HOLIDAYS,
  weekDayTimePriority,
} from "./constants";

function isWeekday(date: Date) {
  const dayOfWeek = date.getDay();

  return !(dayOfWeek === SUNDAY || dayOfWeek === SATURDAY);
}

function isFriday(date: Date) {
  return date.getDay() === FRIDAY;
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

function sortWeekDays(days: Day[], indexOffset: number): number[] {
  return Array.from(days)
    .filter((day) => !day.isHoliday && !day.actualQuarterHours)
    .sort(
      (dayA, dayB) =>
        weekDayTimePriority[dayA.date.getDay()] -
        weekDayTimePriority[dayB.date.getDay()]
    )
    .map(
      (day) =>
        days.findIndex((d) => d.date.getTime() === day.date.getTime()) +
        indexOffset
    );
}

function constructTimeDifferences(days: Day[]): TimeDifferences {
  const sortedWeekDays: number[] = [];
  const fridays: number[] = [];

  let lastFridayIndex = -1;

  while (true) {
    const nextFridayIndex = days
      .slice(lastFridayIndex + 1)
      .findIndex((day) => isFriday(day.date));

    if (nextFridayIndex === -1) {
      break;
    }

    if (
      !days[nextFridayIndex].isHoliday &&
      !days[nextFridayIndex].actualQuarterHours
    ) {
      fridays.push(nextFridayIndex);
    }

    if (nextFridayIndex > 0) {
      sortedWeekDays.push(
        ...sortWeekDays(days.slice(0, nextFridayIndex), lastFridayIndex + 1)
      );
    }

    lastFridayIndex = nextFridayIndex;
  }

  const deficit: TimeDifference[] = [
    { limit: 8 * 4, indexes: fridays },
    { limit: 10 * 4, indexes: sortedWeekDays },
    { limit: 10 * 4, indexes: fridays },
  ];
  const surplus: TimeDifference[] = [
    { limit: 6 * 4, indexes: Array.from(sortedWeekDays).reverse() },
  ];

  return { deficit, surplus };
}

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
      const targetQuarterHours = getEstimatedHoursForDay(currentDate.getDay());
      if (holidays.includes(currentDate.getDate())) {
        days.push({
          date: new Date(currentDate),
          estimatedQuarterHours: HOLIDAY_QUARTER_HOURS,
          actualQuarterHours: HOLIDAY_QUARTER_HOURS,
          targetQuarterHours,
          isHoliday: true,
        });
      } else {
        days.push({
          date: new Date(currentDate),
          estimatedQuarterHours: targetQuarterHours,
          targetQuarterHours,
          isHoliday: false,
        });
      }
    }
    incrementCurrentDate();
  }

  const lastDateInPayPeriod = days.at(-1)?.date;
  if (lastDateInPayPeriod === undefined) {
    throw new Error("No Days in new pay period");
  }

  const timeDifferences = constructTimeDifferences(days);

  return recalculatePayPeriod({
    days,
    lastDate: lastDateInPayPeriod,
    quarterHourDifference: 0,
    timeDifferences,
  });
}

// Modifies days
function iterateHours(
  days: Day[],
  requiredTimeChange: number,
  timeDifferences: TimeDifference[],
  timeChangeValue: -1 | 1
) {
  let elapsedTimeChange = 0;

  for (const { limit, indexes } of timeDifferences) {
    let hasReachedLimit = false;

    while (!hasReachedLimit) {
      for (const index in indexes) {
        const existingQuarterHours = days[index].estimatedQuarterHours;

        if (
          existingQuarterHours === limit ||
          elapsedTimeChange === requiredTimeChange
        ) {
          hasReachedLimit = true;
          break;
        }

        days[index].estimatedQuarterHours =
          existingQuarterHours + timeChangeValue;
        elapsedTimeChange = elapsedTimeChange + timeChangeValue;
      }
    }
  }

  return elapsedTimeChange;
}

export function recalculatePayPeriod(
  existingPayPeriodWithNewDays: PayPeriod
): PayPeriod {
  const requiredQuarterHours = existingPayPeriodWithNewDays.days.length * 8 * 4;
  const workingQuarterHours = existingPayPeriodWithNewDays.days.reduce(
    (acc, day) => acc + (day.actualQuarterHours || day.targetQuarterHours),
    0
  );
  let quarterHourDifference = workingQuarterHours - requiredQuarterHours;

  const modifiedDays = existingPayPeriodWithNewDays.days.map((day) => ({
    ...day,
    estimatedQuarterHours: day.actualQuarterHours || day.targetQuarterHours,
  }));

  if (quarterHourDifference !== 0) {
    let timeDifferences: TimeDifference[];
    let timeChangeValue: -1 | 1;

    if (quarterHourDifference > 0) {
      timeDifferences = existingPayPeriodWithNewDays.timeDifferences.surplus;
      timeChangeValue = -1;
    } else {
      timeDifferences = existingPayPeriodWithNewDays.timeDifferences.deficit;
      timeChangeValue = 1;
    }

    quarterHourDifference = iterateHours(
      modifiedDays,
      quarterHourDifference,
      timeDifferences,
      timeChangeValue
    );
  }

  return {
    ...existingPayPeriodWithNewDays,
    days: modifiedDays,
    quarterHourDifference,
  };
}

export function convertQuarterHoursToString(quarterHours: number) {
  const fullHours = Math.floor(quarterHours / 4);
  const remainingQuarters = quarterHours % 4;
  const quarterHoursAsMinutes = String(remainingQuarters * 15).padStart(2, "0");

  return `${fullHours}:${quarterHoursAsMinutes}`;
}
