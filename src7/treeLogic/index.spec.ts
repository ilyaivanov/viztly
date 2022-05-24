import { forEachOpenChild, goDown, goLeft, goRight, goUp } from ".";
import * as t from "../types";

// GOING DOWN

// Item 1  <- when selected going down
// Item 2  <- selects this item
it("having two items side by side moving down selects next sibling", () => {
  const tree = createTree([createItem("Item 1"), createItem("Item 2")]);

  expect(tree.selectedItem.title).toBe("Item 1");
  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

// Item 1      <- when selected going down
//   Item 1.1  <- selects this item
// Item 2
it("when item is open and has children going down selected first child", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1")]),
    createItem("Item 2"),
  ]);

  expect(tree.selectedItem.title).toBe("Item 1");
  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 1.1");
});

// Item 1
//   Item 1.1
//     Item 1.1.1  <- when selected going down
// Item 2          <- selects this item
it("when last child is selected going down selects sibling of first non-last parent", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1", [createItem("Item 1.1.1")])]),
    createItem("Item 2"),
  ]);

  selectItemByName(tree, "Item 1.1.1");

  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

// GOING UP

// Item 1
// Item 2  <- when selected going up selects prevous item
it("having two items side by side up down selectes previous sibling", () => {
  const tree = createTree([createItem("Item 1"), createItem("Item 2")]);
  selectItemByName(tree, "Item 2");

  goUp(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// Item 1
//   Item 1.1
//     Item 1.1.1
// Item 2          <- when selected going up selects parent
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1", [createItem("Item 1.1.1")])]),
    createItem("Item 2"),
  ]);

  selectItemByName(tree, "Item 2");

  goUp(tree);
  expect(tree.selectedItem.title).toBe("Item 1.1.1");
});

// GOING LEFT

// Item 1          <- when selected going left closes it
//   Item 1.1
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1")]),
    createItem("Item 2"),
  ]);

  goLeft(tree);
  expect(tree.selectedItem.isOpen).toBe(false);
});

// Item 1          <- when selected going left does nothing
// Item 2
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([createItem("Item 1"), createItem("Item 2")]);

  goLeft(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// Item 1
//   Item 1.1      <- when selected going left selects parent
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1")]),
    createItem("Item 2"),
  ]);

  selectItemByName(tree, "Item 1.1");
  goLeft(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// GOING RIGHT

// Item 1
//   Item 1.1      <- when selected and closed going right opens
//     Item 1.1.1
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([
    createItem("Item 1", [
      createItem("Item 1.1", [createItem("Item 1.1.1")], { isOpen: false }),
    ]),
    createItem("Item 2"),
  ]);

  selectItemByName(tree, "Item 1.1");

  expect(tree.selectedItem.isOpen).toBe(false);

  goRight(tree);

  expect(tree.selectedItem.title).toBe("Item 1.1");
  expect(tree.selectedItem.isOpen).toBe(true);
});

// Item 1
//   Item 1.1      <- when selected going right selects first child
//     Item 1.1.1
it("going up while previuos sibling is open selects most nested item", () => {
  const tree = createTree([
    createItem("Item 1", [createItem("Item 1.1", [createItem("Item 1.1.1")])]),
    createItem("Item 2"),
  ]);

  selectItemByName(tree, "Item 1.1");

  goRight(tree);

  expect(tree.selectedItem.title).toBe("Item 1.1.1");
});

const selectItemByName = (tree: t.Tree, name: string) => {
  let itemFound: t.Item | undefined = undefined;
  forEachOpenChild(tree.root, (item) => {
    if (item.title === name) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  else tree.selectedItem = itemFound;
};

//
//
//
//
//
//
//
//
//
//
// UTILS
const createTree = (items: t.Item[]): t.Tree => {
  const root = createRoot(items);
  return {
    root,
    selectedItem: root.children[0],
    focusedItem: root,
  };
};

const createRoot = (children: t.Item[]) => createItem("Root", children);

const createItem = (
  title: string,
  children: t.Item[] = [],
  options: Partial<t.Item> = {}
) => {
  const item: t.Item = {
    title,
    isOpen: children.length > 0,
    view: "tree",
    children,
    type: "folder",
    id: Math.random() + "",
    ...options,
  };
  setChildren(item, children);
  return item;
};

const setChildren = (item: t.Item, children: t.Item[]) => {
  item.children = children;
  children.forEach((i) => (i.parent = item));
};

const list = (prefix: string, count: number): t.Item[] =>
  Array.from(new Array(count)).map((_, index) =>
    createItem(`${prefix}${index + 1}`)
  );
