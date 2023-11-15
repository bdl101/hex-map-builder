import { HexMapConfig01 } from "../../models";

export const v01Config = {
  rowCount: 4,
  columnCount: 3,
  hexRadius: 50,
  terrainType: "none",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointTop",
  hexData: {
    "0": { terrainType: "desert" },
    "1": { terrainType: "desert" },
    "2": { terrainType: "desert" },
    "3": { terrainType: "desert" },
    "4": { terrainType: "water" },
    "5": { terrainType: "water" },
    "6": { terrainType: "water" },
    "7": { terrainType: "water" },
    "8": { terrainType: "mountains" },
    "9": { terrainType: "mountains" },
    "10": { terrainType: "mountains" },
    "11": { terrainType: "mountains" },
  },
  imageFormat: "contained",
  showHexIcons: false,
  useTerrainColors: true,
  schemaVersion: "0.1",
} as HexMapConfig01;
