"use client";
import { useCallback, useState } from "react";
import { Button, Typography } from "@mui/material";
import withPayPeriod from "./withPayPeriod";
import Message from "./Message";
import MainStack from "./MainStack";
import NextPayperiod from "./NextPayperiod";
import DayList from "./DayList";

function Main(props: WithPayPeriodProps) {
  const { payPeriod, updateDay, resetPayPeriod } = props;
  const { days, quarterHourDifference } = payPeriod;

  const [isPreviewNext, setIsPreviewNext] = useState(false);
  const previewNextPayPeriod = useCallback(() => {
    scrollTo(0, 0);
    setIsPreviewNext(true);
  }, []);
  const viewCurrentPayPeriod = useCallback(() => {
    setIsPreviewNext(false);
  }, []);

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

  if (isPreviewNext) {
    return (
      <NextPayperiod
        viewCurrentPayPeriod={viewCurrentPayPeriod}
        nextPayPeriod={payPeriod}
      />
    );
  }

  return (
    <MainStack>
      <Message quarterHourDifference={quarterHourDifference} />
      <DayList
        days={days}
        getUpdateHours={getUpdateDayActuaQuarterlHours}
        editable={true}
      />
      <Button
        color="info"
        onClick={previewNextPayPeriod}
        variant="contained"
        fullWidth
        size="large"
      >
        <Typography>Preview next</Typography>
      </Button>

      <Button
        color="warning"
        onClick={resetPayPeriod}
        variant="outlined"
        fullWidth
      >
        <Typography>Reset</Typography>
      </Button>
    </MainStack>
  );
}

export default withPayPeriod(Main);
