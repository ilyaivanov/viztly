import { c, spacings as sp, spacings } from "../designSystem";
import * as tree from "./itemTree";

export type FlatItemView = {
  item: Item;
  level: number;
  position: Vector;
  childrenBorder?: ChildrenBorder;

  textColor: string;
  //to think about
  itemHeight: number;
};

export type ChildrenBorder = {
  height: number;
  color: string;
};

export class FlatednedList {
  selectedItemIndex: number = 0;

  visibleItems: FlatItemView[] = [];

  constructor(public root: Item) {
    this.visibleItems = this.createItemViews(root, 0, sp.yBase);
    this.selectItemAtIndex(this.selectedItemIndex);
  }

  private createItemViews = (
    item: Item,
    level: number,
    startingOffset: number,
    shouldIncludeParent: boolean = false
  ) => {
    let offset = startingOffset;
    let views: FlatItemView[] = [];
    const viewItem = (item: Item, level: number) => {
      const itemHeight = level === 0 ? sp.level1ItemHeight : sp.itemHeight;
      offset += itemHeight / 2;

      const itemView: FlatItemView = {
        item,
        level,
        itemHeight,
        textColor: c.text,
        position: {
          y: offset,
          x: sp.xBase + level * sp.xStep,
        },
      };
      if (tree.hasVisibleChildren(item)) {
        itemView.childrenBorder = createBorder(itemView);
      }
      views.push(itemView);
      offset += itemHeight / 2;
      traverseChildren(item, level + 1);
    };

    const traverseChildren = (item: Item, level: number) =>
      item.isOpen && item.children.forEach((c) => viewItem(c, level));

    if (shouldIncludeParent) viewItem(item, level);
    else traverseChildren(item, level);
    return views;
  };

  selectParent = () =>
    this.selectItemAtIndex(this.getParentIndex(this.selectedItemIndex));

  selectNextItem = () => this.selectItemAtIndex(this.selectedItemIndex + 1);

  selectPreviousItem = () => this.selectItemAtIndex(this.selectedItemIndex - 1);

  private selectItemAtIndex = (index: number) => {
    if (this.visibleItems[index]) {
      this.visibleItems[this.selectedItemIndex].textColor = c.text;
      this.selectedItemIndex = index;
      this.visibleItems[this.selectedItemIndex].textColor = c.selectedItem;
    }
  };

  closeSelected = () => {
    const view = this.visibleItems[this.selectedItemIndex];

    const chilrenCount = tree.visibleChildrenCount(view.item);
    view.item.isOpen = false;

    this.removeVisibleItems(this.selectedItemIndex + 1, chilrenCount);

    this.updateBorders(this.selectedItemIndex);
  };

  openSelected = () => {
    const itemView = this.visibleItems[this.selectedItemIndex];
    itemView.item.isOpen = true;
    const index = this.visibleItems.indexOf(itemView) + 1;
    const views = this.createItemViews(
      itemView.item,
      itemView.level + 1,
      itemView.position.y + itemView.itemHeight / 2
    );
    this.appendToVisibleItems(index, views);
  };

  removeSelected = () => {
    const view = this.visibleItems[this.selectedItemIndex];

    const childrenCount = tree.visibleChildrenCount(view.item);

    tree.removeItem(this.root, view.item);
    this.removeVisibleItems(this.selectedItemIndex, childrenCount + 1);
    if (this.selectedItemIndex > 0)
      this.selectItemAtIndex(this.selectedItemIndex - 1);
    else if (this.visibleItems.length > 0) this.selectItemAtIndex(0);

    if (this.visibleItems[this.selectedItemIndex])
      //asumes items are of level2+
      this.updateBorders(this.selectedItemIndex);
  };

  createNewItemAfterSelected(): FlatItemView {
    const view = this.getSelectedItemView();

    const newItem: Item = {
      isOpen: true,
      title: "",
      children: [],
    };
    let newItemView: FlatItemView;

    if (tree.hasVisibleChildren(view.item)) {
      tree.addItemInside(view.item, newItem);
      newItemView = this.createItemViews(
        newItem,
        view.level + 1,
        view.position.y + view.itemHeight / 2,
        true
      )[0];
    } else {
      tree.addItemAfter(this.root, view.item, newItem);
      newItemView = this.createItemViews(
        newItem,
        view.level,
        view.position.y + view.itemHeight / 2,
        true
      )[0];
    }
    this.visibleItems.splice(this.selectedItemIndex + 1, 0, newItemView);
    this.selectItemAtIndex(this.selectedItemIndex + 1);
    this.moveAllItemsBy(this.selectedItemIndex + 1, newItemView.itemHeight);
    return newItemView;
  }

  private removeVisibleItems = (index: number, childrenCount: number) => {
    let offset = 0;
    for (var i = 0; i < childrenCount; i++) {
      offset += this.visibleItems[index + i].itemHeight;
    }

    this.visibleItems.splice(index, childrenCount);
    this.moveAllItemsBy(index, -offset);
  };

  private moveAllItemsBy = (index: number, offset: number) => {
    this.visibleItems
      .slice(index)
      .forEach((item) => (item.position.y += offset));
  };

  private appendToVisibleItems = (index: number, views: FlatItemView[]) => {
    this.visibleItems.splice(index, 0, ...views);

    //asumes items are of level2+
    const offsetAdded = views.length * sp.itemHeight;
    this.visibleItems
      .slice(index + views.length)
      .forEach((item) => (item.position.y += offsetAdded));

    this.updateBorders(this.selectedItemIndex);
  };

  private updateBorders = (index: number) => {
    let updateBorderAt = index;

    //TODO: should do this for closing item as well
    while (updateBorderAt !== -1) {
      const view = this.visibleItems[updateBorderAt];
      view.childrenBorder = tree.hasVisibleChildren(view.item)
        ? createBorder(view)
        : undefined;

      updateBorderAt = this.getParentIndex(updateBorderAt);
    }
  };

  private getParentIndex = (index: number) => {
    const item = this.visibleItems[index].item;
    const parentIndex = this.visibleItems.findIndex(
      (v) => v.item.children.indexOf(item) >= 0
    );
    return parentIndex;
  };

  getSelectedItemView = (): FlatItemView =>
    this.visibleItems[this.selectedItemIndex];

  getSelectedItem = (): Item => this.visibleItems[this.selectedItemIndex].item;

  getContentHeight = () =>
    this.visibleItems.reduce((sum, i) => sum + i.itemHeight, 0) +
    spacings.yBase * 2;
}

const createBorder = (item: FlatItemView): ChildrenBorder => {
  const lineHeight = (tree.visibleChildrenCount(item.item) + 1) * sp.itemHeight;
  return {
    color: c.line,
    height: lineHeight,
  };
};
