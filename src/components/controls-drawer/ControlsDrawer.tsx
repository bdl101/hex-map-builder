import { FC, RefObject, Dispatch, SetStateAction } from "react";

import {
  HexMapConfig,
  HexOrientationOption,
  ImageFormatOption,
  LabelFormatOption,
  PaintType,
  Terrain,
  TERRAIN_HEX_COLOR_MAP,
} from "../../models";

import {
  ControlsDrawerContainer,
  ControlsDrawerSection,
  ControlWrapper,
} from "./ControlsDrawer.styles";
import {
  clearConfigFromLocalStorage,
  handleConfigImport,
  handleConvertToPNG,
  handleConvertToSVG,
} from "../../utils";

interface ControlsDrawerProps {
  isControlDrawerOpen: boolean;
  config: HexMapConfig;
  handleConfigChange: <K extends keyof HexMapConfig>(
    configKey: K,
    newValue: HexMapConfig[K]
  ) => void;
  hexMapRef: RefObject<SVGSVGElement>;
  setConfig: Dispatch<SetStateAction<HexMapConfig>>;
  mapMaxWidth: number;
  mapMaxHeight: number;
}

/** TODO */
export const ControlsDrawer: FC<ControlsDrawerProps> = ({
  config,
  handleConfigChange,
  hexMapRef,
  isControlDrawerOpen,
  mapMaxHeight,
  mapMaxWidth,
  setConfig,
}) => {
  return (
    <ControlsDrawerContainer isVisible={isControlDrawerOpen}>
      <ControlsDrawerSection>
        <h2>Configure Map</h2>
        <ControlWrapper>
          <label htmlFor="row-controls">Rows</label>
          <input
            id="row-controls"
            type="number"
            placeholder="3"
            min={2}
            value={config.rowCount}
            onChange={(e) => {
              handleConfigChange("rowCount", Number(e.target.value));
            }}
          />
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="column-controls">Columns</label>
          <input
            id="column-controls"
            type="number"
            placeholder="4"
            min={2}
            value={config.columnCount}
            onChange={(e) => {
              handleConfigChange("columnCount", Number(e.target.value));
            }}
          />
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="radius-controls">Hexagon Radius</label>
          <input
            id="radius-controls"
            type="number"
            placeholder="50"
            min={1}
            value={config.hexRadius}
            onChange={(e) => {
              handleConfigChange("hexRadius", Number(e.target.value));
            }}
          />
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="hex-orientation-controls">Hexagon Orientation</label>
          <select
            id="hex-orientation-controls"
            value={config.hexOrientation}
            onChange={(e) => {
              handleConfigChange(
                "hexOrientation",
                e.target.value as HexOrientationOption
              );
            }}
          >
            <option value={"pointTop"}>Pointed Tops</option>
            <option value={"flatTop"}>Flat Tops</option>
          </select>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="terrain-type-controls">Terrain Type</label>
          <select
            id="terrain-type-controls"
            value={config.terrainType}
            onChange={(e) => {
              handleConfigChange("terrainType", e.target.value as Terrain);
            }}
          >
            {Object.keys(TERRAIN_HEX_COLOR_MAP).map((terrain) => (
              <option key={terrain} value={terrain}>
                {terrain}
              </option>
            ))}
          </select>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="paint-type-controls">Paint Type</label>
          <select
            id="paint-type-controls"
            value={config.paintType}
            onChange={(e) => {
              handleConfigChange("paintType", e.target.value as PaintType);
            }}
          >
            <option value={"brush"}>Brush</option>
            <option value={"bucket"}>Bucket</option>
          </select>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="label-format-controls">Label Format</label>
          <select
            id="label-format-controls"
            value={config.labelFormat}
            onChange={(e) => {
              handleConfigChange(
                "labelFormat",
                e.target.value as LabelFormatOption
              );
            }}
          >
            <option value={"none"}>None</option>
            <option value={"numbersOnly"}>Numbers Only</option>
            <option value={"alphaX"}>Alphabetical X Coordinate</option>
          </select>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="image-format-controls">Canvas Format</label>
          <select
            id="image-format-controls"
            value={config.imageFormat}
            onChange={(e) => {
              handleConfigChange(
                "imageFormat",
                e.target.value as ImageFormatOption
              );
            }}
          >
            <option value={"contained"}>Contained</option>
            <option value={"fixed"}>Fixed</option>
          </select>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="icon-visibility-controls">Show Icons</label>
          <input
            id="icon-visibility-controls"
            type="checkbox"
            checked={config.showHexIcons}
            onChange={(e) => {
              handleConfigChange("showHexIcons", e.target.checked);
            }}
          />
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="use-color-controls">Use Terrain Colors</label>
          <input
            id="use-color-controls"
            type="checkbox"
            checked={config.useTerrainColors}
            onChange={(e) => {
              handleConfigChange("useTerrainColors", e.target.checked);
            }}
          />
        </ControlWrapper>
      </ControlsDrawerSection>
      <ControlsDrawerSection>
        <h2>Manage File</h2>
        <ControlWrapper>
          <button
            type="button"
            onClick={() => {
              handleConvertToPNG(hexMapRef, mapMaxWidth, mapMaxHeight);
            }}
          >
            Convert to PNG
          </button>
        </ControlWrapper>
        <ControlWrapper>
          <button
            type="button"
            onClick={() => {
              handleConvertToSVG(hexMapRef);
            }}
          >
            Open as SVG
          </button>
        </ControlWrapper>
        <ControlWrapper>
          <a
            href={URL.createObjectURL(
              new Blob([JSON.stringify(config)], {
                type: "application/json",
              })
            )}
            download={"hex-map-build-config.json"}
          >
            Download JSON
          </a>
        </ControlWrapper>
        <ControlWrapper>
          <label htmlFor="import-json-config" className="file-input-label">
            Import JSON Config
          </label>
          <input
            id="import-json-config"
            type="file"
            accept="application/json"
            onChange={(e) => {
              handleConfigImport(e.target.files, setConfig);
            }}
          />
        </ControlWrapper>
        <ControlWrapper>
          <button
            className="error"
            type="button"
            onClick={() => {
              clearConfigFromLocalStorage(setConfig);
            }}
          >
            Clear Data
          </button>
        </ControlWrapper>
      </ControlsDrawerSection>
    </ControlsDrawerContainer>
  );
};
