import Container from "@mui/material/Container";

import Title from "./components/title";
import Main from "./components/main";

export default function Page() {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Title />
      <Main />
    </Container>
  );
}
