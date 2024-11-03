import Container from "@mui/material/Container";

import Title from "./components/Title";
import Main from "./components/Main";

export default function Page() {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Title />
      <Main />
    </Container>
  );
}
