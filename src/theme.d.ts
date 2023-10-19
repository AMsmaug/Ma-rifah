import { PaletteColor, PaletteColorOptions } from "@mui/material";
// import React from "react";

declare module "@mui/material/styles" {
  interface Palette {
    gray?: PaletteColor;
  }
  interface PaletteOptions {
    gray?: PaletteColorOptions;
  }
}
