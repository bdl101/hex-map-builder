import { Dispatch, SetStateAction } from "react";
import {
  CONFIG_STORAGE_KEY,
  DEFAULT_HEXMAP_CONFIG,
  HexMapConfig,
  HexStorage,
} from "../models";
import { updateConfigToLatestVersion } from "./migrations";
import { deepCopy } from "./deep-copy";

/** Save the provided config file into both local storage, and local state. */
export const handleConfigImport = (
  fileList: FileList | null,
  setConfig: Dispatch<SetStateAction<HexMapConfig>>
) => {
  if (fileList) {
    new Response(fileList[0]).json().then(
      (json) => {
        const config = updateConfigToLatestVersion(json);
        setConfig(config);
        saveConfigToLocalStorage(config);
      },
      (err) => {
        alert("Invalid data format");
      }
    );
  }
};

/** Prepare a download URL for the config as JSON. */
export const prepareConfigExportUrl = (config: HexMapConfig) => {
  return URL.createObjectURL(
    new Blob([JSON.stringify(config)], {
      type: "application/json",
    })
  );
};

/** Save the provided config object into local storage. */
export const saveConfigToLocalStorage = (config: HexMapConfig) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

/** Load the config stored in local storage. Ensure the config from storage uses the latest schema version before populating into local state. */
export const loadConfigFromLocalStorage = () => {
  const configString = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (configString) {
    const configFromStorage = JSON.parse(configString) as HexMapConfig;
    return updateConfigToLatestVersion(configFromStorage);
  }
  return DEFAULT_HEXMAP_CONFIG;
};

/** Clear any saved config values from local storage, and reset config values to the defaults. */
export const clearConfigFromLocalStorage = (
  setConfig: Dispatch<SetStateAction<HexMapConfig>>
) => {
  if (window.confirm("Are you sure you want to clear your current map data?")) {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    setConfig(DEFAULT_HEXMAP_CONFIG);
  }
};

// TODO: move this

/** Trim or expand the hex storage based on configuration changes to the row or column count. */
export const prepareHexStorage = (
  rowCount: number,
  columnCount: number,
  existingStorage: HexStorage
) => {
  let newStorage: HexStorage = deepCopy(existingStorage);
  if (rowCount < existingStorage.length) {
    newStorage = newStorage.slice(0, rowCount);
  } else if (rowCount > existingStorage.length) {
    for (let i = existingStorage.length; i < rowCount; i++) {
      const emptyColumns = Array(columnCount).fill({});
      newStorage.push(emptyColumns);
    }
  }

  newStorage.forEach((row, index) => {
    if (columnCount < row.length) {
      newStorage[index] = row.slice(0, columnCount);
    } else if (columnCount > row.length) {
      for (let i = row.length; i < columnCount; i++) {
        row.push({});
      }
    }
  });

  return newStorage;
};
