import Item from "../itemTree/item";
import Tree from "../itemTree/tree";
import Footer from "../views/footer";
import { drawInputFor, finishEdit, isEditing } from "../views/itemInput";
import { showModal } from "../views/modal";
import Scrollbar from "./scrollbar";
import { loadFromFirestore, saveToFirestore } from "./stateReader";
import { TreeView } from "./treeView";
import * as player from "./youtubePlayer";
import * as modal from "../views/modal";

class KeyboardHandler {
  constructor(
    private tree: Tree,
    private list: TreeView,
    private footer: Footer,
    private scrollbar: Scrollbar,
    private onKeyHandled: () => void
  ) {
    document.addEventListener("keydown", this.onKey);

    player.addEventListener("videoEnd", () => {
      this.playNext();
      this.onKeyHandled();
    });
  }

  onKey = (e: KeyboardEvent) => {
    const { tree, list, scrollbar, onKeyHandled } = this;

    if (isEditing()) {
      if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Escape")
        finishEdit();
    } else if (modal.isShown()) {
      if (e.code === "Escape") modal.hide();
      if (e.code === "ArrowDown") modal.selectNext();
      else if (e.code === "ArrowUp") modal.selectPrevious();
      else if (e.code === "Enter" && e.ctrlKey) {
        const { item } = modal.getSelectedItem();
        if (item && item.videoId) {
          tree.play(item);
          player.play(item.videoId);
        }
      } else if (e.code === "Enter") {
        const { item } = modal.getSelectedItem();
        if (item) {
          tree.focusOn(item);
          modal.hide();
        }
      }
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
          this.togglePlayStatus(tree.itemPlayed);
        } else {
          tree.play(tree.selectedNode);
          if (tree.selectedNode.videoId) player.play(tree.selectedNode.videoId);
        }
        if (!this.footer.isShown) this.footer.show();
      } else if (e.code === "KeyX") {
        if (tree.itemPlayed) {
          this.togglePlayStatus(tree.itemPlayed);
        }
      } else if (e.code === "KeyC") {
        this.playNext();
      } else if (e.code === "KeyZ") {
        this.playPrevious();
      } else if (e.code === "KeyS" && e.ctrlKey) {
        saveToFirestore(tree.root);
        e.preventDefault();
      } else if (e.code === "KeyL" && e.ctrlKey) {
        loadFromFirestore().then((root) => {
          tree.updateRoot(root);
          onKeyHandled();
        });
        e.preventDefault();
      } else if (e.code === "KeyM") {
        this.footer.toggleYoutubeVisibility();
      } else if (e.code === "KeyF" && e.ctrlKey) {
        showModal(tree, onKeyHandled);
        e.preventDefault();
      }
    }

    onKeyHandled();

    const item = list.itemToRows.get(tree.selectedNode);

    if (item && !scrollbar.isYPointOnScreen(item.position.y))
      scrollbar.centerScrollOn(item.position.y);
  };

  //player
  togglePlayStatus = (item: Item) => {
    if (item.isPlaying) this.pause();
    else this.resume();
  };

  playNext = () => {
    const { tree } = this;
    if (tree.itemPlayed) {
      const currentItem = tree.itemPlayed;
      tree.playNext();
      if (currentItem !== tree.itemPlayed && tree.itemPlayed.videoId) {
        player.play(tree.itemPlayed.videoId);
      }
    }
  };
  playPrevious = () => {
    const { tree } = this;
    if (tree.itemPlayed) {
      const currentItem = tree.itemPlayed;
      tree.playPrevious();
      if (currentItem !== tree.itemPlayed && tree.itemPlayed.videoId) {
        player.play(tree.itemPlayed.videoId);
      }
    }
  };
  pause = () => {
    player.pause();
    this.tree.pause();
  };
  resume = () => {
    player.resume();
    this.tree.resume();
  };
}

export default KeyboardHandler;
