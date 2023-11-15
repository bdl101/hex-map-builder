import { Dispatch, SetStateAction } from "react";
import { paintBucket } from "./graphics";
import { HexMapConfig } from "../models";

/** TODO */
export const handleHexPress = ({
  hexKey,
  isPointerDown,
  setIsPointerDown,
  config,
  setConfig,
}: {
  hexKey: number;
  isPointerDown: boolean;
  setIsPointerDown: Dispatch<SetStateAction<boolean>>;
  config: HexMapConfig;
  setConfig: Dispatch<SetStateAction<HexMapConfig>>;
}) => {
  if (!isPointerDown) {
    setIsPointerDown(true);
    if (config.paintType === "bucket") {
      paintBucket(config, setConfig, hexKey);
    }
  }

  // TODO: maybe move this into graphics?
  /* if (
    config.paintType === "brush" &&
    config.hexData[hexKey]?.terrainType !== config.terrainType
  ) {
    setConfig({
      ...config,
      hexData: {
        ...config.hexData,
        [hexKey]: { terrainType: config.terrainType },
      },
    });
  } */
};

/** TODO */
export const handleHexDrag = ({
  hexKey,
  isPointerDown,
  config,
  setConfig,
}: {
  hexKey: number;
  isPointerDown: boolean;
  config: HexMapConfig;
  setConfig: Dispatch<SetStateAction<HexMapConfig>>;
}) => {
  /* if (
    isPointerDown &&
    config.hexData[hexKey]?.terrainType !== config.terrainType &&
    config.paintType === "brush"
  ) {
    setConfig({
      ...config,
      hexData: {
        ...config.hexData,
        [hexKey]: { terrainType: config.terrainType },
      },
    });
  } */
};
