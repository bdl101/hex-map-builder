import styled from "@emotion/styled";

export const MainContainer = styled.main`
  background-color: #282c34;
  font-family: sans-serif;
  margin: 0;
  min-height: 100vh;
  padding: 2rem;
`;

export const Controls = styled.div`
  display: flex;
`;

export const InputContainer = styled.div`
  label {
    color: #fff;
    display: block;
    font-size: 0.875rem;
    margin-bottom: 4px;
  }
  input,
  select {
    background: #fff;
    border: 1px solid #ccc;
    height: 32px;
    margin-bottom: 1rem;
    margin-right: 1rem;
    outline: none;
    width: 160px;
    &:focus {
      border-color: blue;
    }
  }
`;

export const MapContainer = styled.div`
  svg {
    border: 1px solid #fff;
    max-width: 800px;
    width: 100%;
  }
`;
