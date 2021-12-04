import { traverseOpenViews } from "../src2/view";
import {
  Item,
  Tree,
  createItemTree,
  createTree,
  selectNextItem,
  selectPreviousItem,
  selectItem,
  createItemBoard,
  selectTabRight,
  selectTabLeft,
} from "./tree";

describe("Having a bit of nested items", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree(
      createItemTree("root", [
        createItemTree("i1", [
          createItemTree("i1.1", [createItemTree("i1.1.1")]),
        ]),
        createItemTree("i2"),
        createItemTree("i3"),
      ])
    );
  });

  it("i1 has a parent root", () => {
    expect(tree.root.children[0].parent).toBe(tree.root);
  });

  it("i1.1 has a parent Item.1", () => {
    const item1 = tree.root.children[0];
    const item11 = item1.children[0];
    expect(item11.parent).toBe(item1);
  });

  it("root has no parent", () => expect(tree.root.parent).toBeUndefined());

  it("i1 is selected", () =>
    expect(tree.root.children[0].isSelected).toBe(true));

  it("i2 is not selected", () =>
    expect(tree.root.children[1].isSelected).toBeFalsy());

  it("selecting next item unselects i1 and selects i1.1", () => {
    selectNextItem(tree);
    expect(tree.root.children[0].isSelected).toBeFalsy();
    expect(tree.root.children[0].children[0].isSelected).toBeTruthy();
    expect(tree.selectedItem!.title).toBe("i1.1");
  });

  it("selecting next item twice selects i1.1.1", () => {
    selectNextItem(tree);
    selectNextItem(tree);
    expect(tree.selectedItem!.title).toBe("i1.1.1");
  });

  it("selecting next item three times selects i2", () => {
    selectNextItem(tree);
    selectNextItem(tree);
    selectNextItem(tree);
    expect(tree.selectedItem!.title).toBe("i2");
  });

  it("selecting next item five times selects i2 (last call is a noop)", () => {
    selectNextItem(tree);
    selectNextItem(tree);
    selectNextItem(tree);
    selectNextItem(tree);
    selectNextItem(tree);
    expect(tree.selectedItem!.title).toBe("i3");
  });

  it("selecting next item and then previous one selects i1", () => {
    selectNextItem(tree);
    expect(tree.selectedItem!.title).toBe("i1.1");
    selectPreviousItem(tree);
    expect(tree.selectedItem!.title).toBe("i1");
  });

  it("if i3 is selected selecting previous item selects i2", () => {
    selectItem(tree, tree.root.children[2]);
    expect(tree.selectedItem!.title).toBe("i3");
    selectPreviousItem(tree);
    expect(tree.selectedItem!.title).toBe("i2");
  });

  it("if i2 is selected selecting previous item selects i1.1.1", () => {
    selectItem(tree, tree.root.children[1]);
    expect(tree.selectedItem!.title).toBe("i2");
    selectPreviousItem(tree);
    expect(tree.selectedItem!.title).toBe("i1.1.1");
  });
});

describe("having a board", () => {
  let tree: Tree;
  beforeEach(() => {
    tree = createTree(
      createItemTree("Root", [
        createItemBoard("Board", [
          createItemTree("one", [createItemTree("one child")]),
          createItemTree("two", [createItemTree("two child")]),
          createItemTree("three"),
        ]),
        createItemTree("Tasks"),
      ])
    );
  });

  const expectSelectedItem = (title: string) =>
    expect(tree.selectedItem!.title).toBe(title);

  it("Board is selected by default", () => expectSelectedItem("Board"));

  describe("selecting item below", () => {
    beforeEach(() => selectNextItem(tree));

    it("selects one", () => expectSelectedItem("one"));

    describe("selecting item below", () => {
      beforeEach(() => selectNextItem(tree));

      it("selects one child", () => expectSelectedItem("one child"));

      describe("selecting item below", () => {
        beforeEach(() => selectNextItem(tree));

        it("selects Tasks", () => expectSelectedItem("Tasks"));
      });
    });
  });

  it("when Tasks is selected going up selects one child", () => {
    selectItem(tree, tree.root.children[1]);
    expectSelectedItem("Tasks");
    selectPreviousItem(tree);
    expectSelectedItem("one child");
  });

  it("when one is selected going right with ctrl selects two", () => {
    selectItem(tree, tree.root.children[0].children[0]);
    expectSelectedItem("one");
    selectTabRight(tree);
    expectSelectedItem("two");
  });

  it("when one child is selected going right with ctrl selects two", () => {
    selectItem(tree, tree.root.children[0].children[0].children[0]);
    expectSelectedItem("one child");
    selectTabRight(tree);
    expectSelectedItem("two");
  });

  it("when three is selected going right does nothing", () => {
    selectItem(tree, tree.root.children[0].children[2]);
    expectSelectedItem("three");
    selectTabRight(tree);
    expectSelectedItem("three");
  });

  it("when three is selected going left selects two", () => {
    selectItem(tree, tree.root.children[0].children[2]);
    expectSelectedItem("three");
    selectTabLeft(tree);
    expectSelectedItem("two");
  });
});

it("sample", () => {
  const music = createTree(
    createItemTree("Root", [
      createItemTree("Music", [
        createItemBoard("Ambient", [
          createItemTree("Carbon Based Lifeforms", [
            createItemTree("1998 - The Path"),
            createItemTree("2003 - Hydroponic Garden"),
            createItemTree("2006 - World Of Sleepers"),
            createItemTree("2010 - Interloper"),
            createItemTree("2011 - Twentythree"),
            createItemTree("2013 - Refuge"),
            createItemTree("2016 - Alt:01"),
            createItemTree("2017 - Derelicts"),
            createItemTree("2020 - ALT:02", [
              createItemTree("Metrosat 4 (Remastered)"),
              createItemTree("Supersede (First Version)"),
              createItemTree("Dreamshore Forest (Analog Remake)"),
              createItemTree("Vakna (Remastered)"),
              createItemTree("Vision (Revisited)"),
              createItemTree("Lemming Leisures (Cbl Carbonator Rmx)"),
              createItemTree("Silent Running (Live)"),
              createItemTree("Epicentre Second Movement (Remastered)"),
              createItemTree("Path of Least Dunka Dunka"),
              createItemTree("Tensor (Live)"),
              createItemTree("M (Live)"),
            ]),
          ]),
          createItemTree("Sync24", [
            createItemTree("Sync24 - Omnious [Full Album]"),
            createItemTree("Sync24 - Comfortable Void [Full Album]"),
            createItemTree("Sync24 - Source | Leftfield Records [Full Album]"),
          ]),
          createItemTree("Solar Fields", [
            createItemTree(
              "Solar Fields - Reflective Frequencies [Full Album]"
            ),
            createItemTree("Solar Fields - Random Friday [Full Album]"),
            createItemTree("Solar Fields - Origin # 1 | Full Album"),
            createItemTree("Solar Fields - Leaving Home [Full Album]"),
            createItemTree("Solar Fields - Origin # 03 (Full Album 2019)"),
            createItemTree("Solar Fields - Movements | Full Album"),
          ]),
        ]),
      ]),
      createItemTree("Tasks", [
        createItemTree("Viztly"),
        createItemTree("Viztly 3.0"),
        createItemTree("Northfork"),
      ]),
    ])
  );

  let mLive: Item | undefined;
  traverseOpenViews(music, (i) => {
    if (i.title === "M (Live)") mLive = i;
  });
  if (!mLive) throw new Error("Cant find M (Live) node");

  selectItem(music, mLive);
  selectNextItem(music);

  expect(music.selectedItem?.title).toBe("Tasks");
});
