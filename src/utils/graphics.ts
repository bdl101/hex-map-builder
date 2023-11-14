import { SetStateAction, Dispatch } from "react";
import {
  Vertices,
  HexLabelData,
  HexMapConfig,
  LabelFormatOption,
  HexData,
  HexIconData,
  HexOrientationOption,
  ANGLE,
  DEFAULT_HEX_RADIUS,
  TERRAIN_ICON_PROPS_MAP,
  UPPER_ALPHA_INDICES,
} from "../models";
import { prepareVertices } from "./hex-calculations";

/** Get the vector path data to draw a hexagon with the provided vertices. */
export const prepareHexPath = (vertices: Vertices) => {
  return vertices.reduce((accumulator, currentValue, index) => {
    accumulator +=
      index === vertices.length - 1
        ? ` Z`
        : ` L ${currentValue[0]} ${currentValue[1]}`;
    return accumulator;
  }, `M ${vertices[5][0]} ${vertices[5][1]} `);
};

/** Given a particular terrain type for a hex, prepare the render props needed for an icon vector path. */
export const prepareHexIcon = (
  config: HexMapConfig,
  nodeKey: number,
  columnOffset: number,
  rowOffset: number
): HexIconData => {
  const terrainType = config.hexData[nodeKey]?.terrainType;
  if (
    !config.showHexIcons ||
    terrainType === undefined ||
    terrainType === "none"
  ) {
    return undefined;
  }
  // The original icons paths were measured based on the default hex radius, so if that changed, we need to adjust the coordinates appropriately.
  const sizeMultitplier = config.hexRadius / DEFAULT_HEX_RADIUS;
  let counter = 0;
  const originalPathString = `${TERRAIN_ICON_PROPS_MAP[terrainType].d}`;

  // Find every coordinate in the path draw string, and update the value with the offset from the current hex column/row.
  const newPathString = originalPathString.replace(
    /(\d+)+/g,
    (match, number) => {
      const updatedCoordinate = `${(
        parseFloat(number) * sizeMultitplier +
        (counter % 2 === 0 ? columnOffset : rowOffset)
      ).toFixed(2)}`;
      counter++;
      return updatedCoordinate;
    }
  );
  return {
    ...TERRAIN_ICON_PROPS_MAP[terrainType],
    d: newPathString,
  };
};

/** Get the vector text data to draw a coordinates label within the provided vertices. */
export const prepareHexLabelData = (
  vertices: Vertices,
  columnIndex: number,
  rowIndex: number,
  hexRadius: number,
  labelFormat: LabelFormatOption,
  hexOrientation: HexOrientationOption
): HexLabelData => {
  let formattedLabelString = "";

  if (labelFormat === "none") {
    return {
      x: 0,
      y: 0,
      label: formattedLabelString,
    };
  }

  if (hexOrientation === "pointTop") {
    const letterRepititions = Math.ceil(
      (columnIndex + 1) / UPPER_ALPHA_INDICES.length
    );
    let alphaXString = "";
    for (let i = 0; i < letterRepititions; i++) {
      alphaXString += String.fromCharCode(
        UPPER_ALPHA_INDICES[columnIndex % UPPER_ALPHA_INDICES.length]
      );
    }
    if (labelFormat === "alphaX") {
      formattedLabelString = `${alphaXString}${rowIndex}`;
    } else if (labelFormat === "numbersOnly") {
      formattedLabelString = `${columnIndex},${rowIndex}`;
    }
    return {
      x: vertices[4][0] + hexRadius / 10,
      y: vertices[4][1] + hexRadius / 5,
      label: formattedLabelString,
    };
  } else {
    const letterRepititions = Math.ceil(
      ((columnIndex + 1) * 2) / UPPER_ALPHA_INDICES.length
    );
    let alphaXString = "";
    for (let i = 0; i < letterRepititions; i++) {
      alphaXString += String.fromCharCode(
        UPPER_ALPHA_INDICES[
          rowIndex % 2 === 0
            ? (columnIndex * 2) % UPPER_ALPHA_INDICES.length
            : (columnIndex * 2 + 1) % UPPER_ALPHA_INDICES.length
        ]
      );
    }
    if (labelFormat === "alphaX") {
      formattedLabelString = `${alphaXString}${Math.floor(rowIndex / 2)}`;
    } else if (labelFormat === "numbersOnly") {
      formattedLabelString = `${
        rowIndex % 2 === 0 ? columnIndex * 2 : columnIndex * 2 + 1
      },${Math.floor(rowIndex / 2)}`;
    }
    return {
      x: vertices[4][0] + hexRadius / 100,
      y: vertices[4][1] + hexRadius / 4,
      label: formattedLabelString,
    };
  }
};

/** Given a set of configurations, prepare the viewbox size for the hex map. */
export const prepareViewbox = (config: HexMapConfig) => {
  const { rowCount, columnCount, hexRadius, hexOrientation } = config;
  if (hexOrientation === "pointTop") {
    const columnOffset = hexRadius - hexRadius * Math.sin(ANGLE);
    const maxWidth =
      2 * columnCount * hexRadius -
      columnCount * 2 * columnOffset +
      columnOffset +
      (hexRadius - columnOffset) +
      1;
    const maxHeight = hexRadius / 2 + 1.5 * rowCount * hexRadius;
    return { maxWidth, maxHeight, viewBox: `0 0 ${maxWidth} ${maxHeight}` };
  } else {
    const rowOffset = hexRadius - hexRadius * Math.sin(ANGLE);
    const maxWidth = 3.25 * hexRadius * columnCount;
    const maxHeight =
      2 * hexRadius -
      2 * rowOffset +
      (rowCount - 1) * (hexRadius - rowOffset) +
      2;
    return { maxWidth, maxHeight, viewBox: `0 0 ${maxWidth} ${maxHeight}` };
  }
};

/** Get all vector data needed to output a hexmap. */
export const prepareVectorData = (
  config: HexMapConfig
): {
  paths: string[];
  icons: HexIconData[];
  labelData: HexLabelData[];
} => {
  const { rowCount, columnCount, hexRadius, labelFormat, hexOrientation } =
    config;

  const paths: string[] = [];
  const icons: HexIconData[] = [];
  const labelData: HexLabelData[] = [];

  let currentHexIndex = 0;

  for (let j = 0; j < rowCount; j++) {
    let columnOffset = 0;
    let rowOffset = 0;
    let xCoordinate = 0;
    let yCoordinate = 0;

    if (hexOrientation === "pointTop") {
      columnOffset = hexRadius - hexRadius * Math.sin(ANGLE);
      yCoordinate = hexRadius + 1.5 * j * hexRadius;
    } else {
      rowOffset = hexRadius - hexRadius * Math.sin(ANGLE);
      columnOffset = j % 2 !== 0 ? 1.5 * hexRadius : 0;
      yCoordinate = hexRadius * (j + 1) - (j + 1) * rowOffset;
    }
    for (let i = 0; i < columnCount; i++) {
      if (hexOrientation === "pointTop") {
        xCoordinate =
          hexRadius +
          2 * i * hexRadius -
          2 * i * columnOffset +
          (j % 2) * (hexRadius - columnOffset);
      } else {
        xCoordinate =
          columnOffset +
          hexRadius +
          hexRadius * i * 2 +
          hexRadius * Math.cos(ANGLE) * i * 2;
      }

      const vertices = prepareVertices(
        xCoordinate,
        yCoordinate,
        hexRadius,
        hexOrientation
      );
      const path = prepareHexPath(vertices);
      const icon =
        hexOrientation === "pointTop"
          ? prepareHexIcon(
              config,
              currentHexIndex,
              2 * i * hexRadius -
                2 * i * columnOffset +
                (j % 2) * (hexRadius - columnOffset),
              1.5 * j * hexRadius
            )
          : prepareHexIcon(
              config,
              currentHexIndex,
              columnOffset +
                hexRadius * i * 2 +
                hexRadius * Math.cos(ANGLE) * i * 2,
              hexRadius * (j + 1) - (j + 1) * rowOffset - hexRadius
            );
      const labelDataPoint = prepareHexLabelData(
        vertices,
        i,
        j,
        hexRadius,
        labelFormat,
        hexOrientation
      );

      paths.push(path);
      icons.push(icon);
      labelData.push(labelDataPoint);
      currentHexIndex++;
    }
  }

  return { paths, icons, labelData };
};

/** Given a particular hex and new color, set the color of each connected hex with the same original color. */
export const paintBucket = (
  config: HexMapConfig,
  setConfig: Dispatch<SetStateAction<HexMapConfig>>,
  hexKey: number
) => {
  const startNodeOriginalTerrain = config.hexData[hexKey]?.terrainType;
  const clearedNodes = new Set<number>();
  const nodesToClear = new Set<number>();

  const traverseHexTree = (currentNodeKey: number) => {
    clearedNodes.add(currentNodeKey);

    const columnStartIndex =
      Math.floor(currentNodeKey / config.columnCount) * config.columnCount;
    const columnEndIndex = columnStartIndex + config.columnCount - 1;

    const leftAdjacentNode = Math.max(currentNodeKey - 1, columnStartIndex);
    const rightAdjacentNode = Math.min(currentNodeKey + 1, columnEndIndex);

    const traversalTree: number[] = [leftAdjacentNode, rightAdjacentNode];

    const isEvenRow = Math.floor(currentNodeKey / config.columnCount) % 2 === 0;

    let topLeftNode: number | undefined = undefined;
    if (isEvenRow && currentNodeKey !== columnStartIndex) {
      topLeftNode = currentNodeKey - (config.columnCount + 1);
    } else if (!isEvenRow) {
      topLeftNode = currentNodeKey - config.columnCount;
    }
    if (topLeftNode !== undefined && topLeftNode >= 0) {
      traversalTree.push(topLeftNode);
    }

    let topRightNode: number | undefined = undefined;
    if (!isEvenRow && currentNodeKey !== columnEndIndex) {
      topRightNode = currentNodeKey - (config.columnCount - 1);
    } else if (isEvenRow) {
      topRightNode = currentNodeKey - config.columnCount;
    }
    if (topRightNode !== undefined && topRightNode >= 0) {
      traversalTree.push(topRightNode);
    }

    let bottomLeftNode: number | undefined = undefined;
    if (isEvenRow && currentNodeKey !== columnStartIndex) {
      bottomLeftNode = currentNodeKey + (config.columnCount - 1);
    } else if (!isEvenRow) {
      bottomLeftNode = currentNodeKey + config.columnCount;
    }
    if (
      bottomLeftNode !== undefined &&
      bottomLeftNode < config.columnCount * config.rowCount
    ) {
      traversalTree.push(bottomLeftNode);
    }

    let bottomRightNode: number | undefined = undefined;
    if (!isEvenRow && currentNodeKey !== columnEndIndex) {
      bottomRightNode = currentNodeKey + (config.columnCount + 1);
    } else if (isEvenRow) {
      bottomRightNode = currentNodeKey + config.columnCount;
    }
    if (
      bottomRightNode !== undefined &&
      bottomRightNode < config.columnCount * config.rowCount
    ) {
      traversalTree.push(bottomRightNode);
    }

    traversalTree.forEach((nodeKey) => {
      if (
        !clearedNodes.has(nodeKey) &&
        config.hexData[nodeKey]?.terrainType === startNodeOriginalTerrain &&
        config.hexData[nodeKey]?.terrainType !== config.terrainType
      ) {
        nodesToClear.add(nodeKey);
      }
    });
  };

  traverseHexTree(hexKey);

  while (nodesToClear.size > 0) {
    const [currentNodeKey] = nodesToClear;
    nodesToClear.delete(currentNodeKey);
    traverseHexTree(currentNodeKey);
  }

  const newFills: HexData = {};
  clearedNodes.forEach((node) => {
    newFills[node] = {
      ...config.hexData[node],
      terrainType: config.terrainType,
    };
  });

  setConfig({
    ...config,
    hexData: {
      ...config.hexData,
      ...newFills,
    },
  });
};
