import {
  FormControl,
  Grid2,
  NativeSelect,
  Paper,
  Typography,
} from "@mui/material";
import { convertQuarterHoursToString, isFriday } from "../utility";
import { actualHoursOptions } from "./utility";
import { useMemo } from "react";

export type UpdateHours = (newActualQuarterHours: number) => void;
type DayRowProps = {
  day: Day;
  updateHours?: UpdateHours;
  editable: boolean;
};

export default function DayRow(props: DayRowProps) {
  const { day, updateHours, editable } = props;

  const quarterHourDifference =
    day.targetQuarterHours -
    (day.actualQuarterHours || day.estimatedQuarterHours);

  const expectedHoursMessage = `${convertQuarterHoursToString(
    day.estimatedQuarterHours
  )}${
    quarterHourDifference === 0
      ? ""
      : ` (${
          quarterHourDifference > 0 ? "-" : "+"
        }${convertQuarterHoursToString(Math.abs(quarterHourDifference))})`
  }`;

  const onHourChange = useMemo(() => {
    if (!editable || !updateHours) {
      return undefined;
    }
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateHours(Number(event.target.value));
    };
  }, [editable, updateHours]);

  return (
    <Paper elevation={3} sx={{ paddingY: 1.5, paddingX: 1 }}>
      <Grid2 container spacing={1} alignItems="end">
        <Grid2 size={4}>
          <Typography
            color={
              day.date.getDate() === new Date().getDate()
                ? "primary"
                : "textPrimary"
            }
          >
            {day.date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}
          </Typography>
        </Grid2>
        <Grid2 size={4}>
          <Typography
            color={
              quarterHourDifference === 0
                ? undefined
                : quarterHourDifference * (isFriday(day.date) ? -1 : 1) > 0
                ? "error"
                : "success"
            }
          >
            {expectedHoursMessage}
          </Typography>
        </Grid2>
        <Grid2 size={4}>
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
      </Grid2>
    </Paper>
  );
}
