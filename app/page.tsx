import { Container, Typography } from "@mui/material";

import Main from "./components/main";

export default function Page() {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Typography variant="h3" textAlign={"center"}>
        Time Card
      </Typography>
      <Main
        payPeriod={{
          days: [],
          lastDate: new Date(),
          quaterHourDifference: 0,
        }}
        updateDay={function (newDay: Day): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Container>
  );
}
