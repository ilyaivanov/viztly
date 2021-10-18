import { spacings } from "../../designSystem";
import { createItem, createRoot } from "../../itemTree";
import { List } from "../list";

describe("having four items", () => {
  let list: List;

  beforeEach(() => {
    list = new List(
      createRoot([
        createItem("First"),
        createItem("Second", [createItem("sub")]),
        createItem("Third"),
      ])
    );
  });

  describe("while Second is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("removes two items from list (including subchilds) ", () => {
      expect(getTitles(list)).toEqual(["First", "Third"]);
    });

    it("moves Third item up", () => {
      expect(list.rows[1].position.y).toEqual(
        spacings.yBase + spacings.zeroLevelItemHeight
      );
    });
  });

  describe("while sub is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("updates children height for Second", () => {
      expect(list.rows[1].childrenHeight).toEqual(0);
    });
  });

  describe("while Third is removed", () => {
    beforeEach(() => {
      list.selectNextItem();
      list.selectNextItem();
      list.selectNextItem();
      list.removeSelectedItem();
    });

    it("removes last item list ", () => {
      const items = ["First", "Second", "sub"];
      expect(getTitles(list)).toEqual(items);
    });
  });
});

describe("Creating new item", () => {
  it("add another one with the same position as current second item", () => {
    const list = new List(
      createRoot([createItem("First"), createItem("Second")])
    );

    const secondItemPosition = list.rows[1].position.y;
    list.createNewItemAfterSelected();
    expect(getTitles(list)).toEqual(["First", "", "Second"]);

    expect(list.rows[1].position.y).toEqual(secondItemPosition);
  });

  it("when item is open new item is being added as first child", () => {
    const list = new List(
      createRoot([
        createItem("First", [createItem("First.1")]),
        createItem("Second"),
      ])
    );

    const secondItemPosition = { ...list.rows[1].position };
    list.createNewItemAfterSelected();
    expect(getTitles(list)).toEqual(["First", "", "First.1", "Second"]);

    expect(list.rows[1].position).toEqual(secondItemPosition);
  });
});

const getTitles = (list: List) => list.rows.map((r) => r.item.title);
