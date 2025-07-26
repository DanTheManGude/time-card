import { Button, Typography } from "@mui/material";
import MainStack from "./MainStack";

export default function NextPayperiod({
  viewCurrentPayPeriod,
}: {
  viewCurrentPayPeriod: () => void;
}) {
  return (
    <MainStack>
      <Button
        color="success"
        onClick={viewCurrentPayPeriod}
        variant="contained"
        fullWidth
        size="large"
      >
        <Typography>View current pay period</Typography>
      </Button>
    </MainStack>
  );
}
