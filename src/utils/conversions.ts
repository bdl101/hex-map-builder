import { RefObject } from "react";

/** Conver the existing SVG image data and output the image in PNG format. Opens the image in a new tab. */
export const handleConvertToPNG = (
  hexMapRef: RefObject<SVGSVGElement>,
  maxWidth: number,
  maxHeight: number
) => {
  const svgElement = hexMapRef.current;
  if (svgElement) {
    const svgElementClone = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElementClone.innerHTML = svgElement.innerHTML;
    svgElementClone.setAttribute("width", String(maxWidth));
    svgElementClone.setAttribute("height", String(maxHeight));
    svgElementClone.setAttribute(
      "style",
      svgElement.getAttribute("style") ?? ""
    );
    const svgURL = new XMLSerializer().serializeToString(svgElementClone);

    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    const context = canvas.getContext("2d");

    var img = new Image();
    img.onload = () => {
      context?.drawImage(img, 0, 0);
      const pngURL = canvas?.toDataURL("image/png");
      var newTab = window.open("about:blank", "Hexmap PNG image from canvas");
      newTab?.document.write("<img src='" + pngURL + "' alt='PNG Hexmap'/>");
    };
    img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
  }
};

/** Output the current image in the SVG format. Opens the image in a new tab. */
export const handleConvertToSVG = (hexMapRef: RefObject<SVGSVGElement>) => {
  const svgElement = hexMapRef.current;
  if (svgElement) {
    const svgURL = new XMLSerializer().serializeToString(svgElement);

    var img = new Image();
    img.onload = () => {
      var newTab = window.open("about:blank", "Hexmap SVG image");
      newTab?.document.write(`<img src='${img.src}' alt='SVG Hexmap'/>`);
    };
    img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
  }
};
