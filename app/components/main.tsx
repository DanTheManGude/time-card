"use client";

import { Button, Stack, Typography, TypographyProps } from "@mui/material";
import { ContentCopyRounded } from "@mui/icons-material";

import withPayPeriod from "./withPayPeriod";
import DayRow from "./dayRow";
import { useCallback } from "react";
import { convertQuarterHoursToString } from "../utility";

function Main(props: WithPayPeriodProps) {
  const { payPeriod, updateDay, resetPayPeriod } = props;
  const { days, quarterHourDifference } = payPeriod;

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
    [updateDay]
  );

  const renderMessage = () => {
    let color: TypographyProps["color"];
    let message: string;

    if (quarterHourDifference === 0) {
      color = "info";
      message = "You are on track.";
    } else {
      message = `You are ${
        quarterHourDifference > 0 ? "ahead" : "behind"
      } by ${convertQuarterHoursToString(Math.abs(quarterHourDifference))}`;
    }

    return (
      <Typography textAlign="center" variant="h6" color={color}>
        {message}
      </Typography>
    );
  };

  return (
    <Stack direction={"column"} width={"100%"} paddingY={2} spacing={2}>
      {renderMessage()}
      {days.map((day, index) => (
        <DayRow
          day={day}
          key={`dayRowKey-${day.date.getTime()}`}
          updateHours={getUpdateDayActuaQuarterlHours(index)}
        />
      ))}

      <Button
        color="secondary"
        variant="outlined"
        endIcon={<ContentCopyRounded />}
        onClick={async () => {
          const payPeriodString = JSON.stringify(payPeriod);
          try {
            await navigator.clipboard.writeText(payPeriodString);
          } catch (error) {
            alert(payPeriodString);
            console.warn(error);
          }
        }}
        fullWidth
      >
        <Typography>Debug</Typography>
      </Button>
      <Button
        color="warning"
        onClick={resetPayPeriod}
        variant="outlined"
        fullWidth
      >
        <Typography>Reset</Typography>
      </Button>
    </Stack>
  );
}

export default withPayPeriod(Main);
