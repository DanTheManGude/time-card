/* eslint-disable @typescript-eslint/no-unused-vars */

type Modify<T, R> = Omit<T, keyof R> & R;

type Day = {
  date: Date;
  actualQuarterHours?: number;
  estimatedQuarterHours: number;
  targetQuarterHours: number;
  isHoliday: boolean;
};

type TimeDifference = {
  limit: number;
  indexes: number[];
};

type TimeDifferenceIncrementValue = 1 | -1;

type TimeDifferenceComparisonOperation = (
  variable: number,
  constant: number
) => boolean;

type TimeDifferenceEntry = {
  differences: TimeDifference[];
  incrementValue: TimeDifferenceIncrementValue;
};

type TimeDifferenceCategory = "deficit" | "surplus";

type TimeDifferenceEntries = {
  [key in TimeDifferenceCategory]: TimeDifferenceEntry;
};

type PayPeriodVersion = "v1";

type PayPeriod = {
  days: Day[];
  lastDate: Date;
  quarterHourDifference: number;
  timeDifferenceEntries: TimeDifferenceEntries;
  version: PayPeriodVersion;
};

type ParsedSavedPayPeriod = Modify<
  PayPeriod,
  {
    days: Modify<
      Day,
      {
        date: string;
      }
    >[];
    lastDate: string;
  }
>;

interface WithPayPeriodProps {
  payPeriod: PayPeriod;
  updateDay: (getNewDay: (existingDay: Day) => Day, index: number) => void;
  resetPayPeriod: () => void;
  nextPayPeriod?: PayPeriod;
}

type Holiday = {
  month: number;
  day: number;
};
