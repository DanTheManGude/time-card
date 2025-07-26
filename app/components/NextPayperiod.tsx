import { Button, Typography } from "@mui/material";
import MainStack from "./MainStack";
import Message from "./Message";
import DayList from "./DayList";

export default function NextPayperiod({
  viewCurrentPayPeriod,
  nextPayPeriod: payPeriod,
}: {
  viewCurrentPayPeriod: () => void;
  nextPayPeriod: PayPeriod;
}) {
  const { days, quarterHourDifference } = payPeriod;

  return (
    <MainStack>
      <Message quarterHourDifference={quarterHourDifference} />
      <Button
        color="success"
        onClick={viewCurrentPayPeriod}
        variant="contained"
        fullWidth
        size="large"
      >
        <Typography>View current pay period</Typography>
      </Button>
      <DayList days={days} editable={false} />
    </MainStack>
  );
}
