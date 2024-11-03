type Day = {
  date: Date;
};

interface WithDaysProps {
  days: Day[];
  updateDay: (newDay: Day) => void;
}
