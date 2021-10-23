import { spacings } from "../designSystem";
import { createItem, createRoot } from "../itemTree";
import { createRows } from "./layouter";

it("Positions for rows are calculated properly for a nested structure", () => {
  const root = createRoot([
    createItem("First", [
      createItem("First.1", [createItem("First.1.1"), createItem("First.1.2")]),
      createItem("First.2"),
    ]),
    createItem("Second"),
    createItem("Third"),
  ]);

  const rows = createRows(root);
  expect(rows[0].position).toEqual({
    x: spacings.xBase,
    y: spacings.yBase,
  });

  expect(rows[1].position).toEqual({
    x: spacings.xBase + spacings.xStep,
    y:
      spacings.yBase +
      spacings.zeroLevelItemHeight / 2 +
      spacings.itemHeight / 2,
  });

  expect(rows[2].position).toEqual({
    x: spacings.xBase + spacings.xStep * 2,
    y:
      spacings.yBase +
      spacings.zeroLevelItemHeight / 2 +
      spacings.itemHeight +
      spacings.itemHeight / 2,
  });

  expect(rows[3].position).toEqual({
    x: spacings.xBase + spacings.xStep * 2,
    y:
      spacings.yBase +
      spacings.zeroLevelItemHeight / 2 +
      spacings.itemHeight * 2 +
      spacings.itemHeight / 2,
  });

  expect(rows[4].position).toEqual({
    x: spacings.xBase + spacings.xStep,
    y:
      spacings.yBase +
      spacings.zeroLevelItemHeight / 2 +
      spacings.itemHeight * 3 +
      spacings.itemHeight / 2,
  });

  expect(rows[5].position).toEqual({
    x: spacings.xBase,
    y: spacings.yBase + spacings.zeroLevelItemHeight + spacings.itemHeight * 4,
  });

  expect(rows[6].position).toEqual({
    x: spacings.xBase,
    y:
      spacings.yBase +
      spacings.zeroLevelItemHeight * 2 +
      spacings.itemHeight * 4,
  });
});
