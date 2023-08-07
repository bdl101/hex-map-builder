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
export type ImageFormatOption = "fixed" | "contained";
export type PaintType = "brush" | "bucket";
export type HexData = {
  [key: number]:
    | {
        terrainType: Terrain;
      }
    | undefined;
};
