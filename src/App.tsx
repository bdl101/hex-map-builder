import { useMemo, useState, useRef } from "react";
import { Global } from "@emotion/react";

import {
  HexMapConfig,
  ConfigKey,
  LabelFormatOption,
  HexOrientationOption,
  HexFillColor,
  ImageFormatOption,
} from "./models";
import {
  DEFAULT_COLUMN_COUNT,
  DEFAULT_HEX_RADIUS,
  DEFAULT_ROW_COUNT,
} from "./constants";
import { prepareVectorData, prepareViewbox } from "./utils";

import {
  GLOBAL_STYLES,
  InputContainer,
  MainContainer,
  MapContainer,
  Controls,
} from "./App.styles";

const foo = URL.createObjectURL(
  new Blob([JSON.stringify({ foo: "bar" })], { type: "application/json" })
);

const App = () => {
  const hexMapRef = useRef<SVGSVGElement>(null);

  const [pointerIsDown, setPointerIsDown] = useState(false);
  const [config, setConfig] = useState<HexMapConfig>({
    rowCount: DEFAULT_ROW_COUNT,
    columnCount: DEFAULT_COLUMN_COUNT,
    hexRadius: DEFAULT_HEX_RADIUS,
    paintFill: "transparent",
    labelFormat: "none",
    hexOrientation: "pointTop",
    hexFills: {},
    imageFormat: "contained",
  });

  const { paths, labelData } = useMemo(() => {
    return prepareVectorData(config);
  }, [config]);

  const mapDimensions = useMemo(() => {
    return prepareViewbox(config);
  }, [config]);

  const handleConfigChange = (
    configKey: ConfigKey,
    newValue: HexMapConfig[ConfigKey]
  ) => {
    setConfig({ ...config, [configKey]: newValue });
  };

  const handleHexPress = (hexKey: number) => {
    if (!pointerIsDown) {
      setPointerIsDown(true);
    }
    if (config.hexFills[hexKey] !== config.paintFill) {
      setConfig({
        ...config,
        hexFills: { ...config.hexFills, [hexKey]: config.paintFill },
      });
    }
  };

  const handleHexDrag = (hexKey: number) => {
    if (pointerIsDown && config.hexFills[hexKey] !== config.paintFill) {
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
        console.log(pngURL);
        var newTab = window.open("about:blank", "image from canvas");
        newTab?.document.write("<img src='" + pngURL + "' alt='from canvas'/>");
      };
      img.src =
        "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
    }
  };

  return (
    <>
      <Global styles={GLOBAL_STYLES} />
      <MainContainer
        onMouseUp={() => {
          setPointerIsDown(false);
        }}
        onTouchEnd={() => {
          setPointerIsDown(false);
        }}
      >
        <a href={foo} download={"foo.json"}>
          Download foo
        </a>
        <Controls>
          <InputContainer>
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
          </InputContainer>
          <InputContainer>
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
          </InputContainer>
          <InputContainer>
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
          </InputContainer>
          <InputContainer>
            <label htmlFor="paint-fill-controls">Paint Color</label>
            <select
              id="paint-fill-controls"
              value={config.paintFill}
              onChange={(e) => {
                handleConfigChange("paintFill", e.target.value as HexFillColor);
              }}
            >
              <option value={"transparent"}>None</option>
              <option value={"ivory"}>Desert</option>
              <option value={"grey"}>City</option>
              <option value={"red"}>Lava</option>
              <option value={"brown"}>Mountain</option>
              <option value={"darkcyan"}>Swamp</option>
            </select>
          </InputContainer>
          <InputContainer>
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
          </InputContainer>
          <InputContainer>
            <label htmlFor="hex-orientation-controls">
              Hexagon Orientation
            </label>
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
          </InputContainer>
          <InputContainer>
            <label htmlFor="hex-orientation-controls">
              Hexagon Orientation
            </label>
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
          </InputContainer>
          <InputContainer>
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
          </InputContainer>
          <InputContainer>
            <button type="button" onClick={handleConvertToPNG}>
              Convert to PNG
            </button>
          </InputContainer>
        </Controls>
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
