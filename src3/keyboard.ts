import { save } from "./persistance";
import * as t from "./tree";

export const onKeyDown = async (tree: t.Tree, e: KeyboardEvent) => {
  if (e.code === "Space") {
    if (e.ctrlKey) {
      const s = tree.selectedItem;
      if (s) {
        s.view = s.view === "board" ? "tree" : "board";
      }
    } else {
      const itemToRemove = tree.selectedItem;
      const parent = itemToRemove?.parent;
      if (itemToRemove && parent) {
        t.selectPreviousItem(tree);
        parent.children = parent.children.filter((i) => i !== itemToRemove);
      }
    }
  } else if (e.code === "ArrowRight") {
    if (e.ctrlKey) t.selectTabRight(tree);
    else if (
      tree.selectedItem &&
      !tree.selectedItem.isOpen &&
      tree.selectedItem.children.length > 0
    ) {
      t.openItem(tree.selectedItem);
    } else if (tree.selectedItem) t.selectFirstChild(tree, tree.selectedItem);
  } else if (e.code === "ArrowLeft") {
    if (e.ctrlKey) t.selectTabLeft(tree);
    else if (tree.selectedItem && tree.selectedItem.isOpen) {
      t.closeItem(tree.selectedItem);
    } else if (tree.selectedItem) t.selectParent(tree, tree.selectedItem);
  } else if (e.code === "ArrowDown") t.selectNextItem(tree);
  else if (e.code === "ArrowUp") t.selectPreviousItem(tree);
  else if (e.ctrlKey && e.code === "KeyS") {
    e.preventDefault();
    save(tree);
  }
};
