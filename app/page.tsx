import { Container, Typography } from "@mui/material";

import Main from "./components/main";

export default function Page() {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Typography variant="h3" textAlign={"center"}>
        Time Card
      </Typography>
      <Main />
    </Container>
  );
}
