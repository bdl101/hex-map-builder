import { CURRENT_CONFIG_SCHEMA_VERSION, HexMapConfig } from "../models";

/** TODO */
export const migrationTo01 = (config: Omit<HexMapConfig, "schemaVersion">) => {
  return {
    ...config,
    schemaVersion: "0.1",
  };
};

/** TODO */
export const updateConfigToLatestVersion = (currentConfig: HexMapConfig) => {
  let configCopy: HexMapConfig = JSON.parse(JSON.stringify(currentConfig));
  while (configCopy.schemaVersion !== CURRENT_CONFIG_SCHEMA_VERSION) {
    switch (configCopy.schemaVersion) {
      case undefined:
        configCopy = migrationTo01(configCopy);
        break;
      case "0.1":
      default:
        break;
    }
  }
  return configCopy;
};
