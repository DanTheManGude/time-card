"use client";

import { createTheme } from "@mui/material/styles";

import { fontFamilies } from "./constants";

export default createTheme({
  typography: {
    fontFamily: fontFamilies.join(","),
  },
  palette: { mode: "dark" },
});
