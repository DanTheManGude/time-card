"use client";

import { Stack } from "@mui/material";

import { withPayPeriod } from "./WithPayPeriod";

function renderDay(day: Day) {
  return day.date.toLocaleDateString();
}

function Main(props: WithPayPeriodProps) {
  const { days } = props;

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {days.map(renderDay)}
    </Stack>
  );
}

export default withPayPeriod(Main);
