import {
  FormControl,
  Grid2,
  NativeSelect,
  Paper,
  Typography,
} from "@mui/material";
import { convertQuarterHoursToString, isFriday } from "../utility";
import { actualHoursOptions } from "./utility";

export default function DayRow(props: {
  day: Day;
  updateHours: (newActualQuarterHours: number) => void;
}) {
  const { day, updateHours } = props;

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

  return (
    <Paper elevation={3} sx={{ paddingY: 1.5, paddingX: 1 }}>
      <Grid2 container spacing={1} alignItems="end">
        <Grid2 size={4}>
          <Typography>
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
          <FormControl fullWidth disabled={day.isHoliday}>
            <NativeSelect
              defaultValue={day.actualQuarterHours}
              inputProps={{
                name: "actualHours",
                id: `actualHoursSelect-${day.date.getTime()}`,
              }}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                updateHours(Number(event.target.value));
              }}
            >
              {actualHoursOptions}
            </NativeSelect>
          </FormControl>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
