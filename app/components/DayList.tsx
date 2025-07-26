import DayRow, { UpdateHours } from "./dayRow";

type DayListProps = {
  days: Day[];
  getUpdateHours?: (index: number) => UpdateHours;
  editable: boolean;
};

export default function DayList({
  days,
  getUpdateHours,
  editable,
}: DayListProps) {
  return days.map((day, index) => (
    <DayRow
      day={day}
      key={`dayRowKey-${day.date.getTime()}`}
      updateHours={getUpdateHours && getUpdateHours(index)}
      editable={editable}
    />
  ));
}
