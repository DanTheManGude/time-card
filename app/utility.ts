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
  MONDAY,
  NOVEMBER,
  MAY,
  SEPTEMBER,
} from "./constants";

function isWeekday(date: Date) {
  const dayOfWeek = date.getDay();

  return !(dayOfWeek === SUNDAY || dayOfWeek === SATURDAY);
}

export function isFriday(date: Date) {
  return date.getDay() === FRIDAY;
}

const getCalculateRelativeHoliday =
  (targetDate: Date) =>
  (countOfDay: number, dayOfWeek: number): Date => {
    let date = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    let addend = 1;
    if (countOfDay < 0) {
      date = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      addend = -1;
    }

    let numberOfDay = 0;

    while (numberOfDay < Math.abs(countOfDay)) {
      while (date.getDay() != dayOfWeek) {
        date.setDate(date.getDate() + addend);
      }
      numberOfDay++;
      date.setDate(date.getDate() + addend);
    }
    date.setDate(date.getDate() - addend);

    return date;
  };

function calculateHolidaysForDate(targetDate: Date): number[] {
  const holidays = STATIC_HOLIDAYS.filter(
    (holiday) => holiday.month === targetDate.getMonth()
  ).map((holiday) => holiday.day);

  const calculateRelativeHoliday = getCalculateRelativeHoliday(targetDate);

  switch (targetDate.getMonth()) {
    case NOVEMBER:
      const thanksgving = calculateRelativeHoliday(4, THURSDAY);
      holidays.push(thanksgving.getDate());
      holidays.push(thanksgving.getDate() + 1);
      break;
    case MAY:
      const memorialDay = calculateRelativeHoliday(-1, MONDAY);
      holidays.push(memorialDay.getDate());
      break;
    case SEPTEMBER:
      const laborDay = calculateRelativeHoliday(1, MONDAY);
      holidays.push(laborDay.getDate());
      break;
    default:
      break;
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
      firstDate = new Date(today.getFullYear(), today.getMonth(), 16);
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
    .filter((day) => !day.isHoliday)
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
  const orderedFridays: number[] = [];

  let currentWeekDays: Day[] = [];
  let currentWeekDaysOffset = 0;

  days.forEach((currentDay, index) => {
    if (isFriday(currentDay.date)) {
      if (currentWeekDays.length > 0) {
        sortedWeekDays.push(
          ...sortWeekDays(currentWeekDays, currentWeekDaysOffset)
        );
        currentWeekDays = [];
      }
      if (!currentDay.isHoliday) {
        orderedFridays.push(index);
      }
      return;
    }

    if (currentWeekDays.length === 0) {
      currentWeekDaysOffset = index;
    }
    currentWeekDays.push(currentDay);
  });

  if (currentWeekDays.length > 0) {
    sortedWeekDays.push(
      ...sortWeekDays(currentWeekDays, currentWeekDaysOffset)
    );
  }

  debugger;

  const reverseWeekDays = Array.from(sortedWeekDays).reverse();
  const reverseFridays = Array.from(orderedFridays).reverse();

  const deficit: TimeDifference[] = [
    { limit: 8 * 4, indexes: orderedFridays },
    { limit: 10 * 4, indexes: sortedWeekDays },
    { limit: 10 * 4, indexes: orderedFridays },
    { limit: 12 * 4, indexes: [...sortedWeekDays, ...orderedFridays] },
  ];
  const surplus: TimeDifference[] = [
    { limit: 6 * 4, indexes: reverseWeekDays },
    { limit: 4 * 4, indexes: [...reverseFridays, ...reverseWeekDays] },
  ];

  return { deficit, surplus };
}

export function constructNewPayPeriod(): PayPeriod {
  console.log("creating new pay period");
  const { firstDate, lastDate } = getFirstAndLastDays(new Date());

  const days: Day[] = [];

  const holidays = calculateHolidaysForDate(firstDate);

  const currentDate = new Date(firstDate);

  while (currentDate.getTime() <= lastDate.getTime()) {
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
    currentDate.setDate(currentDate.getDate() + 1);
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
    const availableIndexes = indexes.filter(
      (index) => !days[index].actualQuarterHours
    );
    let hasReachedLimit = availableIndexes.length === 0;

    while (!hasReachedLimit) {
      for (const index of indexes) {
        if (!availableIndexes.includes(index)) {
          continue;
        }

        const existingQuarterHours = days[index].estimatedQuarterHours;

        if (existingQuarterHours === limit) {
          availableIndexes.filter((i) => i !== index);
          continue;
        }

        days[index].estimatedQuarterHours =
          existingQuarterHours + timeChangeValue;
        elapsedTimeChange = elapsedTimeChange - timeChangeValue;

        if (elapsedTimeChange === requiredTimeChange) {
          return;
        }
      }
      hasReachedLimit = availableIndexes.length === 0;
    }
  }
}

export function recalculatePayPeriod(
  existingPayPeriodWithNewDays: PayPeriod
): PayPeriod {
  const requiredQuarterHours = existingPayPeriodWithNewDays.days.length * 8 * 4;
  const workingQuarterHours = existingPayPeriodWithNewDays.days.reduce(
    (acc, day) => acc + (day.actualQuarterHours || day.targetQuarterHours),
    0
  );
  const quarterHourDifference = workingQuarterHours - requiredQuarterHours;

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

    iterateHours(
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
