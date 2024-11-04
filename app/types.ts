type Day = {
  date: Date;
  actualQuarterHours?: number;
  estimatedQuarterHours: number;
};

type PayPeriod = {
  days: Day[];
  lastDate: Date;
};

interface WithPayPeriodProps {
  days: Day[];
  updateDay: (newDay: Day) => void;
}

type Holiday = {
  month: number;
  day: number;
};
