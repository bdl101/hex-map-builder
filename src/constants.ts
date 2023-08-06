import { HexMapConfig } from "./models";

export const ANGLE = (2 * Math.PI) / 6;
export const DEFAULT_ROW_COUNT = 3;
export const DEFAULT_COLUMN_COUNT = 4;
export const DEFAULT_HEX_RADIUS = 50;

export const DEFAULT_HEXMAP_CONFIG: HexMapConfig = {
  rowCount: DEFAULT_ROW_COUNT,
  columnCount: DEFAULT_COLUMN_COUNT,
  hexRadius: DEFAULT_HEX_RADIUS,
  paintColor: "transparent",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointTop",
  hexFills: {},
  imageFormat: "contained",
};

// [A-Z]
export const UPPER_ALPHA_INDICES = Array.from(Array(26)).map((e, i) => i + 65);
