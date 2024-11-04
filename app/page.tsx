import { Container, Typography } from "@mui/material";

import Body from "./Components/Body";

export default function Page() {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Typography variant="h3" textAlign={"center"}>
        Time Card
      </Typography>
      <Body />
    </Container>
  );
}
