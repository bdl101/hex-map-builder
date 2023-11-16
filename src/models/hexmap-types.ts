import { CARDINAL_DIRECTIONS } from "./constants";

export interface HexMapConfig {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
  labelFormat: LabelFormatOption;
  hexOrientation: HexOrientation;
  terrainType: Terrain;
  paintType: PaintType;
  imageFormat: ImageFormatOption;
  showHexIcons: boolean;
  useTerrainColors: boolean;
  schemaVersion: string;
  hexStorage: HexStorage;
}

export type HexStorage = Array<
  Array<{
    terrainType?: Terrain;
  }>
>;

export interface HexLabelData {
  x: number;
  y: number;
  text: string;
}

export type HexIconData = React.SVGAttributes<SVGPathElement> | undefined;

export type ConfigKey = keyof HexMapConfig;

export type Vertices = Array<[number, number]>;

export type Terrain =
  | "none"
  | "plains"
  | "forest"
  | "desert"
  | "tundra"
  | "hills"
  | "volcanic"
  | "mountains"
  | "water"
  | "swamp";

export type LabelFormatOption = "none" | "numbersOnly" | "alphaX";

/** The orienation of the hexes on the map. `pointedTopEvenRow` has the even rows shoved right, `pointedTopOddRow` has the odd rows shoved right, `flatTopEvenColumn` has the even columns shoved down, and `flatTopOddColumn` has the odd columns shoved down. */
export type HexOrientation =
  | "pointedTopEvenRow"
  | "pointedTopOddRow"
  | "flatTopEvenColumn"
  | "flatTopOddColumn";

export type ImageFormatOption = "fixed" | "contained";

export type PaintType = "brush" | "bucket";

export type CardinalDirection = (typeof CARDINAL_DIRECTIONS)[number];

export type PointedTopsDirection = Exclude<
  CardinalDirection,
  "north" | "south"
>;

export type FlatTopsDirection = Exclude<CardinalDirection, "east" | "west">;

export interface VectorMapItem {
  hexShell: React.SVGAttributes<SVGPathElement>;
  icon?: HexIconData;
  label?: HexLabelData;
}

// -- Deprecated -- //
/** @deprecated */
export interface HexMapConfig0 {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
  labelFormat: LabelFormatOption;
  hexOrientation: HexOrientationOption;
  terrainType: Terrain;
  paintType: PaintType;
  imageFormat: ImageFormatOption;
  hexData: HexData;
  showHexIcons: boolean;
  useTerrainColors: boolean;
}

/** @deprecated */
export interface HexMapConfig01 {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
  labelFormat: LabelFormatOption;
  hexOrientation: HexOrientationOption;
  terrainType: Terrain;
  paintType: PaintType;
  imageFormat: ImageFormatOption;
  hexData: HexData;
  showHexIcons: boolean;
  useTerrainColors: boolean;
  schemaVersion: string;
}

/** @deprecated */
export type HexOrientationOption = "pointTop" | "flatTop";

/** @deprecated */
export type HexData = Record<
  number,
  | {
      terrainType: Terrain;
    }
  | undefined
>;
