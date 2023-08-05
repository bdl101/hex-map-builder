import { useMemo, useState } from "react";
import {
  InputContainer,
  MainContainer,
  MapContainer,
  Controls,
} from "./App.styles";

const ANGLE = (2 * Math.PI) / 6;
const DEFAULT_ROW_COUNT = 3;
const DEFAULT_COLUMN_COUNT = 4;
const DEFAULT_HEX_RADIUS = 50;

// [A-Z]
const UPPER_ALPHA_INDICES = Array.from(Array(26)).map((e, i) => i + 65);

interface HexMapConfig {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
}

interface HexLabelData {
  x: number;
  y: number;
  label: string;
}

type ConfigKey = keyof HexMapConfig;

type Vertices = Array<[number, number]>;

/** Get the vertices for a hexagon centered at origin point x,y. The distance between any 2 vertices of the hexagon is 2r. */
const getVertices = (x: number, y: number, r: number) => {
  const vertices: Vertices = [];
  for (var i = 0; i < 6; i++) {
    const xCoordinate = x + r * Math.sin(ANGLE * i);
    const yCoordinate = y + r * Math.cos(ANGLE * i);
    vertices.push([xCoordinate, yCoordinate]);
  }
  return vertices;
};

const getSinglePath = (vertices: Vertices) => {
  return vertices.reduce((accumulator, currentValue, index) => {
    accumulator +=
      index === vertices.length - 1
        ? ` Z`
        : ` L ${currentValue[0]} ${currentValue[1]}`;
    return accumulator;
  }, `M ${vertices[5][0]} ${vertices[5][1]} `);
};

const prepareHexLabelData = (
  vertices: Vertices,
  columnIndex: number,
  rowIndex: number,
  hexRadius: number
): HexLabelData => {
  // TODO: letter as x coordinate
  return {
    x: vertices[4][0] + hexRadius / 10,
    y: vertices[4][1] + hexRadius / 5,
    label: `${columnIndex},${rowIndex}`,
  };
};

const getVectorPaths = (
  columnCount: number,
  rowCount: number,
  hexagonRadius: number
): { paths: string[]; labelData: HexLabelData[] } => {
  const paths: string[] = [];
  const labelData: HexLabelData[] = [];
  for (let j = 0; j < rowCount; j++) {
    const columnOffset = hexagonRadius - hexagonRadius * Math.sin(ANGLE);
    const yCoordinate = hexagonRadius + 1.5 * j * hexagonRadius;
    for (let i = 0; i < columnCount; i++) {
      const xCoordinate =
        hexagonRadius +
        2 * i * hexagonRadius -
        2 * i * columnOffset +
        (j % 2) * (hexagonRadius - columnOffset);
      const vertices = getVertices(xCoordinate, yCoordinate, hexagonRadius);
      const path = getSinglePath(vertices);
      const labelDataPoint = prepareHexLabelData(vertices, i, j, hexagonRadius);
      paths.push(path);
      labelData.push(labelDataPoint);
    }
  }

  return { paths, labelData };
};

const App = () => {
  const [config, setConfig] = useState<HexMapConfig>({
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    hexRadius: DEFAULT_HEX_RADIUS,
  });

  const handleConfigChange = (configKey: ConfigKey, newValue: string) => {
    setConfig({ ...config, [configKey]: Number(newValue) });
  };

  const { paths, labelData } = useMemo(() => {
    return getVectorPaths(
      config.columnCount,
      config.rowCount,
      config.hexRadius
    );
  }, [config]);

  const mapViewBox = useMemo(() => {
    const { rowCount, columnCount, hexRadius } = config;
    const columnOffset = hexRadius - hexRadius * Math.sin(ANGLE);
    const maxWidth =
      2 * columnCount * hexRadius -
      columnCount * 2 * columnOffset +
      columnOffset +
      (hexRadius - columnOffset) +
      1;
    const maxHeight = hexRadius / 2 + 1.5 * rowCount * hexRadius;
    return `0 0 ${maxWidth} ${maxHeight}`;
  }, [config]);

  // TODO: control for label style: number, letter as xcoord, none
  // TODO: controls for hex orientation: 'flat-top'| 'point-top'

  return (
    <MainContainer>
      <Controls>
        <InputContainer>
          <label htmlFor="row-controls">Rows</label>
          <input
            id="row-controls"
            type="number"
            placeholder="3"
            min={2}
            value={config.rowCount}
            onChange={(e) => {
              handleConfigChange("rowCount", e.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="column-controls">Columns</label>
          <input
            id="column-controls"
            type="number"
            placeholder="4"
            min={2}
            value={config.columnCount}
            onChange={(e) => {
              handleConfigChange("columnCount", e.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="radius-controls">Hexagon Radius</label>
          <input
            id="radius-controls"
            type="number"
            placeholder="50"
            min={1}
            value={config.hexRadius}
            onChange={(e) => {
              handleConfigChange("hexRadius", e.target.value);
            }}
          />
        </InputContainer>
      </Controls>
      <MapContainer>
        <svg viewBox={mapViewBox}>
          {paths.map((path, index) => (
            <g key={index}>
              <path d={path} fill="#aaa" stroke="#000" strokeWidth="1" />
              <text x={labelData[index].x} y={labelData[index].y}>
                {labelData[index].label}
              </text>
            </g>
          ))}
        </svg>
      </MapContainer>
    </MainContainer>
  );
};

export default App;
