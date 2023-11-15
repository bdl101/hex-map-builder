import styled from "@emotion/styled";

export const ControlsDrawerToggleButton = styled.button<{
  isDrawerOpen: boolean;
}>`
  background: none;
  border: none;
  color: ${({ isDrawerOpen }) => (isDrawerOpen ? "#fff" : "#000")};
  cursor: pointer;
  height: 40px;
  outline: none;
  padding: 8px;
  position: fixed;
  right: 4px;
  top: 4px;
  width: 40px;
  z-index: 2;
  &:hover {
    background: ${({ isDrawerOpen }) => (isDrawerOpen ? "#fff" : "#000")};
    color: ${({ isDrawerOpen }) => (isDrawerOpen ? "#000" : "#fff")};
  }
  svg {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }
`;

export const ControlsDrawerContainer = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  height: 100%;
  max-width: 368px;
  order: 2;
  overflow: auto;
  padding: 0.5rem;
`;

export const ControlsDrawerSection = styled.div`
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
  margin: 1rem 0 0;
  h2 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem;
    width: 100%;
  }
`;

export const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:nth-of-type(odd) {
    margin-right: 1rem;
  }
  margin-bottom: 1rem;
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
  button,
  a {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0;
    color: inherit;
    font-size: 0.875rem;
    height: 32px;
    line-height: 1rem;
    margin: 0;
    outline: none;
    padding: 0.25rem;
    width: 100%;
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    &:focus {
      border-color: blue;
    }
    &[type="checkbox"] {
      width: 32px;
    }
  }
  a,
  button,
  .file-input-label {
    align-items: center;
    background: #ccc;
    color: inherit;
    cursor: pointer;
    font-size: 0.875rem;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    &:focus,
    &:hover,
    &:active,
    &:visited {
      color: inherit;
    }
    &.error {
      background: red;
      border: none;
      color: #fff;
      outline: none;
    }
  }
  select {
    text-transform: capitalize;
    option {
      text-transform: capitalize;
    }
  }
  input[type="file"] {
    display: none;
  }
`;
