import { c, spacings as sp } from "../../designSystem";
import { createItem } from "../../store";
import { ChildrenBorder, FlatednedList, FlatItemView } from "../FlatednedList";

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

    describe("selecting parent should select first", () => {
      beforeEach(() => list.selectParent());

      it("should select second item", () => {
        expect(list.visibleItems[0].textColor).toBe(c.selectedItem);
        expect(list.visibleItems[1].textColor).toBe(c.text);
      });
    });

    describe("selecting previous item", () => {
      beforeEach(() => list.selectPreviousItem());

      it("should select first item again", () => {
        expect(list.visibleItems[1].textColor).toBe(c.text);
        expect(list.visibleItems[0].textColor).toBe(c.selectedItem);
      });
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

    describe("opening first item", () => {
      beforeEach(() => list.openSelected());

      it("removes all first children", () =>
        expect(list.visibleItems.map((i) => i.item.title)).toEqual([
          "First",
          "First child",
          "Second",
        ]));

      it("removes all first children", () =>
        expect(list.visibleItems).toHaveLength(3));

      it("changes item model", () =>
        expect(list.visibleItems[0].item.isOpen).toBe(true));

      it("adds border for selected item", () =>
        expect(list.visibleItems[0].childrenBorder).toEqual<ChildrenBorder>({
          color: c.line,
          height: sp.itemHeight * 2,
        }));

      it("doesn't change position of the first item", () =>
        expect(list.visibleItems[0].position.y).toBe(
          sp.yBase + sp.level1ItemHeight / 2
        ));

      it("udates position of the First child item", () =>
        expect(list.visibleItems[1].position.y).toBe(
          sp.yBase + sp.level1ItemHeight + sp.itemHeight / 2
        ));

      it("udates position of the Second child item", () =>
        expect(list.visibleItems[2].position.y).toBe(
          sp.yBase +
            sp.level1ItemHeight +
            sp.itemHeight +
            sp.level1ItemHeight / 2
        ));
    });
  });
});

describe("Having two parent items first having two childs", () => {
  let list: FlatednedList;
  beforeEach(() => {
    list = createFlatList([
      createItem("First", [createItem("First.1"), createItem("First.2")]),
      createItem("Second"),
    ]);
  });

  describe("selecting First.1", () => {
    beforeEach(() => list.selectNextItem());

    it("selects First.1", () => {
      expect(list.getSelectedItem().title).toBe("First.1");
    });

    describe("removing First.1", () => {
      beforeEach(() => list.removeSelected());

      it("removes First.1 from visible items", () =>
        expect(list.visibleItems.map((i) => i.item.title)).toEqual([
          "First",
          "First.2",
          "Second",
        ]));

      it("removes First.1 from First item", () =>
        expect(list.root.children[0].children.map((i) => i.title)).toEqual([
          "First.2",
        ]));

      it("selects First", () =>
        expect(list.visibleItems[0].textColor).toBe(c.selectedItem));

      it("updates position of a Second.2 item", () =>
        expect(list.visibleItems[1].position.y).toEqual(
          sp.level1ItemHeight + sp.itemHeight / 2 + sp.yBase
        ));

      it("updates position of a Second item", () =>
        expect(list.visibleItems[2].position.y).toEqual(
          sp.level1ItemHeight +
            sp.itemHeight +
            sp.level1ItemHeight / 2 +
            sp.yBase
        ));

      it("updates borderHeight of First itemView", () =>
        expect(list.visibleItems[0].childrenBorder!.height).toEqual(
          sp.itemHeight * 2
        ));
    });
  });

  describe("removing First", () => {
    beforeEach(() => list.removeSelected());

    it("has only Second visible item", () =>
      expect(list.visibleItems.map((i) => i.item.title)).toEqual(["Second"]));

    it("selects Second", () =>
      expect(list.visibleItems[0].textColor).toBe(c.selectedItem));

    it("udpates Second item position", () =>
      expect(list.visibleItems[0].position.y).toEqual(
        sp.level1ItemHeight / 2 + sp.yBase
      ));
  });
});
