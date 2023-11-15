import { CARDINAL_DIRECTIONS } from "./constants";

export interface HexMapConfig {
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
  schemaVersion?: string;
}

export type HexStorage = Array<
  Array<{
    terrainType?: Terrain;
  }>
>;

// TODO: find a better way to manage this
export interface HexMapConfig2 {
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

export interface HexLabelData {
  x: number;
  y: number;
  label: string;
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

export type HexOrientationOption = "pointTop" | "flatTop";

/** TODO */
export type HexOrientation =
  | "pointedTopEvenRow"
  | "pointedTopOddRow"
  | "flatTopEvenColumn"
  | "flatTopOddColumn";

export type ImageFormatOption = "fixed" | "contained";

export type PaintType = "brush" | "bucket";

export type HexData = Record<
  number,
  | {
      terrainType: Terrain;
    }
  | undefined
>;

export type CardinalDirection = (typeof CARDINAL_DIRECTIONS)[number];

export type PointedTopsDirection = Exclude<
  CardinalDirection,
  "north" | "south"
>;

export type FlatTopsDirection = Exclude<CardinalDirection, "east" | "west">;

export interface VectorMapItem {
  hexPath: string;
  icon?: HexIconData;
  label?: HexLabelData;
}
