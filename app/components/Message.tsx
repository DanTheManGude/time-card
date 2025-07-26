import { Typography, TypographyProps } from "@mui/material";
import { convertQuarterHoursToString } from "../utility";

export default function Message({
  quarterHourDifference,
}: {
  quarterHourDifference: number;
}) {
  let color: TypographyProps["color"];
  let message: string;

  if (quarterHourDifference === 0) {
    color = "info";
    message = "You are on track.";
  } else {
    message = `You are ${
      quarterHourDifference > 0 ? "ahead" : "behind"
    } by ${convertQuarterHoursToString(Math.abs(quarterHourDifference))}`;
  }

  return (
    <Typography textAlign="center" variant="h6" color={color}>
      {message}
    </Typography>
  );
}
