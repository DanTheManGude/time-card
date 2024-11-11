import { convertQuarterHoursToString } from "../utility";

const offset = 4 * 4;

export const actualHoursOptions = [
  <option value={0} key={"NOT_SET"}>
    {"Not set"}
  </option>,
  ...Array(4 * 12 + 1 - offset)
    .fill(null)
    .map((__v, index) => {
      const value = index + offset;
      return (
        <option value={value} key={`${value}`}>
          {convertQuarterHoursToString(value)}
        </option>
      );
    }),
];
