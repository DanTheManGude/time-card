type Day = {
  date: Date;
};

type PayPeriod = {
  days: Day[];
};

interface WithPayPeriodProps {
  days: Day[];
  updateDay: (newDay: Day) => void;
}
