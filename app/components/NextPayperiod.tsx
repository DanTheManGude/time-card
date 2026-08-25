import { Button, Typography } from "@mui/material";
import MainStack from "./MainStack";
import Message from "./Message";
import DayList from "./DayList";
import Countdown from "./Countdown";
import { LAST_DAY } from "../constants";
import { useMemo } from "react";
import LastDayCelebration from "./LastDayCelebration";

export default function NextPayperiod({
  viewCurrentPayPeriod,
  nextPayPeriod: payPeriod,
}: {
  viewCurrentPayPeriod: () => void;
  nextPayPeriod: PayPeriod;
}) {
  const { days, quarterHourDifference } = payPeriod;

  const pastLastDay = useMemo(
    () => payPeriod.days[0].date > LAST_DAY,
    [payPeriod],
  );

  return (
    <MainStack>
      <Countdown />
      {!pastLastDay && (
        <Message quarterHourDifference={quarterHourDifference} />
      )}
      <Button
        color="success"
        onClick={viewCurrentPayPeriod}
        variant="contained"
        fullWidth
        size="large"
      >
        <Typography>View current pay period</Typography>
      </Button>
      {!pastLastDay && <DayList days={days} editable={false} />}
      {pastLastDay && <LastDayCelebration />}
    </MainStack>
  );
}
