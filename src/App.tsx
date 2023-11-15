import { useMemo, useState, useRef } from "react";
import { Global } from "@emotion/react";

import {
  DEFAULT_HEXMAP_CONFIG2,
  HexMapConfig,
  TERRAIN_HEX_COLOR_MAP,
} from "./models";
import {
  handleHexDrag,
  handleHexPress,
  loadConfigFromLocalStorage,
  prepareHexStorage,
  prepareVectorData,
  prepareVectorMapData,
  prepareViewbox,
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

  const { paths, icons, labelData } = useMemo(() => {
    return prepareVectorData(config);
  }, [config]);

  const mapDimensions = useMemo(() => {
    return prepareViewbox(config);
  }, [config]);

  const handleConfigChange = <K extends keyof HexMapConfig>(
    configKey: K,
    newValue: HexMapConfig[K]
  ) => {
    const newConfig = { ...config, [configKey]: newValue };
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
          mapMaxHeight={mapDimensions.maxHeight}
          mapMaxWidth={mapDimensions.maxWidth}
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
            viewBox={viewboxValues.viewboxString}
            width={viewboxValues.maxWidth}
            height={viewboxValues.maxHeight}
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
