import ItemsTree from "../itemTree/tree";

class KeyboardHandler {
  constructor(private tree: ItemsTree, private onKeyHandled: () => void) {
    document.addEventListener("keydown", this.onKey);
  }

  onKey = (e: KeyboardEvent) => {
    const { tree, onKeyHandled } = this;

    if (e.code === "ArrowDown") {
      tree.selectNextItem();
    }

    if (e.code === "ArrowUp") {
      tree.selectPreviousItem();
    }
    if (e.code === "ArrowLeft") {
      tree.selectParentOrCloseSelected();
    }
    if (e.code === "ArrowRight") {
      tree.selectFirstChildOrOpenSelected();
    }

    // const { root } = list;
    // if (
    //   (e.code === "ArrowLeft" && e.altKey && e.shiftKey) ||
    //   (e.code === "Tab" && e.shiftKey)
    // ) {
    //   e.preventDefault();
    //   tree.moveItemLeft(root, list.getSelectedItem());
    //   list.updateRows();
    // } else if (
    //   (e.code === "ArrowRight" && e.altKey && e.shiftKey) ||
    //   e.code === "Tab"
    // ) {
    //   e.preventDefault();
    //   tree.moveItemRight(root, list.getSelectedItem());
    //   list.updateRows();
    // } else if (e.code === "ArrowRight" && e.altKey) {
    //   scrollbar.transformY = 0;
    //   list.setFocus(list.getSelectedItemRow().item);
    //   e.preventDefault();
    // } else if (e.code === "ArrowLeft" && e.altKey) {
    //   if (!tree.isRoot(list.itemFocused)) {
    //     const parent = tree.findParent(list.root, list.itemFocused);
    //     if (parent) {
    //       list.setFocus(parent);
    //     }
    //     e.preventDefault();
    //   }
    // } else if (e.code === "ArrowUp" && e.altKey && e.shiftKey) {
    //   tree.moveItemUp(root, list.getSelectedItem());
    //   list.updateRows();
    // } else if (e.code === "ArrowDown" && e.altKey && e.shiftKey) {
    //   tree.moveItemDown(root, list.getSelectedItem());
    //   list.updateRows();
    // } else if (e.code === "ArrowDown") this.selectItemBelow();
    // else if (e.code === "ArrowUp") this.selectItemAbove();
    // else if (e.code === "ArrowLeft") {
    //   if (this.selectedItem.isOpen) list.closeSelectedItem();
    //   else this.selectParent();
    // } else if (e.code === "ArrowRight") {
    //   if (this.selectedItem.isOpen) this.selectChild();
    //   else list.openSelectedItem();
    // } else if (e.code === "Enter") {
    //   list.createNewItemAfterSelected();
    //   drawInputFor(list.getSelectedItemRow(), scrollbar, this.onKeyHandled);
    // } else if (e.code === "KeyE") {
    //   drawInputFor(list.getSelectedItemRow(), scrollbar, this.onKeyHandled);

    //   //this prevents setting 'e' character as first chart
    //   e.preventDefault();
    // } else if (e.code === "Backspace" && e.altKey && e.shiftKey)
    //   list.removeSelectedItem();

    // if (!scrollbar.isYPointOnScreen(list.getSelectedItemRow().position.y))
    //   scrollbar.centerScrollOn(list.getSelectedItemRow().position.y);

    onKeyHandled();
  };
}
export default KeyboardHandler;
