"use client";

import { Stack } from "@mui/material";

import { withDays } from "./WithDays";

function renderDay(day: Day) {
  return day.date.toLocaleString();
}

function Title(props: WithDaysProps) {
  const { days } = props;

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {days.map(renderDay)}
    </Stack>
  );
}

export default withDays(Title);
