/* eslint-disable @typescript-eslint/no-unused-vars */

type Modify<T, R> = Omit<T, keyof R> & R;

type Day = {
  date: Date;
  actualQuarterHours?: number;
  estimatedQuarterHours: number;
};

type PayPeriod = {
  days: Day[];
  lastDate: Date;
  quaterHourDifference: number;
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
  updateDay: (newDay: Day) => void;
}

type Holiday = {
  month: number;
  day: number;
};
