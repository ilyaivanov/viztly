import { c, spacings as sp } from "../designSystem";
import { createItem } from "../store";
import { ChildrenBorder, FlatednedList } from "./itemsLayout";

const createFlatList = (children: Item[]) =>
  new FlatednedList(createItem("Home", children));

it("viewing two children without any children returns two item one below another", () => {
  let list = createFlatList([createItem("First"), createItem("Second")]);

  expect(list.visibleItems.map((v) => v.position.y)).toEqual([
    sp.yBase + sp.level1ItemHeight / 2,
    sp.yBase + sp.level1ItemHeight / 2 + sp.level1ItemHeight,
  ]);
});

describe("viewing one item with a child", () => {
  let list: FlatednedList;

  beforeEach(() => {
    list = createFlatList([
      createItem("First", [createItem("First child")]),
      createItem("Second"),
    ]);
  });

  it("offsets child by a xStep", () => {
    expect(list.visibleItems.map((v) => v.position.y)).toEqual([
      sp.yBase + sp.level1ItemHeight / 2,
      sp.yBase + sp.level1ItemHeight + sp.itemHeight / 2,
      sp.yBase + sp.level1ItemHeight + sp.itemHeight + sp.level1ItemHeight / 2,
    ]);
  });

  it("creates a proper border", () => {
    expect(list.visibleItems[0].childrenBorder).toEqual<ChildrenBorder>({
      height: sp.itemHeight * 2,
      color: c.line,
    });
  });

  it("first item is selected", () => {
    expect(list.visibleItems[0].textColor).toBe(c.selectedItem);
    expect(list.visibleItems[1].textColor).toBe(c.text);
  });

  describe("selecting next item", () => {
    beforeEach(() => list.selectNextItem());

    it("should select second item", () => {
      expect(list.visibleItems[0].textColor).toBe(c.text);
      expect(list.visibleItems[1].textColor).toBe(c.selectedItem);
    });
  });

  describe("closing first item", () => {
    beforeEach(() => list.closeSelected());

    it("removes all first children", () =>
      expect(list.visibleItems.map((i) => i.item.title)).toEqual([
        "First",
        "Second",
      ]));

    it("removes all first children", () =>
      expect(list.visibleItems).toHaveLength(2));

    it("changes item model", () =>
      expect(list.visibleItems[0].item.isOpen).toBe(false));

    it("removes border for selected item", () =>
      expect(list.visibleItems[0].childrenBorder).toBeUndefined());

    it("doesn't change position of the first item", () =>
      expect(list.visibleItems[0].position.y).toBe(
        sp.yBase + sp.level1ItemHeight / 2
      ));

    it("udates position of the Second item", () =>
      expect(list.visibleItems[1].position.y).toBe(
        sp.yBase + sp.level1ItemHeight + sp.level1ItemHeight / 2
      ));
  });
});

//key ideas
// [] Separate animation from FlatViewModel. Animating one value should not change your ViewModel
// [] Write tests for selecting items
