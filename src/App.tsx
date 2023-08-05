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

const getVectorPaths = (
  columnCount: number,
  rowCount: number,
  hexagonRadius: number
): string[] => {
  const paths: string[] = [];
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
      paths.push(path);
    }
  }

  return paths;
};

interface HexMapConfig {
  rowCount: number;
  columnCount: number;
  hexRadius: number;
}

type ConfigKey = keyof HexMapConfig;

const App = () => {
  const [config, setConfig] = useState<HexMapConfig>({
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    hexRadius: DEFAULT_HEX_RADIUS,
  });

  const handleConfigChange = (configKey: ConfigKey, newValue: number) => {
    setConfig({ ...config, [configKey]: newValue });
  };

  const paths = useMemo(() => {
    return getVectorPaths(
      config.columnCount,
      config.rowCount,
      config.hexRadius
    );
  }, [config]);

  return (
    <MainContainer>
      <Controls>
        <InputContainer>
          <label htmlFor="row-controls">Rows</label>
          <input
            id="row-controls"
            type="number"
            placeholder="3"
            min={1}
            value={config.rowCount}
            onChange={(e) => {
              console.log(e.target.value);
              // handleConfigChange('rowCount', (e.target.value))
            }}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="column-controls">Columns</label>
          <input
            id="column-controls"
            type="number"
            placeholder="4"
            min={1}
            value={config.columnCount}
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
          />
        </InputContainer>
      </Controls>
      <MapContainer>
        <svg viewBox="0 0 400 400">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path}
              fill="#666"
              stroke="white"
              strokeWidth="1"
            />
          ))}
          <text x="6" y="74">
            Start
          </text>
        </svg>
      </MapContainer>
    </MainContainer>
  );
};

export default App;
