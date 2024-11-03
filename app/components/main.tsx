"use client";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import { withDays } from "./WithDays";

function renderDay(day: Day) {
  return day.date.toLocaleString();
}

function renderDays(days: Day[], isPast: boolean) {
  return (
    <Accordion defaultExpanded={!isPast}>
      <AccordionSummary expandIcon={<ExpandMore />} id={`renderDays-${isPast}`}>
        <Typography variant="h6">
          {isPast ? "Past Days" : "Current and Future Days"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction={"column"}>{days.map(renderDay)}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function Title(props: WithDaysProps) {
  const { days } = props;

  const [pastDays, setPastDays] = useState<Day[]>([]);
  const [presentAndFutureDays, setPresentAndFutureDays] = useState<Day[]>([]);

  return (
    <Stack direction={"column"} width={"100%"} paddingY={3} spacing={2}>
      {renderDays(pastDays, true)}
      {renderDays(presentAndFutureDays, false)}
    </Stack>
  );
}

export default withDays(Title);
