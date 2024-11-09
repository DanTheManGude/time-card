import { convertQuarterHoursToString } from "../utility";

export const actualHoursOptions = Array.apply(null, Array(4 * 12 + 1)).map(
  (__value, index) => (
    <option value={index} key={`${index}`}>
      {index ? convertQuarterHoursToString(index) : "Not set"}
    </option>
  )
);
