"use client";

import { Stack, Typography } from "@mui/material";
import withPayPeriod from "./WithPayPeriod";

function renderDay(day: Day) {
  return (
    <Typography key={day.date.getDate()}>
      {day.date.toLocaleDateString()}
    </Typography>
  );
}

function Main(props: WithPayPeriodProps) {
  const {
    payPeriod: { days },
  } = props;

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {days.map(renderDay)}
    </Stack>
  );
}

export default withPayPeriod(Main);
