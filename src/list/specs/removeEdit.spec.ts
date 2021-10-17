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
      expect(list.rows.map((r) => r.item.title)).toEqual(["First", "Third"]);
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
      expect(list.rows.map((r) => r.item.title)).toEqual(items);
    });
  });
});
