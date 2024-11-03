import { Stack } from "@mui/material";
import { withDays } from "./WithDays";

function Title(props: WithDaysProps) {
  return <Stack direction={"column"} width={"100%"}></Stack>;
}

export default withDays(Title);
