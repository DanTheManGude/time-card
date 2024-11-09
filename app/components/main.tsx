"use client";

import { Stack } from "@mui/material";
import withPayPeriod from "./withPayPeriod";
import DayRow from "./dayRow";

function Main(props: WithPayPeriodProps) {
  const {
    payPeriod: { days },
  } = props;

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {days.map((day) => (
        <DayRow day={day} key={`dayRowKey-${day.date.getTime()}`} />
      ))}
    </Stack>
  );
}

export default withPayPeriod(Main);
