import { Dispatch, SetStateAction } from "react";
import { HexMapConfig } from "../models";
import { deepCopy } from "./deep-copy";

/** TODO */
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
    /* if (config.paintType === "bucket") {
      paintBucket(config, setConfig, hexKey);
    } */
  }

  // TODO: maybe move this into graphics?
  if (
    config.paintType === "brush" &&
    config.hexStorage[hexKey[1]][hexKey[0]].terrainType !== config.terrainType
  ) {
    const newHexStorage = deepCopy(config.hexStorage);
    newHexStorage[hexKey[1]][hexKey[0]].terrainType = config.terrainType;

    setConfig({
      ...config,
      hexStorage: newHexStorage,
    });
  }
};

/** TODO */
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

    setConfig({
      ...config,
      hexStorage: newHexStorage,
    });
  }
};

/** Given a particular hex and new color, set the color of each connected hex with the same original color. */
export const paintBucket = (
  config: HexMapConfig,
  setConfig: Dispatch<SetStateAction<HexMapConfig>>,
  hexKey: number
) => {
  // TODO
  /* const startNodeOriginalTerrain = config.hexData[hexKey]?.terrainType;
  const clearedNodes = new Set<number>();
  const nodesToClear = new Set<number>();

  const traverseHexTree = (currentNodeKey: number) => {
    clearedNodes.add(currentNodeKey);

    const columnStartIndex =
      Math.floor(currentNodeKey / config.columnCount) * config.columnCount;
    const columnEndIndex = columnStartIndex + config.columnCount - 1;

    const leftAdjacentNode = Math.max(currentNodeKey - 1, columnStartIndex);
    const rightAdjacentNode = Math.min(currentNodeKey + 1, columnEndIndex);

    const traversalTree: number[] = [leftAdjacentNode, rightAdjacentNode];

    const isEvenRow = Math.floor(currentNodeKey / config.columnCount) % 2 === 0;

    let topLeftNode: number | undefined = undefined;
    if (isEvenRow && currentNodeKey !== columnStartIndex) {
      topLeftNode = currentNodeKey - (config.columnCount + 1);
    } else if (!isEvenRow) {
      topLeftNode = currentNodeKey - config.columnCount;
    }
    if (topLeftNode !== undefined && topLeftNode >= 0) {
      traversalTree.push(topLeftNode);
    }

    let topRightNode: number | undefined = undefined;
    if (!isEvenRow && currentNodeKey !== columnEndIndex) {
      topRightNode = currentNodeKey - (config.columnCount - 1);
    } else if (isEvenRow) {
      topRightNode = currentNodeKey - config.columnCount;
    }
    if (topRightNode !== undefined && topRightNode >= 0) {
      traversalTree.push(topRightNode);
    }

    let bottomLeftNode: number | undefined = undefined;
    if (isEvenRow && currentNodeKey !== columnStartIndex) {
      bottomLeftNode = currentNodeKey + (config.columnCount - 1);
    } else if (!isEvenRow) {
      bottomLeftNode = currentNodeKey + config.columnCount;
    }
    if (
      bottomLeftNode !== undefined &&
      bottomLeftNode < config.columnCount * config.rowCount
    ) {
      traversalTree.push(bottomLeftNode);
    }

    let bottomRightNode: number | undefined = undefined;
    if (!isEvenRow && currentNodeKey !== columnEndIndex) {
      bottomRightNode = currentNodeKey + (config.columnCount + 1);
    } else if (isEvenRow) {
      bottomRightNode = currentNodeKey + config.columnCount;
    }
    if (
      bottomRightNode !== undefined &&
      bottomRightNode < config.columnCount * config.rowCount
    ) {
      traversalTree.push(bottomRightNode);
    }

    traversalTree.forEach((nodeKey) => {
      if (
        !clearedNodes.has(nodeKey) &&
        config.hexData[nodeKey]?.terrainType === startNodeOriginalTerrain &&
        config.hexData[nodeKey]?.terrainType !== config.terrainType
      ) {
        nodesToClear.add(nodeKey);
      }
    });
  };

  traverseHexTree(hexKey);

  while (nodesToClear.size > 0) {
    const [currentNodeKey] = nodesToClear;
    nodesToClear.delete(currentNodeKey);
    traverseHexTree(currentNodeKey);
  }

  const newFills: HexData = {};
  clearedNodes.forEach((node) => {
    newFills[node] = {
      ...config.hexData[node],
      terrainType: config.terrainType,
    };
  });

  setConfig({
    ...config,
    hexData: {
      ...config.hexData,
      ...newFills,
    },
  }); */
};
