import { Dispatch, FC, SetStateAction } from "react";

import { ControlsDrawerToggleButton } from "./ControlsDrawer.styles";

/** The toggle button used to open and close the controls drawer. */
export const ControlsDrawerToggle: FC<{
  isControlDrawerOpen: boolean;
  setIsControlDrawerOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ isControlDrawerOpen, setIsControlDrawerOpen }) => {
  return (
    <ControlsDrawerToggleButton
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
    </ControlsDrawerToggleButton>
  );
};
