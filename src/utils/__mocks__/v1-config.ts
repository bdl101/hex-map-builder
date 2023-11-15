import { HexMapConfig } from "../../models";

export const v1Config = {
  rowCount: 4,
  columnCount: 3,
  hexRadius: 50,
  terrainType: "none",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointedTopOddRow",
  hexStorage: [
    [
      { terrainType: "desert" },
      { terrainType: "desert" },
      { terrainType: "desert" },
    ],
    [
      { terrainType: "desert" },
      { terrainType: "water" },
      { terrainType: "water" },
    ],
    [
      { terrainType: "water" },
      { terrainType: "water" },
      { terrainType: "mountains" },
    ],
    [
      { terrainType: "mountains" },
      { terrainType: "mountains" },
      { terrainType: "mountains" },
    ],
  ],
  imageFormat: "contained",
  showHexIcons: false,
  useTerrainColors: true,
  schemaVersion: "1",
} as HexMapConfig;
