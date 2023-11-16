import { SVGAttributes } from "react";
import {
  Vertices,
  HexLabelData,
  HexMapConfig,
  LabelFormatOption,
  HexIconData,
  TERRAIN_ICON_PROPS_MAP,
  UPPER_ALPHA_INDICES,
  VectorMapItem,
  HexOrientation,
  Terrain,
  TERRAIN_HEX_COLOR_MAP,
} from "../models";
import {
  determineHexInnerDiameter,
  determineLabelFontSizeByRatio,
  determineRadiusRatioModifier,
  prepareHexOrigin,
  prepareVertices,
} from "./hex-calculations";

/** Get the vector path string to draw a hexagon with the provided vertices. */
export const prepareHexPath = (vertices: Vertices) => {
  return vertices.reduce((accumulator, currentValue, index) => {
    accumulator +=
      index === vertices.length - 1
        ? ` Z`
        : ` L ${currentValue[0]} ${currentValue[1]}`;
    return accumulator;
  }, `M ${vertices[5][0]} ${vertices[5][1]} `);
};

/** Prepare the render values needed to draw the hex shell for a given hex. */
export const prepareHexShell = ({
  vertices,
  hexRadius,
  terrainType,
  useTerrainColors,
}: {
  vertices: Vertices;
  hexRadius: number;
  terrainType?: Terrain;
  useTerrainColors: boolean;
}): SVGAttributes<SVGPathElement> => {
  const ratio = determineRadiusRatioModifier(hexRadius);

  return {
    d: prepareHexPath(vertices),
    fill:
      terrainType && useTerrainColors
        ? TERRAIN_HEX_COLOR_MAP[terrainType]
        : "transparent",
    stroke: "#000",
    strokeWidth: Math.round(ratio),
  };
};

/** Given a particular terrain type for a hex, prepare the render props needed for an icon vector path. */
export const prepareHexIcon = ({
  hexRadius,
  showHexIcons,
  terrainType,
  originPoint,
  hexOrientation,
}: {
  hexRadius: number;
  terrainType?: Terrain;
  showHexIcons: boolean;
  originPoint: {
    xCoordinate: number;
    yCoordinate: number;
  };
  hexOrientation: HexOrientation;
}): HexIconData => {
  if (!showHexIcons || terrainType === undefined || terrainType === "none") {
    return undefined;
  }
  // The original icons paths were measured based on the default hex radius, so if that changed, we need to adjust the coordinates appropriately.
  const sizeMultitplier = determineRadiusRatioModifier(hexRadius);
  const hexInnerDiameter = determineHexInnerDiameter(hexRadius);
  const originalPathString = `${TERRAIN_ICON_PROPS_MAP[terrainType].d}`;
  let counter = 0;

  let xOffset = 0;
  let yOffset = 0;

  switch (hexOrientation) {
    case "pointedTopEvenRow":
    case "pointedTopOddRow":
      xOffset =
        originPoint.xCoordinate - 7 * sizeMultitplier - hexInnerDiameter / 2;
      yOffset = originPoint.yCoordinate - hexRadius;
      break;
    case "flatTopEvenColumn":
    case "flatTopOddColumn":
      xOffset = originPoint.xCoordinate - hexRadius;
      yOffset =
        originPoint.yCoordinate - 7 * sizeMultitplier - hexInnerDiameter / 2;
      break;
  }

  // Find every coordinate in the path draw string, and update the value with the offset from the current hex column/row.
  const newPathString = originalPathString.replace(
    /(\d+)+/g,
    (match, number) => {
      const updatedCoordinate = `${(
        parseFloat(number) * sizeMultitplier +
        (counter % 2 === 0 ? xOffset : yOffset)
      ).toFixed(2)}`;
      counter++;
      return updatedCoordinate;
    }
  );
  return {
    ...TERRAIN_ICON_PROPS_MAP[terrainType],
    d: newPathString,
    strokeWidth: Math.round(sizeMultitplier * 2),
  };
};

/** Given a numeric index for a coordinate, convert that number into an alphabetical equivalent. */
export const convertNumericToAlpha = (numericCoordinate: number) => {
  const letterRepititions = Math.ceil(
    (numericCoordinate + 1) / UPPER_ALPHA_INDICES.length
  );
  console.log(letterRepititions);
  let alphaXString = "";
  for (let i = 0; i < letterRepititions; i++) {
    alphaXString += String.fromCharCode(
      UPPER_ALPHA_INDICES[numericCoordinate % UPPER_ALPHA_INDICES.length]
    );
  }
  return alphaXString;
};

/** Get the vector text data to draw a coordinates label within the provided vertices. */
export const prepareHexLabelData = ({
  originPoint,
  hexRadius,
  hexOrientation,
  columnIndex,
  rowIndex,
  labelFormat,
}: {
  originPoint: {
    xCoordinate: number;
    yCoordinate: number;
  };
  hexRadius: number;
  hexOrientation: HexOrientation;
  columnIndex: number;
  rowIndex: number;
  labelFormat: LabelFormatOption;
}): HexLabelData | undefined => {
  if (labelFormat === "none") {
    return undefined;
  }
  const { xCoordinate, yCoordinate } = originPoint;

  const hexInnerDiameter = determineHexInnerDiameter(hexRadius);
  const ratio = determineRadiusRatioModifier(hexRadius);
  const fontSize = determineLabelFontSizeByRatio(ratio);

  const labelText =
    labelFormat === "numbersOnly"
      ? `${columnIndex},${rowIndex}`
      : `${convertNumericToAlpha(columnIndex)},${rowIndex}`;

  if (
    hexOrientation === "pointedTopOddRow" ||
    hexOrientation === "pointedTopEvenRow"
  ) {
    const xOffset = Math.round(ratio * 3);
    return {
      text: labelText,
      x: xCoordinate + xOffset - hexInnerDiameter / 2,
      y: yCoordinate + fontSize - hexRadius / 2,
    };
  } else {
    const xOffset = Math.round(ratio);
    return {
      text: labelText,
      x: xCoordinate + xOffset - hexRadius / 2,
      y: yCoordinate + fontSize - hexInnerDiameter / 2,
    };
  }
};

/** Given a set of configurations, prepare the viewbox size for the hex map. */
export const prepareViewboxValues = (
  config: HexMapConfig
  // TODO: use more specific props
): { maxWidth: number; maxHeight: number; viewboxString: string } => {
  const { rowCount, columnCount, hexRadius, hexOrientation } = config;
  const hexInnerDiameter = determineHexInnerDiameter(hexRadius);

  let maxWidth = 0;
  let maxHeight = 0;
  if (
    hexOrientation === "pointedTopEvenRow" ||
    hexOrientation === "pointedTopOddRow"
  ) {
    maxWidth = Math.round(
      columnCount * hexInnerDiameter + 0.5 * hexInnerDiameter
    );
    maxHeight = Math.round(rowCount * hexRadius * 1.5 + hexRadius / 2);
  } else {
    maxHeight = Math.round(
      rowCount * hexInnerDiameter + 0.5 * hexInnerDiameter
    );
    maxWidth = Math.round(columnCount * hexRadius * 1.5 + hexRadius / 2);
  }
  return { maxWidth, maxHeight, viewboxString: `0 0 ${maxWidth} ${maxHeight}` };
};

/** Given a set of configurations, prepare the viewbox size for the hex map. */
export const prepareVectorMapData = ({
  hexStorage,
  hexOrientation,
  hexRadius,
  showHexIcons,
  useTerrainColors,
  labelFormat,
}: HexMapConfig) => {
  const vectorMapData = hexStorage.map((row, rowIndex) => {
    return row.map((column, columnIndex) => {
      const originPoint = prepareHexOrigin(
        columnIndex,
        rowIndex,
        hexRadius,
        hexOrientation
      );
      const hexVertices = prepareVertices(
        originPoint.xCoordinate,
        originPoint.yCoordinate,
        hexRadius,
        hexOrientation
      );
      const hexShell = prepareHexShell({
        vertices: hexVertices,
        hexRadius,
        terrainType: column.terrainType,
        useTerrainColors,
      });
      const hexLabel = prepareHexLabelData({
        originPoint,
        hexOrientation,
        hexRadius,
        columnIndex,
        rowIndex,
        labelFormat,
      });
      const hexIcon = prepareHexIcon({
        hexRadius,
        showHexIcons,
        terrainType: column.terrainType,
        originPoint,
        hexOrientation,
      });

      const hexData: VectorMapItem = {
        hexShell,
        label: hexLabel,
        icon: hexIcon,
      };
      return hexData;
    });
  });

  return vectorMapData;
};
