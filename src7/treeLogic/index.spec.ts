import {
  forEachOpenChild,
  goDown,
  selectNextSibling,
  goLeft,
  goRight,
  goUp,
  selectPreviousSibling,
} from ".";
import * as t from "../types";
import { buildTree } from "./treeBuilder";

// GOING DOWN

it("having two items side by side moving down selects next sibling", () => {
  const tree = buildTree(`
    Item 1 # when selected going down selects Item 2
    Item 2
  `);

  expect(tree.selectedItem.title).toBe("Item 1");
  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

it("when item is open and has children going down selected first child", () => {
  const tree = buildTree(`
   Item 1      # when selected going down selects Item 1.1
     Item 1.1  
   Item 2
  `);

  expect(tree.selectedItem.title).toBe("Item 1");
  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 1.1");
});

it("when last child is selected going down selects sibling of first non-last parent", () => {
  const tree = buildTree(`
    Item 1
      Item 1.1
        Item 1.1.1  # when selected going down selectes Item 2
    Item 2 
 `);

  selectItemByName(tree, "Item 1.1.1");

  goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

it("select next sibling jumps over open items and selectes next sibling", () => {
  const tree = buildTree(`
   Item 1
     Item 1.1      # when selected going down with ctrl selectes Item 1.2
       Item 1.1.1
     Item 1.2
 `);

  selectItemByName(tree, "Item 1.1");

  selectNextSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 1.2");
});

it("select next sibling selects parent sibling if last item in context", () => {
  const tree = buildTree(`
     Item 1
       Item 1.1      # when selected going down with ctrl selectes Item 2
         Item 1.1.1
     Item 2
 `);

  selectItemByName(tree, "Item 1.1");

  selectNextSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

// GOING UP

it("having two items side by side up down selectes previous sibling", () => {
  const tree = buildTree(`
    Item 1 
    Item 2 # when selected going up selects prevous item
`);
  selectItemByName(tree, "Item 2");

  goUp(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
     Item 1
       Item 1.1
         Item 1.1.1
     Item 2          # when selected going up selects parent
`);

  selectItemByName(tree, "Item 2");

  goUp(tree);
  expect(tree.selectedItem.title).toBe("Item 1.1.1");
});

it("going up with ctrl jumps over prevously open nested items", () => {
  const tree = buildTree(`
   Item 1
     Item 1.1     
       Item 1.1.1
     Item 1.2     # when selected going up with ctrl selectes Item 1.1
 `);

  selectItemByName(tree, "Item 1.2");

  selectPreviousSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 1.1");
});

it("going up with ctrl selects parent when first in context", () => {
  const tree = buildTree(`
   Item 1
     Item 1.1      # when selected going up with ctrl selectes Item 1
       Item 1.1.1
     Item 1.2     
 `);

  selectItemByName(tree, "Item 1.1");

  selectPreviousSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// GOING LEFT

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
    Item 1          # when selected going left closes it
      Item 1.1
    Item 2          
`);

  goLeft(tree);
  expect(tree.selectedItem.isOpen).toBe(false);
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
    Item 1 # when selected going left does nothing
    Item 2 
`);

  goLeft(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
     Item 1
       Item 1.1    # when selected going left selects parent
`);

  selectItemByName(tree, "Item 1.1");
  goLeft(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// GOING RIGHT

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
      Item 1
        Item 1.1      # when closed and selected going right opens it
          Item 1.1.1
`);

  getItemByName(tree, "Item 1.1").isOpen = false;

  selectItemByName(tree, "Item 1.1");

  expect(tree.selectedItem.isOpen).toBe(false);

  goRight(tree);

  expect(tree.selectedItem.title).toBe("Item 1.1");
  expect(tree.selectedItem.isOpen).toBe(true);
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
    Item 1
      Item 1.1      # when selected going right selects first child
        Item 1.1.1
`);

  selectItemByName(tree, "Item 1.1");

  goRight(tree);

  expect(tree.selectedItem.title).toBe("Item 1.1.1");
});

const selectItemByName = (tree: t.Tree, name: string) => {
  tree.selectedItem = getItemByName(tree, name);
};

const getItemByName = (tree: t.Tree, name: string): t.Item => {
  let itemFound: t.Item | undefined = undefined;
  forEachOpenChild(tree.root, (item) => {
    if (item.title === name) itemFound = item;
  });
  if (!itemFound) throw new Error(`Item '${name}' not found`);
  return itemFound;
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
