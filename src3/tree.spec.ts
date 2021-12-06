import {
  Tree,
  createItemTree,
  createTree,
  selectNextItem,
  selectPreviousItem,
  selectItem,
  createItemBoard,
  selectTabRight,
  selectTabLeft,
  Item,
} from "./tree";

const createOpenItem = (title: string, children?: Item[]): Item => {
  const item = createItemTree(title, children);
  item.isOpen = !!children && children.length > 0;
  return item;
};
const createOpenBoardItem = (title: string, children?: Item[]): Item => {
  const item = createItemBoard(title, children);
  item.isOpen = !!children && children.length > 0;
  return item;
};

describe("Having a bit of nested items", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree(
      createOpenItem("root", [
        createOpenItem("i1", [
          createOpenItem("i1.1", [createOpenItem("i1.1.1")]),
        ]),
        createOpenItem("i2"),
        createOpenItem("i3"),
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
      createOpenItem("Root", [
        createOpenBoardItem("Board", [
          createOpenItem("one", [createOpenItem("one child")]),
          createOpenItem("two", [createOpenItem("two child")]),
          createOpenItem("three"),
        ]),
        createOpenItem("Tasks"),
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

it("having a board as a single element going down from latest child of the first item selects item below board", () => {
  const music = createTree(
    createItemTree("Root", [
      createItemTree("Music", [
        createItemBoard("Ambient", [
          createItemTree("Carbon Based Lifeforms", [
            createItemTree("2020 - ALT:02", [createItemTree("M (Live)")]),
          ]),
          createItemTree("Sync24"),
        ]),
      ]),
      createItemTree("Tasks"),
    ])
  );

  let mLive =
    music.root.children[0].children[0].children[0].children[0].children[0];

  selectItem(music, mLive);
  selectNextItem(music);

  expect(music.selectedItem?.title).toBe("Tasks");
});

it("board with a first child without any subchildren selecting next items selects after board", () => {
  const music = createTree(
    createItemTree("Root", [
      createItemTree("Music", [
        createItemBoard("Ambient", [
          createItemTree("Carbon Based Lifeforms"),
          createItemTree("Sync24"),
        ]),
      ]),
      createItemTree("Tasks"),
    ])
  );

  selectItem(music, music.root.children[0].children[0].children[0]);
  expect(music.selectedItem!.title).toBe("Carbon Based Lifeforms");
  selectNextItem(music);
  expect(music.selectedItem!.title).toBe("Tasks");
});
