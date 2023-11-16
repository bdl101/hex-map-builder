import { useMemo, useState, useRef } from "react";
import { Global } from "@emotion/react";

import { HexMapConfig } from "./models";
import {
  determineLabelFontSizeByRatio,
  determineRadiusRatioModifier,
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

const App = () => {
  const hexMapRef = useRef<SVGSVGElement>(null);

  // TODO: lift pointer when window loses focus
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(true);
  const [config, setConfig] = useState<HexMapConfig>(INITIAL_CONFIG);

  const mapData = useMemo(() => {
    return prepareVectorMapData(config);
  }, [config]);

  const viewboxValues = useMemo(() => {
    return prepareViewboxValues(config);
  }, [config]);

  const resolvedLabelFontSize = useMemo(() => {
    const ratio = determineRadiusRatioModifier(config.hexRadius);
    return determineLabelFontSizeByRatio(ratio);
  }, [config.hexRadius]);

  const handleConfigChange = <K extends keyof HexMapConfig>(
    configKey: K,
    newValue: HexMapConfig[K]
  ) => {
    const newConfig = { ...config, [configKey]: newValue };

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
            style={{
              fontSize: resolvedLabelFontSize,
              fontFamily: "sans-serif",
            }}
          >
            {mapData.map((row, rowIndex) => (
              <g key={`row-${rowIndex}`}>
                {row.map((hex, columnIndex) => (
                  <g
                    key={`column-${columnIndex}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleHexPress({
                        hexKey: [columnIndex, rowIndex],
                        isPointerDown,
                        setIsPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onMouseOver={(e) => {
                      e.preventDefault();
                      handleHexDrag({
                        hexKey: [columnIndex, rowIndex],
                        isPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleHexPress({
                        hexKey: [columnIndex, rowIndex],
                        isPointerDown,
                        setIsPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      handleHexDrag({
                        hexKey: [columnIndex, rowIndex],
                        isPointerDown,
                        config,
                        setConfig,
                      });
                    }}
                  >
                    <path {...hex.hexShell} />
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
