import * as tree from ".";
import { createBoard, createItem, createRoot } from "./tree.crud";
import { forEachOpenChild } from "./tree.traversal";

it("having two nodes going down selects second", () => {
  tree.init(
    tree.createTree(createRoot([createItem("Item 1"), createItem("Item 2")]))
  );

  onSelectionChange(() => tree.goDown(), "Item 1", "Item 2");
});

// Item 1
// My Board
//   Board Child1             Board Child2
//     Board Child 1.1          Board Child2.1
//     Board Child 1.2
//       Board Child 1.2.1
// Item 3

describe("Having a board view with a nested items", () => {
  beforeEach(() =>
    tree.init(
      tree.createTree(
        createRoot([
          createItem("Item 1"),
          createBoard("My Board", [
            createItem("Board Child1", [
              createItem("Board Child1.1"),
              createItem("Board Child1.2", [createItem("Board Child1.2.1")]),
            ]),
            createItem("Board Child2", [createItem("Board Child2.1")]),
          ]),
          createItem("Item 3"),
        ])
      )
    )
  );

  describe("when Board Child1 is selected", () => {
    beforeEach(() => tree.selectItem(findByName("Board Child1")));

    it("going to right board tab selectes Board Child2", () =>
      onSelectionChange(tree.goToRightTab, "Board Child1", "Board Child2"));
  });

  describe("when Board Child1.2.1 is selected", () => {
    beforeEach(() => tree.selectItem(findByName("Board Child1.2.1")));

    it("going to right board tab selectes Board Child2", () =>
      onSelectionChange(tree.goToRightTab, "Board Child1.2.1", "Board Child2"));
  });

  describe("when Board Child2.1 is selected", () => {
    beforeEach(() => tree.selectItem(findByName("Board Child2.1")));

    it("going to left board tab selectes Board Child1", () =>
      onSelectionChange(tree.goToLeftTab, "Board Child2.1", "Board Child1"));
  });

  describe("when Board Child2 is selected", () => {
    beforeEach(() => tree.selectItem(findByName("Board Child2")));

    it("going up selects My Board", () =>
      onSelectionChange(tree.goUp, "Board Child2", "My Board"));
  });
});

const findByName = (name: string): Item => {
  let res: Item | undefined;

  forEachOpenChild(tree.getRoot(), (i) => {
    if (i.title === name) res = i;
  });
  if (!res) throw new Error(`Can't find item with name ${name}`);
  return res;
};

const onSelectionChange = (
  cb: () => void,
  currentSelection: string,
  expectedSelection: string
) => {
  expect(tree.getSelected()!.title).toBe(currentSelection);

  cb();

  expect(tree.getSelected()!.title).toBe(expectedSelection);
};
