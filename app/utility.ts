import {
  convertHoursToQuarterHours,
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
  LAST_DATE_OF_PAY_PERIOD,
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

function getFirstAndLastDays(referenceDate: Date) {
  const firstWeekdayFromReferenceDate = new Date(referenceDate);

  while (!isWeekday(firstWeekdayFromReferenceDate)) {
    firstWeekdayFromReferenceDate.setDate(
      firstWeekdayFromReferenceDate.getDate() + 1
    );
  }

  let firstDate;
  let lastDate;

  if (firstWeekdayFromReferenceDate.getDate() <= LAST_DATE_OF_PAY_PERIOD) {
    firstDate = new Date(
      firstWeekdayFromReferenceDate.getFullYear(),
      firstWeekdayFromReferenceDate.getMonth(),
      1
    );
    lastDate = new Date(
      firstWeekdayFromReferenceDate.getFullYear(),
      firstWeekdayFromReferenceDate.getMonth(),
      LAST_DATE_OF_PAY_PERIOD
    );
  } else {
    firstDate = new Date(
      firstWeekdayFromReferenceDate.getFullYear(),
      firstWeekdayFromReferenceDate.getMonth(),
      LAST_DATE_OF_PAY_PERIOD + 1
    );
    lastDate = new Date(
      firstWeekdayFromReferenceDate.getFullYear(),
      firstWeekdayFromReferenceDate.getMonth() + 1,
      0
    );
  }

  return { firstDate, lastDate };
}

const getEstimatedHoursForDay = (day: number) => {
  switch (day) {
    case FRIDAY:
      return FRIDAY_ESTIMATED_QUARTER_HOURS;
    default:
      return NORMAL_ESTIMATED_QUARTER_HOURS;
  }
};

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

function constructTimeDifferenceEntries(days: Day[]): TimeDifferenceEntries {
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

  const reverseWeekDays = Array.from(sortedWeekDays).reverse();
  const reverseFridays = Array.from(orderedFridays).reverse();

  const deficitTimeDifferences: TimeDifference[] = [
    { limit: convertHoursToQuarterHours(8), indexes: orderedFridays },
    { limit: convertHoursToQuarterHours(10), indexes: sortedWeekDays },
    { limit: convertHoursToQuarterHours(10), indexes: orderedFridays },
    {
      limit: convertHoursToQuarterHours(12),
      indexes: [...sortedWeekDays, ...orderedFridays],
    },
    {
      limit: convertHoursToQuarterHours(16),
      indexes: [...sortedWeekDays, ...orderedFridays],
    },
  ];
  const surplusTimeDifferences: TimeDifference[] = [
    { limit: convertHoursToQuarterHours(6), indexes: reverseWeekDays },
    {
      limit: convertHoursToQuarterHours(4),
      indexes: [...reverseFridays, ...reverseWeekDays],
    },
    {
      limit: convertHoursToQuarterHours(0),
      indexes: [...reverseFridays, ...reverseWeekDays],
    },
    {
      limit: convertHoursToQuarterHours(-12),
      indexes: [...reverseFridays, ...reverseWeekDays],
    },
  ];

  return {
    deficit: {
      differences: deficitTimeDifferences,
      incrementValue: 1,
      comparisonOperation: (variable, constant) => variable >= constant,
    },
    surplus: {
      differences: surplusTimeDifferences,
      incrementValue: -1,
      comparisonOperation: (variable, constant) => variable <= constant,
    },
  };
}

export function constructNewPayPeriod(referenceDate: Date): PayPeriod {
  console.log("creating new pay period with reference date", referenceDate);
  const { firstDate, lastDate } = getFirstAndLastDays(referenceDate);

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

  const timeDifferenceEntries = constructTimeDifferenceEntries(days);

  return recalculatePayPeriod({
    days,
    lastDate: lastDateInPayPeriod,
    quarterHourDifference: 0,
    timeDifferenceEntries,
  });
}

// Modifies days
function iterateHours(
  days: Day[],
  requiredTimeChange: number,
  timeDifferenceEntry: TimeDifferenceEntry
) {
  let elapsedTimeChange = 0;
  const {
    differences: timeDifferences,
    incrementValue,
    comparisonOperation,
  } = timeDifferenceEntry;

  for (const { limit, indexes } of timeDifferences) {
    let availableIndexes = indexes.filter(
      (index) => days[index].actualQuarterHours !== undefined
    );
    let hasReachedLimit = availableIndexes.length === 0;

    while (!hasReachedLimit) {
      for (const index of indexes) {
        if (!availableIndexes.includes(index)) {
          continue;
        }

        const existingQuarterHours = days[index].estimatedQuarterHours;

        if (comparisonOperation(existingQuarterHours, limit)) {
          availableIndexes = availableIndexes.filter((i) => i !== index);
          continue;
        }

        days[index].estimatedQuarterHours =
          existingQuarterHours + incrementValue;
        elapsedTimeChange = elapsedTimeChange - incrementValue;

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
  const requiredQuarterHours =
    existingPayPeriodWithNewDays.days.length * convertHoursToQuarterHours(8);
  const workingQuarterHours = existingPayPeriodWithNewDays.days.reduce(
    (acc, day) => acc + (day.actualQuarterHours ?? day.targetQuarterHours),
    0
  );
  const quarterHourDifference = workingQuarterHours - requiredQuarterHours;

  const modifiedDays = existingPayPeriodWithNewDays.days.map((day) => ({
    ...day,
    estimatedQuarterHours: day.actualQuarterHours ?? day.targetQuarterHours,
  }));

  if (quarterHourDifference !== 0) {
    let timeDifferenceEntry: TimeDifferenceEntry;

    if (quarterHourDifference > 0) {
      timeDifferenceEntry =
        existingPayPeriodWithNewDays.timeDifferenceEntries.surplus;
    } else {
      timeDifferenceEntry =
        existingPayPeriodWithNewDays.timeDifferenceEntries.deficit;
    }

    iterateHours(modifiedDays, quarterHourDifference, timeDifferenceEntry);
  }

  return {
    ...existingPayPeriodWithNewDays,
    days: modifiedDays,
    quarterHourDifference,
  };
}

export function convertQuarterHoursToString(
  quarterHours: number,
  includeSignIfPositive: boolean = false
) {
  const sign =
    quarterHours === 0
      ? ""
      : quarterHours < 0
      ? "-"
      : includeSignIfPositive
      ? "+"
      : "";
  const absoluteQuarterHours = Math.abs(quarterHours);
  const fullHours = Math.floor(absoluteQuarterHours / 4);
  const remainingQuarters = absoluteQuarterHours % 4;
  const quarterHoursAsMinutes = String(remainingQuarters * 15).padStart(2, "0");

  return `${sign}${fullHours}:${quarterHoursAsMinutes}`;
}

export function buildHoursDifference(quarterHourDifference: number) {
  if (quarterHourDifference === 0) {
    return "";
  }

  return `(${convertQuarterHoursToString(quarterHourDifference, true)})`;
}
