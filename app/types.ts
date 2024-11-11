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

type TimeDifferences = {
  deficit: TimeDifference[];
  surplus: TimeDifference[];
};

type PayPeriod = {
  days: Day[];
  lastDate: Date;
  quarterHourDifference: number;
  timeDifferences: TimeDifferences;
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
}

type Holiday = {
  month: number;
  day: number;
};
