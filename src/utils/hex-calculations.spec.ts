import { determineHexNeighbors, prepareHexOrigin } from "./hex-calculations";

const HEX_RADIUS = 50;
const HEX_INNER_WIDTH = Math.sqrt(3) * HEX_RADIUS;

describe("Preparing origin points for hexes", () => {
  it("should return the correct origin for each orientation", () => {
    // Pointed tops, shove odd rows right.
    expect(prepareHexOrigin(0, 0, HEX_RADIUS, "pointedTopOddRow")).toEqual({
      xCoordinate: Math.round(0.5 * HEX_INNER_WIDTH),
      yCoordinate: HEX_RADIUS,
    });
    expect(prepareHexOrigin(1, 0, HEX_RADIUS, "pointedTopOddRow")).toEqual({
      xCoordinate: Math.round(1.5 * HEX_INNER_WIDTH),
      yCoordinate: HEX_RADIUS,
    });
    expect(prepareHexOrigin(0, 1, HEX_RADIUS, "pointedTopOddRow")).toEqual({
      xCoordinate: Math.round(HEX_INNER_WIDTH),
      yCoordinate: 125,
    });
    expect(prepareHexOrigin(1, 1, HEX_RADIUS, "pointedTopOddRow")).toEqual({
      xCoordinate: Math.round(2 * HEX_INNER_WIDTH),
      yCoordinate: 125,
    });
    expect(prepareHexOrigin(2, 2, HEX_RADIUS, "pointedTopOddRow")).toEqual({
      xCoordinate: Math.round(2.5 * HEX_INNER_WIDTH),
      yCoordinate: 200,
    });

    // Pointed tops, shove even rows right
    expect(prepareHexOrigin(0, 0, HEX_RADIUS, "pointedTopEvenRow")).toEqual({
      xCoordinate: Math.round(HEX_INNER_WIDTH),
      yCoordinate: HEX_RADIUS,
    });
    expect(prepareHexOrigin(1, 0, HEX_RADIUS, "pointedTopEvenRow")).toEqual({
      xCoordinate: Math.round(2 * HEX_INNER_WIDTH),
      yCoordinate: HEX_RADIUS,
    });
    expect(prepareHexOrigin(0, 1, HEX_RADIUS, "pointedTopEvenRow")).toEqual({
      xCoordinate: Math.round(0.5 * HEX_INNER_WIDTH),
      yCoordinate: 125,
    });
    expect(prepareHexOrigin(1, 1, HEX_RADIUS, "pointedTopEvenRow")).toEqual({
      xCoordinate: Math.round(1.5 * HEX_INNER_WIDTH),
      yCoordinate: 125,
    });
    expect(prepareHexOrigin(2, 2, HEX_RADIUS, "pointedTopEvenRow")).toEqual({
      xCoordinate: Math.round(3 * HEX_INNER_WIDTH),
      yCoordinate: 200,
    });

    // Flat tops, shove odd columns down
    expect(prepareHexOrigin(0, 0, HEX_RADIUS, "flatTopOddColumn")).toEqual({
      xCoordinate: HEX_RADIUS,
      yCoordinate: Math.round(0.5 * HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(1, 0, HEX_RADIUS, "flatTopOddColumn")).toEqual({
      xCoordinate: 125,
      yCoordinate: Math.round(HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(0, 1, HEX_RADIUS, "flatTopOddColumn")).toEqual({
      xCoordinate: HEX_RADIUS,
      yCoordinate: Math.round(1.5 * HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(1, 1, HEX_RADIUS, "flatTopOddColumn")).toEqual({
      xCoordinate: 125,
      yCoordinate: Math.round(2 * HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(2, 2, HEX_RADIUS, "flatTopOddColumn")).toEqual({
      xCoordinate: 200,
      yCoordinate: Math.round(2.5 * HEX_INNER_WIDTH),
    });

    // Flat tops, shove even columns down
    expect(prepareHexOrigin(0, 0, HEX_RADIUS, "flatTopEvenColumn")).toEqual({
      xCoordinate: HEX_RADIUS,
      yCoordinate: Math.round(HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(1, 0, HEX_RADIUS, "flatTopEvenColumn")).toEqual({
      xCoordinate: 125,
      yCoordinate: Math.round(HEX_INNER_WIDTH / 2),
    });
    expect(prepareHexOrigin(0, 1, HEX_RADIUS, "flatTopEvenColumn")).toEqual({
      xCoordinate: HEX_RADIUS,
      yCoordinate: Math.round(2 * HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(1, 1, HEX_RADIUS, "flatTopEvenColumn")).toEqual({
      xCoordinate: 125,
      yCoordinate: Math.round(1.5 * HEX_INNER_WIDTH),
    });
    expect(prepareHexOrigin(2, 2, HEX_RADIUS, "flatTopEvenColumn")).toEqual({
      xCoordinate: 200,
      yCoordinate: Math.round(3 * HEX_INNER_WIDTH),
    });
  });
});

describe("Determining neightbors of hexes at specified coordinates", () => {
  it("Should return the correct neighbors for pointed tops, shove odd rows orientation", () => {
    // Top-left corner hex
    let neighbors = determineHexNeighbors({
      columnIndex: 0,
      rowIndex: 0,
      orientation: "pointedTopOddRow",
      rowLength: 4,
      columnLength: 4,
    });
    expect(neighbors).toHaveLength(2);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [0, 1],
        [1, 0],
      ])
    );

    // Top-right corner hex
    neighbors = determineHexNeighbors({
      columnIndex: 3,
      rowIndex: 0,
      orientation: "pointedTopOddRow",
      rowLength: 4,
      columnLength: 4,
    });
    expect(neighbors).toHaveLength(3);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [2, 0],
        [2, 1],
        [3, 1],
      ])
    );

    // Bottom-left corner hex
    neighbors = determineHexNeighbors({
      columnIndex: 0,
      rowIndex: 3,
      orientation: "pointedTopOddRow",
      rowLength: 4,
      columnLength: 4,
    });
    expect(neighbors).toHaveLength(3);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [0, 2],
        [1, 2],
        [1, 3],
      ])
    );

    // Bottom-right corner hex
    neighbors = determineHexNeighbors({
      columnIndex: 3,
      rowIndex: 3,
      orientation: "pointedTopOddRow",
      rowLength: 4,
      columnLength: 4,
    });
    expect(neighbors).toHaveLength(2);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [2, 3],
        [3, 2],
      ])
    );

    // Random center hex
    neighbors = determineHexNeighbors({
      columnIndex: 1,
      rowIndex: 1,
      orientation: "pointedTopOddRow",
      rowLength: 4,
      columnLength: 4,
    });
    expect(neighbors).toHaveLength(6);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
        [1, 2],
        [0, 1],
      ])
    );
  });

  it("Should return the correct neighbors for pointed tops, shove even rows orientation", () => {
    // TODO
  });

  it("Should return the correct neighbors for flat tops, shove odd columns orientation", () => {
    // TODO
  });

  it("Should return the correct neighbors for flat tops, shove even columns orientation", () => {
    // TODO
  });
});
