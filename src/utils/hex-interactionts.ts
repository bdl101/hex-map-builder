import { Dispatch, SetStateAction } from "react";
import { HexMapConfig } from "../models";
import { deepCopy } from "./deep-copy";
import { determineHexNeighbors } from "./hex-calculations";
import { saveConfigToLocalStorage } from "./storage";

/** Handle any press event on a single hex.  */
export const handleHexPress = ({
  hexKey,
  isPointerDown,
  setIsPointerDown,
  config,
  setConfig,
}: {
  hexKey: [number, number];
  isPointerDown: boolean;
  setIsPointerDown: Dispatch<SetStateAction<boolean>>;
  config: HexMapConfig;
  setConfig: Dispatch<SetStateAction<HexMapConfig>>;
}) => {
  if (!isPointerDown) {
    setIsPointerDown(true);
    if (config.paintType === "bucket") {
      const newConfig = paintBucket(config, hexKey);
      setConfig(newConfig);
      saveConfigToLocalStorage(newConfig);
    }
  }

  // TODO: maybe move this into graphics?
  if (
    config.paintType === "brush" &&
    config.hexStorage[hexKey[1]][hexKey[0]].terrainType !== config.terrainType
  ) {
    const newHexStorage = deepCopy(config.hexStorage);
    newHexStorage[hexKey[1]][hexKey[0]].terrainType = config.terrainType;
    const newConfig = {
      ...config,
      hexStorage: newHexStorage,
    };

    setConfig(newConfig);
    saveConfigToLocalStorage(newConfig);
  }
};

/** Handle and drag event on a single hex. Only fires if the user is already pressing down. */
export const handleHexDrag = ({
  hexKey,
  isPointerDown,
  config,
  setConfig,
}: {
  hexKey: [number, number];
  isPointerDown: boolean;
  config: HexMapConfig;
  setConfig: Dispatch<SetStateAction<HexMapConfig>>;
}) => {
  if (
    isPointerDown &&
    config.hexStorage[hexKey[1]][hexKey[0]].terrainType !==
      config.terrainType &&
    config.paintType === "brush"
  ) {
    const newHexStorage = deepCopy(config.hexStorage);
    newHexStorage[hexKey[1]][hexKey[0]].terrainType = config.terrainType;
    const newConfig = {
      ...config,
      hexStorage: newHexStorage,
    };

    setConfig(newConfig);
    saveConfigToLocalStorage(newConfig);
  }
};

/** Given a particular hex and new color, set the color of each connected hex with the same original color. */
export const paintBucket = (config: HexMapConfig, hexKey: [number, number]) => {
  const startNodeOriginalTerrain =
    config.hexStorage[hexKey[1]][hexKey[0]].terrainType;
  const clearedNodes = new Set<string>();
  const nodesToClear = new Set<string>();

  const traverseHexTree = (currentNodeKey: string) => {
    clearedNodes.add(currentNodeKey);

    const currentNodeHexKey = JSON.parse(currentNodeKey) as [number, number];
    const traversalTree: string[] = determineHexNeighbors({
      columnIndex: currentNodeHexKey[0],
      rowIndex: currentNodeHexKey[1],
      orientation: config.hexOrientation,
      rowLength: config.rowCount,
      columnLength: config.columnCount,
    }).map((hexKey) => JSON.stringify(hexKey));

    traversalTree.forEach((nodeKey) => {
      const nodeHexKey = JSON.parse(nodeKey) as [number, number];
      const nodeTerrain =
        config.hexStorage[nodeHexKey[1]][nodeHexKey[0]].terrainType;
      if (
        !clearedNodes.has(nodeKey) &&
        nodeTerrain === startNodeOriginalTerrain &&
        nodeTerrain !== config.terrainType
      ) {
        nodesToClear.add(nodeKey);
      }
    });
  };

  traverseHexTree(JSON.stringify(hexKey));

  while (nodesToClear.size > 0) {
    const [currentNodeKey] = nodesToClear;
    nodesToClear.delete(currentNodeKey);
    traverseHexTree(currentNodeKey);
  }

  const newHexStorage = deepCopy(config.hexStorage);

  clearedNodes.forEach((nodeKey) => {
    const nodeHexKey = JSON.parse(nodeKey) as [number, number];
    newHexStorage[nodeHexKey[1]][nodeHexKey[0]].terrainType =
      config.terrainType;
  });

  return {
    ...config,
    hexStorage: newHexStorage,
  };
};
