import { onKeyDown } from "./keyboard";
import { createItemTree, createTree, selectItem } from "./tree";

it("having a two items in a tree while second is selected removing selected removes it from a tree", () => {
  const tree = createTree(
    createItemTree("Root", [createItemTree("first"), createItemTree("second")])
  );

  selectItem(tree, tree.root.children[1]);
  onKeyDown(
    tree,
    {
      altKey: true,
      shiftKey: true,
      code: "Backspace",
    } as KeyboardEvent,
    new Map()
  );

  expect(tree.selectedItem!.title).toBe("first");
  expect(tree.root.children.length).toBe(1);
});

it("having a two items in a tree while first is selected pressing ArrowDown selects second one", () => {
  const tree = createTree(
    createItemTree("Root", [createItemTree("first"), createItemTree("second")])
  );

  onKeyDown(tree, { code: "ArrowDown" } as KeyboardEvent, new Map());

  expect(tree.selectedItem!.title).toBe("second");
});
