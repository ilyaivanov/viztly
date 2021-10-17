import { c, spacings } from "../../designSystem";
import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";

const { yBase, xBase, xStep, zeroLevelItemHeight, itemHeight } = spacings;

it("moving left from level 1 does nothing", () => {
  const list = new List(
    createRoot([createItem("First"), createItem("Second")])
  );

  list.selectParentItem();

  expect(list.getSelectedItemRow().item.title).toEqual("First");
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

  it("first item is selected", () => {
    expect(list.rows[0].color).toBe(c.selectedItem);
  });

  describe("pressing down", () => {
    beforeEach(() => list.selectNextItem());

    it("selects second item and unselects first", () => {
      expect(list.rows[0].color).toBe(c.text);
      expect(list.rows[1].color).toBe(c.selectedItem);
    });

    describe("pressing up", () => {
      beforeEach(() => list.selectPreviousItem());

      it("selects first item and unselects first", () => {
        expect(list.rows[0].color).toBe(c.selectedItem);
        expect(list.rows[1].color).toBe(c.text);
      });
    });
  });

  it("pressing up doesnt change selection", () => {
    list.selectPreviousItem();
    expect(list.rows[0].color).toBe(c.selectedItem);
  });

  it("pressing down 2 times selects last item", () => {
    list.selectNextItem();
    list.selectNextItem();
    expect(list.getSelectedItemRow().item.title).toBe("First.1");
  });

  it("selecting First.1 highlights children border for a parent item", () => {
    list.selectNextItem();
    expect(list.rows[0].childrenColor).toBe(c.lineSelected);
  });

  it("selecting parent child selects second item", () => {
    list.selectNextItem();
    expect(list.rows[1].color).toBe(c.selectedItem);
    list.selectParentItem();
    expect(list.rows[0].color).toBe(c.selectedItem);
  });
});
