import { Box, Stack, Typography } from "@mui/material";
import PartyGif from "../assets/party.gif";

export default function LastDayCelebration() {
  return (
    <Stack
      direction={"column"}
      justifyContent={"center"}
      alignContent={"space-around"}
      pt={5}
    >
      <Typography
        textAlign="center"
        variant="h5"
        gutterBottom
        color={"primary"}
        paddingInline={1}
      >
        {"Congratualations on making it to the end :)"}
      </Typography>
      <Box
        component="img"
        src={PartyGif.src}
        alt="party"
        sx={{
          width: "100%",
          maxWidth: 400,
          height: "auto",
        }}
      />
    </Stack>
  );
}
