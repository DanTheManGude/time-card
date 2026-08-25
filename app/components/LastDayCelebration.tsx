import { Box, Stack, Typography } from "@mui/material";

export default function LastDayCelebration() {
  return (
    <>
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
          src={"/party.gif"}
          alt="party"
          zIndex={9000}
          sx={{
            width: "100%",
            height: "auto",
          }}
        />
      </Stack>
    </>
  );
}
