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
          component="video"
          src={"/dog.mp4"}
          autoPlay
          loop
          muted
          playsInline
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
          }}
        />
      </Stack>
    </>
  );
}
