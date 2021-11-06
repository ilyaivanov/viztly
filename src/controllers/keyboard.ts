import Tree from "../itemTree/tree";
import { drawInputFor, finishEdit, isEditing } from "../views/itemInput";
import Scrollbar from "./scrollbar";
import { TreeView } from "./treeView";
import { pause, play, resume } from "./youtubePlayer";

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
    const { tree, list, scrollbar, onKeyHandled } = this;

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
        else if (e.altKey) tree.focusOnParent();
        else tree.selectParentOrCloseSelected();
      } else if (e.code === "ArrowRight") {
        if (e.shiftKey && e.altKey) tree.moveItemRight();
        else if (e.altKey) tree.focusOnSelected();
        else tree.selectFirstChildOrOpenSelected();
      } else if (e.code === "Backspace" && e.shiftKey && e.altKey) {
        tree.removeSelected();
      } else if (e.code === "KeyE") {
        const item = list.itemToRows.get(tree.selectedNode);
        if (item) drawInputFor(item, scrollbar, onKeyHandled);
        e.preventDefault();
      } else if (e.code === "Enter") {
        const newItem = tree.createItem();
        list.updateRows();
        const item = list.itemToRows.get(newItem);
        if (item) drawInputFor(item, scrollbar, onKeyHandled);
      } else if (e.code === "Space") {
        if (tree.itemPlayed && tree.itemPlayed == tree.selectedNode) {
          if (tree.itemPlayed.isPlaying) {
            pause();
            tree.pause();
          } else {
            resume();
            tree.resume();
          }
        } else {
          tree.play(tree.selectedNode);
          if (tree.selectedNode.videoId) play(tree.selectedNode.videoId);
        }
      } else if (e.code === "KeyX") {
        if (tree.itemPlayed) {
          if (tree.itemPlayed.isPlaying) {
            pause();
            tree.pause();
          } else {
            resume();
            tree.resume();
          }
        }
      }
    }

    onKeyHandled();

    const item = list.itemToRows.get(tree.selectedNode);

    if (item && !scrollbar.isYPointOnScreen(item.position.y))
      scrollbar.centerScrollOn(item.position.y);
  };
}
export default KeyboardHandler;
