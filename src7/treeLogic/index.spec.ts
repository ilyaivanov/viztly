import * as actions from ".";
import { getItemByName, selectItemByName } from "./testUtils";
import { buildTree } from "./treeBuilder";

// GOING DOWN

it("having two items side by side moving down selects next sibling", () => {
  const tree = buildTree(`
    Item 1 # when selected going down selects Item 2
    Item 2
  `);

  expect(tree.selectedItem.title).toBe("Item 1");
  actions.goDown(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

it("when item is open and has children going down selected first child", () => {
  const tree = buildTree(`
   Item 1      # when selected going down selects Item 1.1
     Item 1.1  
   Item 2
  `);

  expect(tree.selectedItem.title).toBe("Item 1");
  actions.goDown(tree);
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

  actions.goDown(tree);
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

  actions.selectNextSibling(tree);
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

  actions.selectNextSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 2");
});

// GOING UP

it("having two items side by side up down selectes previous sibling", () => {
  const tree = buildTree(`
    Item 1 
    Item 2 # when selected going up selects prevous item
`);
  selectItemByName(tree, "Item 2");

  actions.goUp(tree);
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

  actions.goUp(tree);
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

  actions.selectPreviousSibling(tree);
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

  actions.selectPreviousSibling(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

// GOING LEFT

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
    Item 1          # when selected going left closes it
      Item 1.1
    Item 2          
`);

  actions.goLeft(tree);
  expect(tree.selectedItem.isOpen).toBe(false);
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
    Item 1 # when selected going left does nothing
    Item 2 
`);

  actions.goLeft(tree);
  expect(tree.selectedItem.title).toBe("Item 1");
});

it("going up while previuos sibling is open selects most nested item", () => {
  const tree = buildTree(`
     Item 1
       Item 1.1    # when selected going left selects parent
`);

  selectItemByName(tree, "Item 1.1");
  actions.goLeft(tree);
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

  actions.goRight(tree);

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

  actions.goRight(tree);

  expect(tree.selectedItem.title).toBe("Item 1.1.1");
});

it("s", () => {
  // 120 x 90

  120 / 90  //?
  480 / 360 //?
  320 / 180 //?
  const gridSize = 20;
  32 / 2 //?
  18 / 2 //?
  const wCells = 8;
  const hCells = 4;
  const w = gridSize * wCells;
  const h = gridSize * hCells;
  const r = `${w} x ${h}`;
  r; //?
});
