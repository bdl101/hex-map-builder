import { Dispatch, SetStateAction } from "react";
import {
  CONFIG_STORAGE_KEY,
  DEFAULT_HEXMAP_CONFIG,
  HexMapConfig,
} from "../models";
import { updateConfigToLatestVersion } from "./migrations";

/** TODO */
export const handleConfigImport = (
  fileList: FileList | null,
  setConfig: Dispatch<SetStateAction<HexMapConfig>>
) => {
  if (fileList) {
    new Response(fileList[0]).json().then(
      (json) => {
        const config = updateConfigToLatestVersion({
          ...DEFAULT_HEXMAP_CONFIG,
          ...json,
        });
        setConfig(config);
        saveConfigToLocalStorage(config);
      },
      (err) => {
        alert("Invalid data format");
      }
    );
  }
};

/** TODO */
export const prepareConfigExportUrl = (config: HexMapConfig) => {
  URL.createObjectURL(
    new Blob([JSON.stringify(config)], {
      type: "application/json",
    })
  );
};

/** TODO */
export const saveConfigToLocalStorage = (config: HexMapConfig) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

/** TODO */
export const loadConfigFromLocalStorage = () => {
  const configString = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (configString) {
    const configFromStorage = JSON.parse(configString) as HexMapConfig;
    return updateConfigToLatestVersion(configFromStorage);
  }
  return DEFAULT_HEXMAP_CONFIG;
};

/** TODO */
export const clearConfigFromLocalStorage = (
  setConfig: Dispatch<SetStateAction<HexMapConfig>>
) => {
  if (window.confirm("Are you sure you want to clear your current map data?")) {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    setConfig(DEFAULT_HEXMAP_CONFIG);
  }
};
