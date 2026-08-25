import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { LAST_DAY } from "../constants";

const mesageTemplate = "days left.";

export default function Countdown() {
  const todaysDate = useMemo(() => {
    return new Date();
  }, []);

  const message = useMemo(() => {
    const timeDifference = LAST_DAY.getTime() - todaysDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) - 1;
    return `${daysDifference} ${mesageTemplate}`;
  }, [todaysDate]);

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignContent={"space-around"}
    >
      <Typography
        textAlign="center"
        variant="h5"
        gutterBottom
        bgcolor={"primary.main"}
        color={"primary.contrastText"}
        paddingInline={1}
      >
        {message}
      </Typography>
    </Stack>
  );
}
