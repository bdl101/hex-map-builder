import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const GLOBAL_STYLES = css`
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-family: sans-serif;
  }
`;

export const MainContainer = styled.main`
  background-color: #282c34;
  display: flex;
  margin: 0;
  height: 100vh;
`;

export const MapContainer = styled.div<{ isContained?: boolean }>`
  background: #fff;
  border: 1px solid #000;
  flex-grow: 1;
  height: 100%;
  max-width: 100%;
  order: 1;
  overflow: ${({ isContained }) => (isContained ? "hidden" : "auto")};
  svg {
    user-select: none;
    max-height: ${({ isContained }) => (isContained ? "100%" : "unset")};
    max-width: ${({ isContained }) => (isContained ? "100%" : "unset")};
    text {
      fill: #000;
      font: 12px sans-serif;
    }
  }
`;
