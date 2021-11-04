import {
  flattenItemChildren,
  flattenItemWithChildren,
  getItemBelow,
  findParent,
  getLastNestedItem,
} from ".";
import Item from "./item";

class ItemsTree {
  selectedNode: Item;
  focusedNode: Item;
  constructor(public root: Item) {
    this.focusedNode = root;
    this.selectedNode = root.children[0];
    this.selectedNode.isSelected = true;
  }

  isRoot = (item: Item) => item === this.root;

  selectPreviousItem = () => {
    const parent = findParent(this.root, this.selectedNode);
    if (parent) {
      const index = parent.children.indexOf(this.selectedNode);
      if (index > 0) {
        const previousItem = parent.children[index - 1];
        return this.selectItem(getLastNestedItem(previousItem));
      } else if (parent != this.root) this.selectItem(parent);
    }
  };

  selectNextItem = () => {
    const itemBelow = getItemBelow(this.root, this.selectedNode);
    if (itemBelow) {
      this.selectedNode.isSelected = false;
      itemBelow.isSelected = true;
      this.selectedNode = itemBelow;
    }
  };

  selectParentOrCloseSelected = () => {
    if (this.selectedNode.isOpen) this.selectedNode.isOpen = false;
    else {
      const parent = findParent(this.root, this.selectedNode);
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

  flattenItemChildren = <T>(
    item: Item,
    mapper: (item: Item, level: number) => T
  ): T[] => flattenItemChildren(item, mapper);

  flattenItemWithChildren = <T>(
    item: Item,
    mapper: (item: Item, level: number) => T
  ): T[] => flattenItemWithChildren(item, mapper);

  private selectItem = (item: Item) => {
    this.selectedNode.isSelected = false;
    this.selectedNode = item;
    this.selectedNode.isSelected = true;
  };
}

export default ItemsTree;
