import Tree from "../itemTree/tree";
import { drawInputFor, finishEdit, isEditing } from "../views/itemInput";
import Scrollbar from "./scrollbar";
import { TreeView } from "./treeView";

class KeyboardHandler {
  constructor(
    private tree: Tree,
    private list: TreeView,
    private scrollbar: Scrollbar,
    private onKeyHandled: () => void
  ) {
    document.addEventListener("keydown", this.onKey);
  }

  onKey = (e: KeyboardEvent) => {
    const { tree, scrollbar, onKeyHandled } = this;

    if (isEditing()) {
      if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Escape")
        finishEdit();
    } else {
      if (e.code === "ArrowDown") {
        if (e.shiftKey && e.altKey) tree.moveItemDown();
        else tree.selectNextItem();
      } else if (e.code === "ArrowUp") {
        if (e.shiftKey && e.altKey) tree.moveItemUp();
        else tree.selectPreviousItem();
      } else if (e.code === "ArrowLeft") {
        if (e.shiftKey && e.altKey) tree.moveItemLeft();
        else tree.selectParentOrCloseSelected();
      } else if (e.code === "ArrowRight") {
        if (e.shiftKey && e.altKey) tree.moveItemRight();
        else tree.selectFirstChildOrOpenSelected();
      } else if (e.code === "Backspace" && e.shiftKey && e.altKey) {
        tree.removeSelected();
      } else if (e.code === "KeyE") {
        const item = this.list.itemToRows.get(tree.selectedNode);
        if (item) drawInputFor(item, this.scrollbar, this.onKeyHandled);
        e.preventDefault();
      }
    }

    const item = this.list.itemToRows.get(tree.selectedNode);

    if (item && !scrollbar.isYPointOnScreen(item.position.y))
      scrollbar.centerScrollOn(item.position.y);

    onKeyHandled();
  };
}
export default KeyboardHandler;
