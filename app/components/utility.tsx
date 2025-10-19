import { convertHoursToQuarterHours } from "../constants";
import { convertQuarterHoursToString } from "../utility";

const startTime = convertHoursToQuarterHours(0);
const endTime = convertHoursToQuarterHours(12);

export const actualHoursOptions = [
  <option value={0} key={"NOT_SET"}>
    {"Not set"}
  </option>,
  ...Array(endTime + 1 - startTime)
    .fill(null)
    .map((__v, index) => {
      const value = index + startTime;
      return (
        <option value={value} key={`${value}`}>
          {convertQuarterHoursToString(value)}
        </option>
      );
    }),
];
