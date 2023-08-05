export interface HexMapConfig {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
  labelFormat: LabelFormatOption;
  hexOrientation: HexOrientationOption;
  paintFill: HexFillColor;
  hexFills: {
    [key: number]: HexFillColor | undefined;
  };
}

export interface HexLabelData {
  x: number;
  y: number;
  label: string;
}

export type ConfigKey = keyof HexMapConfig;

export type Vertices = Array<[number, number]>;

export type HexFillColor =
  | "transparent"
  | "grey"
  | "red"
  | "brown"
  | "ivory"
  | "darkcyan";
export type LabelFormatOption = "none" | "numbersOnly" | "alphaX";
export type HexOrientationOption = "pointTop" | "flatTop";
