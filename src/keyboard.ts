import { List } from "./list/list";
import Scrollbar from "./list/scrollbar";
import * as tree from "./itemTree";
import { drawInputFor } from "./list/itemInput";

class KeyboardHandler {
  constructor(
    private list: List,
    private scrollbar: Scrollbar,
    private onKeyHandled: () => void
  ) {
    document.addEventListener("keydown", this.onKey);
  }

  onKey = (e: KeyboardEvent) => {
    const { list, scrollbar, onKeyHandled } = this;
    const { root } = list;
    if (
      (e.code === "ArrowLeft" && e.altKey && e.shiftKey) ||
      (e.code === "Tab" && e.shiftKey)
    ) {
      e.preventDefault();
      tree.moveItemLeft(root, list.getSelectedItem());
      list.updateRows();
    } else if (
      (e.code === "ArrowRight" && e.altKey && e.shiftKey) ||
      e.code === "Tab"
    ) {
      e.preventDefault();
      tree.moveItemRight(root, list.getSelectedItem());
      list.updateRows();
    } else if (e.code === "ArrowRight" && e.altKey) {
      scrollbar.transformY = 0;
      list.setFocus(list.getSelectedItemRow().item);
      e.preventDefault();
    } else if (e.code === "ArrowLeft" && e.altKey) {
      if (!tree.isRoot(list.itemFocused)) {
        const parent = tree.findParent(list.root, list.itemFocused);
        if (parent) {
          list.setFocus(parent);
        }
        e.preventDefault();
      }
    } else if (e.code === "ArrowUp" && e.altKey && e.shiftKey) {
      tree.moveItemUp(root, list.getSelectedItem());
      list.updateRows();
    } else if (e.code === "ArrowDown" && e.altKey && e.shiftKey) {
      tree.moveItemDown(root, list.getSelectedItem());
      list.updateRows();
    } else if (e.code === "ArrowDown") list.selectNextItem();
    else if (e.code === "ArrowUp") list.selectPreviousItem();
    else if (e.code === "ArrowLeft") {
      if (list.getSelectedItemRow().item.isOpen) list.closeSelectedItem();
      else list.selectParentItem();
    } else if (e.code === "ArrowRight") {
      if (list.getSelectedItemRow().item.isOpen) list.selectNextItem();
      else list.openSelectedItem();
    } else if (e.code === "Enter") {
      list.createNewItemAfterSelected();
      drawInputFor(list.getSelectedItemRow(), scrollbar, this.onKeyHandled);
    } else if (e.code === "KeyE") {
      drawInputFor(list.getSelectedItemRow(), scrollbar, this.onKeyHandled);

      //this prevents setting 'e' character as first chart
      e.preventDefault();
    } else if (e.code === "Backspace" && e.altKey && e.shiftKey)
      list.removeSelectedItem();

    if (!scrollbar.isYPointOnScreen(list.getSelectedItemRow().position.y))
      scrollbar.centerScrollOn(list.getSelectedItemRow().position.y);

    onKeyHandled();
  };
}
export default KeyboardHandler;
