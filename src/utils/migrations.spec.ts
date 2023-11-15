import {
  migrationToVersion01,
  migrationToVersion1,
  updateConfigToLatestVersion,
} from "./migrations";
// eslint-disable-next-line
import { v0Config, v01Config, v1Config } from "./__mocks__/";

describe("migrate unversioned schema to v0.1", () => {
  it("should add schemaVersion to config", () => {
    const migratedConfig = migrationToVersion01(v0Config);
    expect(migratedConfig.schemaVersion).toBe("0.1");
  });
});

describe("migrate v0.1 schema to v1", () => {
  it("should convert hex options, update hex storage", () => {
    const migratedConfig = migrationToVersion1(v01Config);
    expect(migratedConfig).toEqual(expect.objectContaining(v1Config));
  });
});

describe("update schema to latest config", () => {
  it("should create the correct final schema", () => {
    const migratedConfig = updateConfigToLatestVersion(v0Config);
    expect(migratedConfig).toEqual(expect.objectContaining(v1Config));
  });
});
