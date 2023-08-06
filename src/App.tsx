import { useMemo, useState, useRef } from "react";
import { Global } from "@emotion/react";

import {
  HexMapConfig,
  LabelFormatOption,
  HexOrientationOption,
  HexFillColor,
  ImageFormatOption,
  PaintType,
} from "./models";
import { DEFAULT_HEXMAP_CONFIG } from "./constants";
import { prepareVectorData, prepareViewbox } from "./utils";

import {
  GLOBAL_STYLES,
  ControlWrapper,
  MainContainer,
  MapContainer,
  ControlsDrawer,
  ControlsDrawerSection,
  ControlsDrawerToggle,
} from "./App.styles";

const App = () => {
  const hexMapRef = useRef<SVGSVGElement>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(true);
  const [config, setConfig] = useState<HexMapConfig>(DEFAULT_HEXMAP_CONFIG);

  const { paths, labelData } = useMemo(() => {
    return prepareVectorData(config);
  }, [config]);

  const mapDimensions = useMemo(() => {
    return prepareViewbox(config);
  }, [config]);

  const handleConfigChange = <K extends keyof HexMapConfig>(
    configKey: K,
    newValue: HexMapConfig[K]
  ) => {
    setConfig({ ...config, [configKey]: newValue });
  };

  const handleHexPress = (hexKey: number) => {
    if (!isPointerDown) {
      setIsPointerDown(true);
    }
    if (config.hexFills[hexKey] !== config.paintFill) {
      setConfig({
        ...config,
        hexFills: { ...config.hexFills, [hexKey]: config.paintFill },
      });
    }
  };

  const handleHexDrag = (hexKey: number) => {
    if (isPointerDown && config.hexFills[hexKey] !== config.paintFill) {
      setConfig({
        ...config,
        hexFills: { ...config.hexFills, [hexKey]: config.paintFill },
      });
    }
  };

  const handleConvertToPNG = () => {
    const svgElement = hexMapRef.current;
    if (svgElement) {
      const svgURL = new XMLSerializer().serializeToString(svgElement);

      const canvas = document.createElement("canvas");
      canvas.width = mapDimensions.maxWidth;
      canvas.height = mapDimensions.maxHeight;
      const context = canvas.getContext("2d");

      var img = new Image();
      img.onload = () => {
        context?.drawImage(img, 0, 0);
        const pngURL = canvas?.toDataURL("image/png");
        var newTab = window.open("about:blank", "Hexmap PNG image from canvas");
        newTab?.document.write("<img src='" + pngURL + "' alt='PNG Hexmap'/>");
      };
      img.src =
        "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
    }
  };

  const handleConvertToSVG = () => {
    const svgElement = hexMapRef.current;
    if (svgElement) {
      const svgURL = new XMLSerializer().serializeToString(svgElement);

      var img = new Image();
      img.onload = () => {
        var newTab = window.open("about:blank", "Hexmap SVG image");
        newTab?.document.write(`<img src='${img.src}' alt='SVG Hexmap'/>`);
      };
      img.src =
        "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
    }
  };

  const handleConfigImport = (fileList: FileList | null) => {
    if (fileList) {
      new Response(fileList[0]).json().then(
        (json) => {
          setConfig({ ...DEFAULT_HEXMAP_CONFIG, ...json });
        },
        (err) => {
          alert("Invalid data format");
        }
      );
    }
  };

  return (
    <>
      <Global styles={GLOBAL_STYLES} />
      <MainContainer
        onMouseUp={() => {
          setIsPointerDown(false);
        }}
        onTouchEnd={() => {
          setIsPointerDown(false);
        }}
      >
        <ControlsDrawerToggle
          isDrawerOpen={isControlDrawerOpen}
          onClick={() => {
            setIsControlDrawerOpen(!isControlDrawerOpen);
          }}
          title="Toggle Controls Drawer"
        >
          <svg
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
          >
            <rect x="0" y="0" width="40" height="8" rx="2" />
            <rect x="0" y="16" width="40" height="8" rx="2" />
            <rect x="0" y="32" width="40" height="8" rx="2" />
          </svg>
        </ControlsDrawerToggle>
        <ControlsDrawer isVisible={isControlDrawerOpen}>
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
              <label htmlFor="hex-orientation-controls">
                Hexagon Orientation
              </label>
              <select
                title="TODO"
                disabled
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
              <label htmlFor="paint-fill-controls">Paint Color</label>
              <select
                id="paint-fill-controls"
                value={config.paintFill}
                onChange={(e) => {
                  handleConfigChange(
                    "paintFill",
                    e.target.value as HexFillColor
                  );
                }}
              >
                <option value={"transparent"}>None</option>
                <option value={"ivory"}>Desert</option>
                <option value={"grey"}>City</option>
                <option value={"red"}>Lava</option>
                <option value={"brown"}>Mountain</option>
                <option value={"darkcyan"}>Swamp</option>
              </select>
            </ControlWrapper>
            <ControlWrapper>
              <label htmlFor="paint-type-controls">Paint Color</label>
              <select
                disabled
                title="TODO"
                id="paint-type-controls"
                value={config.paintFill}
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
          </ControlsDrawerSection>
          <ControlsDrawerSection>
            <h2>Manage File</h2>
            <ControlWrapper>
              <button type="button" onClick={handleConvertToPNG}>
                Convert to PNG
              </button>
            </ControlWrapper>
            <ControlWrapper>
              <button type="button" onClick={handleConvertToSVG}>
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
              <label htmlFor="import-json-config">Import JSON Config</label>
              <input
                id="import-json-config"
                type="file"
                accept="application/json"
                onChange={(e) => {
                  handleConfigImport(e.target.files);
                }}
              />
            </ControlWrapper>
          </ControlsDrawerSection>
        </ControlsDrawer>
        <MapContainer isContained={config.imageFormat === "contained"}>
          <svg
            ref={hexMapRef}
            viewBox={mapDimensions.viewBox}
            width={mapDimensions.maxWidth}
            height={mapDimensions.maxHeight}
          >
            {paths.map((path, index) => (
              <g key={index}>
                <path
                  d={path}
                  fill={config.hexFills[index] || "transparent"}
                  stroke="#000"
                  strokeWidth="1"
                  onMouseDown={() => {
                    handleHexPress(index);
                  }}
                  onMouseOver={() => {
                    handleHexDrag(index);
                  }}
                  onTouchStart={() => {
                    handleHexPress(index);
                  }}
                  onTouchMove={() => {
                    handleHexDrag(index);
                  }}
                />
                <text x={labelData[index].x} y={labelData[index].y}>
                  {labelData[index].label}
                </text>
              </g>
            ))}
          </svg>
        </MapContainer>
      </MainContainer>
    </>
  );
};

export default App;
