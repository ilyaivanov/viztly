import { spacings } from "../designSystem";
import { createItem, createRoot } from "./domain";
import { List } from "./list";

const { yBase, xBase, xStep, zeroLevelItemHeight, itemHeight } = spacings;

it("Having three items at level 1 should have proper y coordinates", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second"), createItem("Third")])
  );

  expect(list.rows[0].position.y).toBe(yBase);
  expect(list.rows[1].position.y).toBe(yBase + zeroLevelItemHeight);
  expect(list.rows[2].position.y).toBe(yBase + zeroLevelItemHeight * 2);
});

describe("Having one item with a child", () => {
  let list: List;
  beforeEach(() => {
    list = new List(createRoot([createItem("First", [createItem("First.1")])]));
  });

  it("offsets second item by xStep", () => {
    expect(list.rows[1].position.x).toBe(xBase + xStep);
  });

  it("vertically offsets second item", () => {
    expect(list.rows[1].position.y).toBe(
      yBase + zeroLevelItemHeight / 2 + itemHeight / 2
    );
  });

  it("sets children height for First item", () => {
    expect(list.rows[0].childrenHeight).toBe(itemHeight);
  });
});
