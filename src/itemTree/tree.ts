import Item from "./item";
import * as traversal from "./tree.traversal";
import * as movement from "./tree.movement";
import * as crud from "./tree.crud";

class Tree {
  selectedNode: Item;

  focusedNode: Item;

  itemPlayed?: Item;

  constructor(public root: Item) {
    this.focusedNode = root;
    this.selectedNode = root.children[0];
    this.updateRoot(root);
  }

  updateRoot = (anotherRoot: Item) => {
    this.root.children = anotherRoot.children;
    this.focusedNode = this.root;
    this.selectedNode = this.root.children[0];
    if (this.selectedNode) this.selectedNode.isSelected = true;
  };

  selectPreviousItem = () => {
    const parent = this.selectedNode.parent;
    if (parent) {
      const index = parent.children.indexOf(this.selectedNode);
      if (index > 0) {
        const previousItem = parent.children[index - 1];
        return this.selectItem(traversal.getLastNestedItem(previousItem));
      } else if (parent != this.root) this.selectItem(parent);
    }
  };

  selectNextItem = () => {
    const itemBelow = traversal.getItemBelow(this.selectedNode);
    if (itemBelow) {
      this.selectedNode.isSelected = false;
      itemBelow.isSelected = true;
      this.selectedNode = itemBelow;
    }
  };

  selectParentOrCloseSelected = () => {
    if (this.selectedNode.isOpen) this.selectedNode.isOpen = false;
    else {
      const parent = this.selectedNode.parent;
      if (parent && parent !== this.root) this.selectItem(parent);
    }
  };

  selectFirstChildOrOpenSelected = () => {
    if (!this.selectedNode.isOpen && this.selectedNode.children.length > 0)
      this.selectedNode.isOpen = true;
    else if (this.selectedNode.children.length > 0) {
      this.selectItem(this.selectedNode.children[0]);
    }
  };

  moveItemRight = () => movement.moveItemRight(this.selectedNode);
  moveItemLeft = () => movement.moveItemLeft(this.selectedNode);
  moveItemUp = () => movement.moveItemUp(this.selectedNode);
  moveItemDown = () => movement.moveItemDown(this.selectedNode);

  removeSelected = () => {
    const newSelection = crud.removeItem(this.selectedNode);
    this.selectItem(newSelection);
  };

  createItem = (): Item => {
    const newItem = new Item("");
    if (!this.selectedNode) crud.addItemInside(this.root, newItem);
    else if (this.selectedNode.children.length > 0)
      crud.addItemInside(this.selectedNode, newItem);
    else crud.addItemAfter(this.selectedNode, newItem);
    this.selectItem(newItem);
    return newItem;
  };

  focusOnSelected = () => {
    const { selectedNode } = this;
    this.focusOn(selectedNode);
  };

  focusOn = (item: Item) => {
    if (!item.isOpen && item.children.length > 0) item.isOpen = true;
    this.focusedNode = item;
    this.selectItem(item);
  };

  focusOnParent = () => {
    if (this.focusedNode.parent) this.focusedNode = this.focusedNode.parent;
  };

  flattenItemChildren = <T>(
    item: Item,
    mapper: (item: Item, level: number) => T
  ): T[] => traversal.flattenItemChildren(item, mapper);

  flattenItemWithChildren = <T>(
    item: Item,
    mapper: (item: Item, level: number) => T
  ): T[] => traversal.flattenItemWithChildren(item, mapper);

  private selectItem = (item: Item | undefined) => {
    if (this.selectedNode) this.selectedNode.isSelected = false;
    if (item) {
      this.selectedNode = item;
      this.selectedNode.isSelected = true;
    }
  };

  play = (item: Item) => {
    if (this.itemPlayed) this.itemPlayed.isPlaying = false;

    this.itemPlayed = item;
    if (this.itemPlayed) this.itemPlayed.isPlaying = true;
  };

  pause = () => {
    if (this.itemPlayed) this.itemPlayed.isPlaying = false;
  };

  resume = () => {
    if (this.itemPlayed) this.itemPlayed.isPlaying = true;
  };

  playNext = () => {
    if (this.itemPlayed) {
      const parent = this.itemPlayed.parent;
      if (parent) {
        const index = parent.children.indexOf(this.itemPlayed);
        if (index < parent.children.length - 1)
          this.play(parent.children[index + 1]);
      }
    }
  };

  playPrevious = () => {
    if (this.itemPlayed) {
      const parent = this.itemPlayed.parent;
      if (parent) {
        const index = parent.children.indexOf(this.itemPlayed);
        if (index > 0) this.play(parent.children[index - 1]);
      }
    }
  };
}

export default Tree;
