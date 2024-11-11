"use client";

import { Stack, Typography } from "@mui/material";
import withPayPeriod from "./withPayPeriod";
import DayRow from "./dayRow";
import { useCallback } from "react";
import { convertQuarterHoursToString } from "../utility";

function Main(props: WithPayPeriodProps) {
  const {
    payPeriod: { days, quarterHourDifference },
    updateDay,
  } = props;

  const getUpdateDayActuaQuarterlHours = useCallback(
    (index: number) => (newActualQuarterHours: number) => {
      updateDay(
        (existingDay) => ({
          ...existingDay,
          actualQuarterHours: newActualQuarterHours,
        }),
        index
      );
    },
    [updateDay, days]
  );

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {quarterHourDifference ? (
        <Typography
          textAlign="center"
          variant="h6"
          color={quarterHourDifference > 0 ? "success" : "error"}
        >
          {`You are ${
            quarterHourDifference > 0 ? "ahead" : "behind"
          } by ${convertQuarterHoursToString(Math.abs(quarterHourDifference))}`}
        </Typography>
      ) : null}
      {days.map((day, index) => (
        <DayRow
          day={day}
          key={`dayRowKey-${day.date.getTime()}`}
          updateHours={getUpdateDayActuaQuarterlHours(index)}
        />
      ))}
    </Stack>
  );
}

export default withPayPeriod(Main);
