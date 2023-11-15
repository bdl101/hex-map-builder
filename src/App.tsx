import { useMemo, useState, useRef } from "react";
import { Global } from "@emotion/react";

import { HexMapConfig, TERRAIN_HEX_COLOR_MAP } from "./models";
import {
  handleHexDrag,
  handleHexPress,
  loadConfigFromLocalStorage,
  prepareHexStorage,
  prepareVectorMapData,
  prepareViewboxValues,
  saveConfigToLocalStorage,
} from "./utils";

import { ControlsDrawer, ControlsDrawerToggle } from "./components";

import { GLOBAL_STYLES, MainContainer, MapContainer } from "./App.styles";

const INITIAL_CONFIG = loadConfigFromLocalStorage();

/* const hexStorage = prepareHexStorage(
  DEFAULT_HEXMAP_CONFIG2.rowCount,
  DEFAULT_HEXMAP_CONFIG2.columnCount,
  DEFAULT_HEXMAP_CONFIG2.hexStorage
);
const mapData = prepareVectorMapData({ ...DEFAULT_HEXMAP_CONFIG2, hexStorage });
const viewboxValues = prepareViewboxValues(DEFAULT_HEXMAP_CONFIG2); */

const App = () => {
  const hexMapRef = useRef<SVGSVGElement>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(true);
  const [config, setConfig] = useState<HexMapConfig>(INITIAL_CONFIG);

  const mapData = useMemo(() => {
    return prepareVectorMapData(config);
  }, [config]);

  const viewboxValues = useMemo(() => {
    return prepareViewboxValues(config);
  }, [config]);

  const handleConfigChange = <K extends keyof HexMapConfig>(
    configKey: K,
    newValue: HexMapConfig[K]
  ) => {
    // TODO: update hex storage on row or col change
    const newConfig = { ...config, [configKey]: newValue };

    console.log(newConfig.rowCount, newConfig.columnCount);

    if (configKey === "columnCount" || configKey === "rowCount") {
      newConfig.hexStorage = prepareHexStorage(
        newConfig.rowCount,
        newConfig.columnCount,
        newConfig.hexStorage
      );
    }

    setConfig(newConfig);
    saveConfigToLocalStorage(newConfig);
  };

  return (
    <>
      <Global styles={GLOBAL_STYLES} />
      <MainContainer>
        <ControlsDrawerToggle
          isControlDrawerOpen={isControlDrawerOpen}
          setIsControlDrawerOpen={setIsControlDrawerOpen}
        />
        <ControlsDrawer
          config={config}
          handleConfigChange={handleConfigChange}
          hexMapRef={hexMapRef}
          isControlDrawerOpen={isControlDrawerOpen}
          mapMaxHeight={viewboxValues.maxHeight}
          mapMaxWidth={viewboxValues.maxWidth}
          setConfig={setConfig}
        />
        <MapContainer
          isContained={config.imageFormat === "contained"}
          onMouseUp={() => {
            setIsPointerDown(false);
          }}
          onTouchEnd={() => {
            setIsPointerDown(false);
          }}
        >
          {/* <svg
            ref={hexMapRef}
            viewBox={mapDimensions.viewBox}
            width={
              config.imageFormat === "fixed"
                ? mapDimensions.maxWidth
                : undefined
            }
            height={
              config.imageFormat === "fixed"
                ? mapDimensions.maxHeight
                : undefined
            }
            style={{ fontSize: "12px", fontFamily: "sans-serif" }}
          >
            {paths.map((path, index) => {
              const terrainType = config.hexData[index]?.terrainType;
              let hexFillColor = "transparent";
              if (terrainType !== undefined && config.useTerrainColors) {
                hexFillColor = TERRAIN_HEX_COLOR_MAP[terrainType];
              }
              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={hexFillColor}
                    stroke="#000"
                    strokeWidth="1"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleHexPress({
                        hexKey: index,
                        isPointerDown,
                        setIsPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onMouseOver={(e) => {
                      e.preventDefault();
                      handleHexDrag({
                        hexKey: index,
                        isPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleHexPress({
                        hexKey: index,
                        isPointerDown,
                        setIsPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      handleHexDrag({
                        hexKey: index,
                        isPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                  />
                  {icons[index] && <path {...icons[index]} />}
                  <text x={labelData[index].x} y={labelData[index].y}>
                    {labelData[index].label}
                  </text>
                </g>
              );
            })}
          </svg> */}
          <svg
            ref={hexMapRef}
            viewBox={viewboxValues.viewboxString}
            width={
              config.imageFormat === "fixed"
                ? viewboxValues.maxWidth
                : undefined
            }
            height={
              config.imageFormat === "fixed"
                ? viewboxValues.maxHeight
                : undefined
            }
            // TODO: dynamic font size
            style={{ fontSize: "12px", fontFamily: "sans-serif" }}
          >
            {mapData.map((row, rowIndex) => (
              <g key={`row-${rowIndex}`}>
                {row.map((hex, columnIndex) => (
                  <g key={`column-${columnIndex}`}>
                    <path
                      d={hex.hexPath}
                      stroke="#000"
                      // TODO: make stroke width proportional to the hex radius
                      // TODO: make all of this properties of the hex
                      strokeWidth="1"
                      fill="transparent"
                    />
                    {hex.label && (
                      <text x={hex.label.x} y={hex.label.y}>
                        {hex.label.text}
                      </text>
                    )}
                    {hex.icon && <path {...hex.icon} />}
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </MapContainer>
      </MainContainer>
    </>
  );
};

export default App;
