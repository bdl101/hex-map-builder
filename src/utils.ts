import {
  Vertices,
  HexLabelData,
  HexMapConfig,
  LabelFormatOption,
} from "./models";
import { ANGLE, UPPER_ALPHA_INDICES } from "./constants";

/** Get the vertices for a hexagon centered at origin point x,y. The distance between any 2 vertices of the hexagon is 2r. */
const prepareVertices = (x: number, y: number, r: number) => {
  const vertices: Vertices = [];
  for (var i = 0; i < 6; i++) {
    const xCoordinate = x + r * Math.sin(ANGLE * i);
    const yCoordinate = y + r * Math.cos(ANGLE * i);
    vertices.push([xCoordinate, yCoordinate]);
  }
  return vertices;
};

/** Get the vector path data to draw a hexagon with the provided vertices. */
const preparePath = (vertices: Vertices) => {
  return vertices.reduce((accumulator, currentValue, index) => {
    accumulator +=
      index === vertices.length - 1
        ? ` Z`
        : ` L ${currentValue[0]} ${currentValue[1]}`;
    return accumulator;
  }, `M ${vertices[5][0]} ${vertices[5][1]} `);
};

/** Get the vector text data to draw a coordinates label within the provided vertices. */
const prepareHexLabelData = (
  vertices: Vertices,
  columnIndex: number,
  rowIndex: number,
  hexRadius: number,
  labelFormat: LabelFormatOption
): HexLabelData => {
  const letterRepititions = Math.ceil(
    (columnIndex + 1) / UPPER_ALPHA_INDICES.length
  );
  let alphaXString = "";
  for (let i = 0; i < letterRepititions; i++) {
    alphaXString += String.fromCharCode(
      UPPER_ALPHA_INDICES[columnIndex % UPPER_ALPHA_INDICES.length]
    );
  }

  let formattedLabelString = "";

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
};

/** Given a set of configurations, prepare the viewbox size for the hex map. */
export const prepareViewbox = (config: HexMapConfig) => {
  const { rowCount, columnCount, hexRadius } = config;
  const columnOffset = hexRadius - hexRadius * Math.sin(ANGLE);
  const maxWidth =
    2 * columnCount * hexRadius -
    columnCount * 2 * columnOffset +
    columnOffset +
    (hexRadius - columnOffset) +
    1;
  const maxHeight = hexRadius / 2 + 1.5 * rowCount * hexRadius;
  return { maxWidth, maxHeight, viewBox: `0 0 ${maxWidth} ${maxHeight}` };
};

/** Get all vector data needed to output a hexmap. */
export const prepareVectorData = (
  config: HexMapConfig
): { paths: string[]; labelData: HexLabelData[] } => {
  const { rowCount, columnCount, hexRadius, labelFormat } = config;

  const paths: string[] = [];
  const labelData: HexLabelData[] = [];
  for (let j = 0; j < rowCount; j++) {
    const columnOffset = hexRadius - hexRadius * Math.sin(ANGLE);
    const yCoordinate = hexRadius + 1.5 * j * hexRadius;
    for (let i = 0; i < columnCount; i++) {
      const xCoordinate =
        hexRadius +
        2 * i * hexRadius -
        2 * i * columnOffset +
        (j % 2) * (hexRadius - columnOffset);
      const vertices = prepareVertices(xCoordinate, yCoordinate, hexRadius);
      const path = preparePath(vertices);
      const labelDataPoint = prepareHexLabelData(
        vertices,
        i,
        j,
        hexRadius,
        labelFormat
      );
      paths.push(path);
      labelData.push(labelDataPoint);
    }
  }

  return { paths, labelData };
};
