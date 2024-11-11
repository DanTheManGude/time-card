"use client";

import { Stack } from "@mui/material";
import withPayPeriod from "./withPayPeriod";
import DayRow from "./dayRow";
import { useCallback } from "react";

function Main(props: WithPayPeriodProps) {
  const {
    payPeriod: { days },
    updateDay,
  } = props;

  const getUpdateDayActuaQuarterlHours = useCallback(
    (index: number) => (newActualQuarterHours: number) => {
      updateDay({
        ...days[index],
        actualQuarterHours: newActualQuarterHours,
      });
    },
    [updateDay]
  );

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
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
