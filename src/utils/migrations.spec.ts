import { HexMapConfig } from "../models";
import { migrationTo01, updateConfigToLatestVersion } from "./migrations";

const v0Config = {
  rowCount: 4,
  columnCount: 3,
  hexRadius: 50,
  terrainType: "none",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointTop",
  hexData: {},
  imageFormat: "contained",
  showHexIcons: false,
  useTerrainColors: true,
} as HexMapConfig;

const v01Config = {
  rowCount: 4,
  columnCount: 3,
  hexRadius: 50,
  terrainType: "none",
  paintType: "brush",
  labelFormat: "none",
  hexOrientation: "pointTop",
  hexData: {},
  imageFormat: "contained",
  showHexIcons: false,
  useTerrainColors: true,
  schemaVersion: "0.1",
} as HexMapConfig;

describe("migrate unversioned schema to v0.1", () => {
  it("should add schemaVersion to config", () => {
    const migratedConfig = migrationTo01(v0Config);
    expect(migratedConfig.schemaVersion).toBe("0.1");
  });
});

describe("update schema to latest config", () => {
  it("should create the correct final schema", () => {
    const migratedConfig = updateConfigToLatestVersion(v0Config);
    expect(migratedConfig).toEqual(expect.objectContaining(v01Config));
  });
});
