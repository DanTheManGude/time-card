import { useCallback, useMemo } from "react";

import {
  FormControl,
  Grid2,
  NativeSelect,
  Paper,
  Typography,
} from "@mui/material";
import {
  buildHoursDifference,
  convertQuarterHoursToString,
  isFriday,
} from "../utility";
import { actualHoursOptions } from "./utility";

type UpdateHours = (newActualQuarterHours: number) => void;

type DayListProps = {
  days: Day[];
  getUpdateHours?: (index: number) => UpdateHours;
  editable: boolean;
};

type DayRowProps = {
  day: Day;
  getUpdateHours?: (index: number) => UpdateHours;
  index: number;
  editable: boolean;
  isToday: boolean;
};

function DayRow(props: DayRowProps) {
  const { day, getUpdateHours, index, editable, isToday } = props;

  const updateHours = useMemo(
    () => (getUpdateHours ? getUpdateHours(index) : undefined),
    [getUpdateHours, index]
  );

  const quarterHourDifference = useMemo(
    () =>
      day.targetQuarterHours -
      (day.actualQuarterHours || day.estimatedQuarterHours),
    [day.actualQuarterHours, day.estimatedQuarterHours, day.targetQuarterHours]
  );

  const expectedHoursMessage = useMemo(() => {
    const estimatedHours = convertQuarterHoursToString(
      day.estimatedQuarterHours
    );
    const hourDifference = buildHoursDifference(quarterHourDifference);

    return `${estimatedHours} ${hourDifference}`;
  }, [day.estimatedQuarterHours, quarterHourDifference]);

  const onHourChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!editable || !updateHours) {
        return;
      }

      updateHours(Number(event.target.value));
    },
    [editable, updateHours]
  );

  const gridSize = useMemo(() => (editable ? 4 : 6), [editable]);

  const dayColor = useMemo(
    () => (isToday ? "primary" : "textPrimary"),
    [isToday]
  );
  const dayPresentation = useMemo(
    () =>
      day.date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
    [day.date]
  );
  const timeColor = useMemo(
    () =>
      quarterHourDifference === 0
        ? undefined
        : quarterHourDifference * (isFriday(day.date) ? -1 : 1) > 0
        ? "error"
        : "success",
    [quarterHourDifference, day.date]
  );

  return (
    <Paper elevation={3} sx={{ paddingY: 1.5, paddingX: 1 }}>
      <Grid2 container spacing={1} alignItems="end">
        <Grid2 size={gridSize}>
          <Typography color={dayColor}>{dayPresentation}</Typography>
        </Grid2>
        <Grid2 size={gridSize}>
          <Typography color={timeColor}>{expectedHoursMessage}</Typography>
        </Grid2>
        {editable && (
          <Grid2 size={gridSize}>
            <FormControl fullWidth disabled={day.isHoliday || !editable}>
              <NativeSelect
                defaultValue={day.actualQuarterHours}
                inputProps={{
                  name: "actualHours",
                  id: `actualHoursSelect-${day.date.getTime()}`,
                }}
                onChange={onHourChange}
              >
                {actualHoursOptions}
              </NativeSelect>
            </FormControl>
          </Grid2>
        )}
      </Grid2>
    </Paper>
  );
}

export default function DayList({
  days,
  getUpdateHours,
  editable,
}: DayListProps) {
  const todaysDate = useMemo(() => new Date().getDate(), []);

  return days.map((day, index) => (
    <DayRow
      day={day}
      key={`dayRowKey-${day.date.getTime()}`}
      getUpdateHours={getUpdateHours}
      index={index}
      editable={editable}
      isToday={day.date.getDate() === todaysDate}
    />
  ));
}
