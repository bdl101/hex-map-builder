import {
  Vertices,
  HexOrientation,
  PointedTopsDirection,
  FlatTopsDirection,
  DEFAULT_HEX_RADIUS,
  DEFAULT_LABEL_FONT_SIZE,
} from "../models";
import { ANGLE } from "../models";

/** Get the vertices for a hexagon centered at origin point x,y. The distance between any 2 vertices of the hexagon is 2r. */
export const prepareVertices = (
  x: number,
  y: number,
  r: number,
  orientation: HexOrientation
) => {
  const vertices: Vertices = [];
  for (var i = 0; i < 6; i++) {
    if (
      orientation === "pointedTopOddRow" ||
      orientation === "pointedTopEvenRow"
    ) {
      const xCoordinate = x + r * Math.sin(ANGLE * i);
      const yCoordinate = y + r * Math.cos(ANGLE * i);
      vertices.push([xCoordinate, yCoordinate]);
    } else {
      const xCoordinate = x + r * Math.cos(ANGLE * i);
      const yCoordinate = y + r * Math.sin(ANGLE * i);
      vertices.push([xCoordinate, yCoordinate]);
    }
  }
  return vertices;
};

/** Given a particular row, column, hex radius, and hex orientation, determine the origin point (center x,y) for a hex. */
export const prepareHexOrigin = (
  columnIndex: number,
  rowIndex: number,
  hexRadius: number,
  orientation: HexOrientation
) => {
  const isEvenRow = rowIndex % 2 === 0;
  const isEvenColumn = columnIndex % 2 === 0;

  const hexInnerWidth = Math.sqrt(3) * hexRadius;

  let xCoordinate = 0;
  let yCoordinate = 0;

  if (orientation === "pointedTopOddRow") {
    if (isEvenRow) {
      xCoordinate = hexInnerWidth / 2 + columnIndex * hexInnerWidth;
    } else {
      xCoordinate = hexInnerWidth * (columnIndex + 1);
    }
    yCoordinate = hexRadius + rowIndex * hexRadius * 1.5;
  } else if (orientation === "pointedTopEvenRow") {
    if (isEvenRow) {
      xCoordinate = hexInnerWidth * (columnIndex + 1);
    } else {
      xCoordinate = hexInnerWidth / 2 + columnIndex * hexInnerWidth;
    }
    yCoordinate = hexRadius + rowIndex * hexRadius * 1.5;
  } else if (orientation === "flatTopOddColumn") {
    if (isEvenColumn) {
      yCoordinate = hexInnerWidth / 2 + rowIndex * hexInnerWidth;
    } else {
      yCoordinate = hexInnerWidth * (rowIndex + 1);
    }
    xCoordinate = hexRadius + columnIndex * hexRadius * 1.5;
  } else if (orientation === "flatTopEvenColumn") {
    if (isEvenColumn) {
      yCoordinate = hexInnerWidth * (rowIndex + 1);
    } else {
      yCoordinate = hexInnerWidth / 2 + rowIndex * hexInnerWidth;
    }
    xCoordinate = hexRadius + columnIndex * hexRadius * 1.5;
  }

  return {
    xCoordinate: Math.round(xCoordinate),
    yCoordinate: Math.round(yCoordinate),
  };
};

/** Determine the coordinates of the immediate neighbor for a pointed top hex in the specified direction. */
const determinePointedTopEvenRowNeighbor = (
  columnIndex: number,
  rowIndex: number,
  direction: PointedTopsDirection
): [number, number] => {
  const evenRowDirectionDifferences: [
    Record<PointedTopsDirection, [number, number]>,
    Record<PointedTopsDirection, [number, number]>
  ] = [
    // even rows
    {
      northWest: [0, -1],
      northEast: [1, -1],
      west: [-1, 0],
      east: [1, 0],
      southWest: [0, 1],
      southEast: [1, 1],
    },
    // odd rows
    {
      northWest: [-1, -1],
      northEast: [0, -1],
      west: [-1, 0],
      east: [1, 0],
      southWest: [-1, 1],
      southEast: [0, 1],
    },
  ];

  const parity = rowIndex & 1;
  var diff = evenRowDirectionDifferences[parity][direction];
  return [columnIndex + diff[0], rowIndex + diff[1]];
};

/** Determine the coordinates of the immediate neighbor for a pointed top hex in the specified direction. */
const determinePointedTopOddRowNeighbor = (
  columnIndex: number,
  rowIndex: number,
  direction: PointedTopsDirection
): [number, number] => {
  const oddRowDirectionDifferences: [
    Record<PointedTopsDirection, [number, number]>,
    Record<PointedTopsDirection, [number, number]>
  ] = [
    // even rows
    {
      northWest: [-1, -1],
      northEast: [0, -1],
      west: [-1, 0],
      east: [1, 0],
      southWest: [-1, 1],
      southEast: [0, 1],
    },
    // odd rows
    {
      northWest: [0, -1],
      northEast: [1, -1],
      west: [-1, 0],
      east: [1, 0],
      southWest: [0, 1],
      southEast: [1, 1],
    },
  ];

  const parity = rowIndex & 1;
  var diff = oddRowDirectionDifferences[parity][direction];
  return [columnIndex + diff[0], rowIndex + diff[1]];
};

/** Determine the coordinates of the immediate neighbor for a flat top hex in the specified direction. */
const determineFlatTopEvenRowNeighbor = (
  columnIndex: number,
  rowIndex: number,
  direction: FlatTopsDirection
): [number, number] => {
  const evenColumnDirectionDifferences: [
    Record<FlatTopsDirection, [number, number]>,
    Record<FlatTopsDirection, [number, number]>
  ] = [
    // even cols
    {
      northWest: [-1, 0],
      north: [0, -1],
      northEast: [1, 0],
      southEast: [1, 1],
      south: [0, 1],
      southWest: [-1, 1],
    },
    // odd cols
    {
      northWest: [-1, -1],
      north: [0, -1],
      northEast: [1, -1],
      southEast: [1, 0],
      south: [0, 1],
      southWest: [-1, 0],
    },
  ];

  const parity = columnIndex & 1;
  var diff = evenColumnDirectionDifferences[parity][direction];
  return [columnIndex + diff[0], rowIndex + diff[1]];
};

/** Determine the coordinates of the immediate neighbor for a flat top hex in the specified direction. */
const determineFlatTopOddRowNeighbor = (
  columnIndex: number,
  rowIndex: number,
  direction: FlatTopsDirection
): [number, number] => {
  const oddColumnDirectionDifferences: [
    Record<FlatTopsDirection, [number, number]>,
    Record<FlatTopsDirection, [number, number]>
  ] = [
    // even cols
    {
      northWest: [-1, -1],
      north: [0, -1],
      northEast: [1, -1],
      southEast: [1, 0],
      south: [0, 1],
      southWest: [-1, 0],
    },
    // odd cols
    {
      northWest: [-1, 0],
      north: [0, -1],
      northEast: [1, 0],
      southEast: [1, 1],
      south: [0, 1],
      southWest: [-1, 1],
    },
  ];

  const parity = columnIndex & 1;
  var diff = oddColumnDirectionDifferences[parity][direction];
  return [columnIndex + diff[0], rowIndex + diff[1]];
};

/** Given the row and column index of a particular hex, and the orientation of the hex, determine the row and column indices of an immediate neighbor hex in the specified direction. */
export const determineHexNeighborCoordinates = ({
  columnIndex,
  rowIndex,
  orientation,
  direction,
}: {
  columnIndex: number;
  rowIndex: number;
  orientation: HexOrientation;
  direction: PointedTopsDirection | FlatTopsDirection;
}) => {
  switch (orientation) {
    case "pointedTopEvenRow":
      return determinePointedTopEvenRowNeighbor(
        columnIndex,
        rowIndex,
        direction as PointedTopsDirection
      );
    case "pointedTopOddRow":
      return determinePointedTopOddRowNeighbor(
        columnIndex,
        rowIndex,
        direction as PointedTopsDirection
      );
    case "flatTopEvenColumn":
      return determineFlatTopEvenRowNeighbor(
        columnIndex,
        rowIndex,
        direction as FlatTopsDirection
      );
    case "flatTopOddColumn":
      return determineFlatTopOddRowNeighbor(
        columnIndex,
        rowIndex,
        direction as FlatTopsDirection
      );
  }
};

/** Given a particular hex, determine the coordinates of all of its immediate neighbors. */
export const determineHexNeighbors = ({
  columnIndex,
  rowIndex,
  orientation,
  rowLength,
  columnLength,
}: {
  columnIndex: number;
  rowIndex: number;
  orientation: HexOrientation;
  rowLength: number;
  columnLength: number;
}) => {
  const neighbors: Array<[number, number]> = [];

  const directions =
    orientation === "pointedTopEvenRow" || orientation === "pointedTopOddRow"
      ? ([
          "northWest",
          "northEast",
          "west",
          "east",
          "southWest",
          "southEast",
        ] as PointedTopsDirection[])
      : ([
          "northWest",
          "north",
          "northEast",
          "southEast",
          "south",
          "southWest",
        ] as FlatTopsDirection[]);

  directions.forEach((direction) => {
    const [neighborColumnIndex, neighborRowIndex] =
      determineHexNeighborCoordinates({
        columnIndex,
        rowIndex,
        orientation,
        direction,
      });

    // exclude neighbors that are out of bounds
    if (
      neighborColumnIndex >= 0 &&
      neighborColumnIndex < columnLength &&
      neighborRowIndex >= 0 &&
      neighborRowIndex < rowLength
    ) {
      neighbors.push([neighborColumnIndex, neighborRowIndex]);
    }
  });

  return neighbors;
};

/** Given the outer radius of a hex (center to outer point), determine the inner diameter of said hex (flat side to flat side). */
export const determineHexInnerDiameter = (hexRadius: number) => {
  return Math.sqrt(3) * hexRadius;
};

/** Given a specified hex radius, determine a ratio modifier that can be used to size/scale other hex items as need be. */
export const determineRadiusRatioModifier = (hexRadius: number) => {
  return hexRadius / DEFAULT_HEX_RADIUS;
};

/** Given a provided scale mod ratio, determine the font size for a hex label based on the default font size. */
export const determineLabelFontSizeByRatio = (ratio: number) => {
  return Math.round(DEFAULT_LABEL_FONT_SIZE * ratio);
};
