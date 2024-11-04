type Day = {
  date: Date;
};

type PayPeriod = {
  days: Day[];
  lastDate: Date;
};

interface WithPayPeriodProps {
  days: Day[];
  updateDay: (newDay: Day) => void;
}
