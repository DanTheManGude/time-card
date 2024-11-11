import {
  FormControl,
  Grid2,
  InputLabel,
  NativeSelect,
  Paper,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { convertQuarterHoursToString } from "../utility";
import { actualHoursOptions } from "./utility";

export default function DayRow(props: {
  day: Day;
  updateHours: (newActualQuarterHours: number) => void;
}) {
  const { day, updateHours } = props;

  const expectedHoursMessage = `Expected- ${convertQuarterHoursToString(
    day.estimatedQuarterHours
  )}`;

  const actualHoursLabel = `actualHoursSelect-${day.date.getTime()}`;

  return (
    <Paper elevation={3} sx={{ paddingY: 1.5, paddingX: 1 }}>
      <Grid2 container spacing={2} alignItems="end">
        <Grid2 size={4}>
          <Typography key={day.date.getDate()}>
            {day.date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              weekday: "long",
            })}
          </Typography>
        </Grid2>
        <Grid2 size={4}>
          <Typography>{expectedHoursMessage}</Typography>
        </Grid2>
        <Grid2 size={4}>
          <FormControl fullWidth disabled={day.isHoliday}>
            <InputLabel variant="standard" htmlFor={actualHoursLabel}>
              Actual
            </InputLabel>
            <NativeSelect
              defaultValue={day.actualQuarterHours}
              inputProps={{
                name: "actualHours",
                id: actualHoursLabel,
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
