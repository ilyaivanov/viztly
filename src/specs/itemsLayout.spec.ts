import { c, spacings as sp } from "../designSystem";
import { createItem } from "../store";
import { FlatednedList } from "./itemsLayout";

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
    expect(list.visibleItems[0].childrenBorder).toEqual<Line>({
      start: {
        x: sp.xBase,
        y:
          sp.yBase +
          sp.circleRadius +
          sp.lineDistanceToCircle +
          sp.level1ItemHeight / 2,
      },
      end: {
        x: sp.xBase,
        y:
          sp.yBase +
          sp.level1ItemHeight +
          sp.itemHeight +
          -sp.circleRadius -
          sp.lineDistanceToCircle +
          sp.level1ItemHeight / 2,
      },
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
});

//key ideas
// [] Separate animation from FlatViewModel. Animating one value should not change your ViewModel
// [] Write tests for selecting items
