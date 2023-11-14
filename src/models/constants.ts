import { HexMapConfig, Terrain } from "./hexmap-types";

export const CONFIG_STORAGE_KEY = "hexmap-config";

export const CURRENT_CONFIG_SCHEMA_VERSION = "0.1";

export const ANGLE = (2 * Math.PI) / 6;
export const DEFAULT_ROW_COUNT = 3;
export const DEFAULT_COLUMN_COUNT = 4;
export const DEFAULT_HEX_RADIUS = 50;

export const DEFAULT_HEXMAP_CONFIG: HexMapConfig = {
  rowCount: DEFAULT_ROW_COUNT,
  columnCount: DEFAULT_COLUMN_COUNT,
  hexRadius: DEFAULT_HEX_RADIUS,
  terrainType: "none",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointTop",
  hexData: {},
  imageFormat: "contained",
  showHexIcons: false,
  useTerrainColors: true,
};

// [A-Z]
export const UPPER_ALPHA_INDICES = Array.from(Array(26)).map((e, i) => i + 65);

export const TERRAIN_HEX_COLOR_MAP: Record<Terrain, string> = {
  none: "transparent",
  plains: "lightGreen",
  forest: "forestGreen",
  hills: "rosyBrown",
  desert: "ivory",
  tundra: "azure",
  water: "steelblue",
  swamp: "teal",
  volcanic: "lightslategray",
  mountains: "brown",
};

export const TERRAIN_ICON_PROPS_MAP: Record<
  Terrain,
  React.SVGAttributes<SVGPathElement>
> = {
  none: {},
  plains: {
    d: "M 25 50 L 40 50 M 45 50 L 50 50 M 55 50 L 60 50 M 65 50 L 70 50",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  forest: {
    d: "M 40 70 C 43 65 45 50 41 45 M 60 70 C 57 65 56 50 59 45 M 50 46 C 15 43 25 25 50 24 M 50 24 C 75 25 85 43 50 46 M 25 70 L 75 70",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  hills: {
    d: "M 25 60 C 32 40, 48 40, 55 60 M 50 48 C 58 38, 70 40, 75 54",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  desert: {
    d: "M 34 42 L 40 42 M 56 60 L 62 60 M 30 62 L 36 62 M 62 38 L 68 38",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  tundra: {
    d: "M 32 49 L 68 49 M 49 32 L 49 68 M 39 39 L 59 59 M 59 39 L 39 59",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.2,
    rx: 2,
  },
  water: {
    d: "M 25 40 C 46 25, 52 55, 75 40 M 25 60 C 46 45, 52 75, 75 60",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  swamp: {
    d: "M 49 70 L 49 30 M 35 45 L 49 30 L 63 45 M 35 55 L 49 40 L 63 55",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
  volcanic: {
    d: "M 34 42 L 48 35 L 65 40 L 71 54 L 65 62 L 51 68 L 40 63 L 32 51 Z M 48 35 L 47 45 L 55 55 L 51 68",
    stroke: "red",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.4,
    rx: 2,
  },
  mountains: {
    d: "M 25 65 L 38 40 L 44 50 L 54 25 L 70 65 Z",
    stroke: "black",
    strokeWidth: 3,
    fill: "transparent",
    opacity: 0.5,
    rx: 2,
  },
};
