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
  margin: 0;
  min-height: 100vh;
  padding: 2rem;
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 1rem;
  margin-right: 1rem;
  width: 160px;
  label {
    color: #fff;
    display: block;
    font-size: 0.875rem;
    margin-bottom: 4px;
    width: 100%;
  }
  input,
  select,
  button {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0;
    height: 32px;
    margin: 0;
    outline: none;
    padding: 0.25rem;
    width: 100%;
    &:focus {
      border-color: blue;
    }
  }
`;

export const MapContainer = styled.div<{ isContained?: boolean }>`
  background: #fff;
  border: 1px solid #000;
  max-width: 100%;
  overflow: auto;
  svg {
    max-width: ${({ isContained }) => (isContained ? "100%" : "unset")};
    text {
      fill: #000;
      font: 12px sans-serif;
    }
  }
`;
