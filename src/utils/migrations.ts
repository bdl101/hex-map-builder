import {
  CURRENT_CONFIG_SCHEMA_VERSION,
  HexMapConfig,
  HexMapConfig0,
  HexMapConfig01,
  HexStorage,
} from "../models";
import { deepCopy } from "./deep-copy";

/** TODO */
export const migrationToVersion01 = (config: HexMapConfig0): HexMapConfig01 => {
  return {
    ...config,
    schemaVersion: "0.1",
  };
};

/** TODO */
export const migrationToVersion1 = (config: HexMapConfig0): HexMapConfig => {
  const { hexOrientation, hexData, ...rest } = config;

  const newHexStorage: HexStorage = [];
  Object.values(hexData).forEach((hex, index) => {
    const newRowIndex = Math.floor(index / rest.columnCount);
    const newColumnIndex = index % rest.columnCount;

    if (!newHexStorage[newRowIndex]) {
      newHexStorage.push([]);
    }

    if (!newHexStorage[newRowIndex][newColumnIndex]) {
      newHexStorage[newRowIndex].push({});
    }

    newHexStorage[newRowIndex][newColumnIndex].terrainType = hex?.terrainType;
  });

  return {
    ...rest,
    hexOrientation:
      hexOrientation === "pointTop" ? "pointedTopOddRow" : "flatTopOddColumn",
    hexStorage: newHexStorage,
    schemaVersion: "1",
  };
};

/** TODO */
export const updateConfigToLatestVersion = (
  currentConfig: HexMapConfig0 | HexMapConfig01 | HexMapConfig
) => {
  let configCopy: any = deepCopy(currentConfig);
  while (configCopy.schemaVersion !== CURRENT_CONFIG_SCHEMA_VERSION) {
    switch (configCopy.schemaVersion) {
      case undefined:
        configCopy = migrationToVersion01(configCopy);
        break;
      case "0.1":
        configCopy = migrationToVersion1(configCopy);
        break;
      case "1":
      default:
        break;
    }
  }
  return configCopy;
};
