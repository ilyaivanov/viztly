import {
  Tree,
  createItemTree,
  createTree,
  selectNextItem,
  selectPreviousItem,
  selectItem,
} from "./core";

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

// i1
//   i1.1
//     i1.1.1
// i2
// i3
