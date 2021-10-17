import { c, spacings } from "../designSystem";
import {
  flattenItemChildren,
  removeItem,
  visibleChildrenCount,
} from "../itemTree";
import { animateColor } from "../infra/animations";

//VIEW
export type ItemRow = {
  item: Item;
  level: number;
  position: Vector;
  childrenHeight: number;
  childrenColor: string;
  color: string;
};

export class List {
  rows: ItemRow[];

  selectedItemIndex = 0;

  constructor(public root: Item) {
    this.rows = this.createRows(root, spacings.yBase, 0);
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  }

  public selectNextItem() {
    if (this.selectedItemIndex < this.rows.length - 1)
      this.changeItemSelection(this.selectedItemIndex + 1);
  }
  public selectPreviousItem() {
    if (this.selectedItemIndex > 0)
      this.changeItemSelection(this.selectedItemIndex - 1);
  }

  public removeSelectedItem() {
    const itemToRemoveAt = this.selectedItemIndex;
    const view = this.getSelectedItemRow();

    if (this.selectedItemIndex > 0)
      this.changeItemSelection(this.selectedItemIndex - 1);
    else if (this.selectedItemIndex === 0)
      this.changeItemSelection(this.selectedItemIndex + 1);

    removeItem(this.root, view.item);

    const itemsToRemove = visibleChildrenCount(view.item) + 1;
    this.rows.splice(itemToRemoveAt, itemsToRemove);

    const heightToMove = this.getItemHeight(view) + view.childrenHeight;
    this.rows.slice(itemToRemoveAt).forEach((row) => {
      row.position.y -= heightToMove;
    });

    this.updateChildrenHeightForSelectedItemAndParents();
  }

  public closeSelectedItem() {
    const childs = visibleChildrenCount(this.getSelectedItemRow().item);
    this.rows.splice(this.selectedItemIndex + 1, childs);

    const height = this.getSelectedItemRow().childrenHeight;
    this.rows[this.selectedItemIndex].childrenHeight = 0;
    this.rows[this.selectedItemIndex].item.isOpen = false;

    this.rows.slice(this.selectedItemIndex + 1).forEach((row) => {
      row.position.y -= height;
    });

    this.updateChildrenHeightForSelectedItemAndParents();
  }

  public openSelectedItem() {
    const view = this.rows[this.selectedItemIndex];
    const { item } = view;
    item.isOpen = true;
    const rows = this.createRows(
      item,
      view.position.y +
        (view.level === 0
          ? spacings.zeroLevelItemHeight / 2
          : spacings.itemHeight / 2) +
        spacings.itemHeight / 2,
      view.level + 1
    );
    this.rows.splice(this.selectedItemIndex + 1, 0, ...rows);

    const count = visibleChildrenCount(item);
    view.childrenHeight = count * spacings.itemHeight;

    this.rows.slice(this.selectedItemIndex + count + 1).forEach((row) => {
      row.position.y += view.childrenHeight;
    });

    this.updateChildrenHeightForSelectedItemAndParents();
  }

  //hugely inefficient
  private updateChildrenHeightForSelectedItemAndParents() {
    let parentIndex = this.selectedItemIndex;

    while (parentIndex !== -1) {
      this.rows[parentIndex].childrenHeight =
        visibleChildrenCount(this.rows[parentIndex].item) * spacings.itemHeight;

      parentIndex = this.getParentIndex(parentIndex);
    }
  }

  public selectParentItem() {
    const parentIndex = this.getParentIndex(this.selectedItemIndex);
    if (parentIndex != -1) this.changeItemSelection(parentIndex);
  }

  public getSelectedItemRow() {
    return this.rows[this.selectedItemIndex];
  }

  public getContentHeight() {
    const lastItem = this.rows[this.rows.length - 1];
    const lastITemHeight =
      lastItem.level === 0 ? spacings.zeroLevelItemHeight : spacings.itemHeight;
    return lastItem.position.y + lastITemHeight + spacings.yBase;
  }

  private changeItemSelection(index: number) {
    this.rows[this.selectedItemIndex];
    const currentParent = this.getParentItemView(
      this.rows[this.selectedItemIndex].item
    );
    const nextParent = this.getParentItemView(this.rows[index].item);

    if (currentParent !== nextParent) {
      if (currentParent) {
        animateColor(currentParent.childrenColor, c.line, (val) => {
          currentParent.childrenColor = val;
        });
      }
      if (nextParent) {
        animateColor(nextParent.childrenColor, c.lineSelected, (val) => {
          nextParent.childrenColor = val;
        });
      }
    }
    this.rows[this.selectedItemIndex].color = c.text;
    this.selectedItemIndex = index;
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  }

  private createRows = (
    parent: Item,
    startingOffset: number,
    startingLevel: number
  ) => {
    let offset = startingOffset;
    let isFirstItem = true;
    const createRow = (item: Item, lvl: number): ItemRow => {
      const level = lvl + startingLevel;
      const halfOfHeight =
        level === 0
          ? spacings.zeroLevelItemHeight / 2
          : spacings.itemHeight / 2;

      if (!isFirstItem) offset += halfOfHeight;

      isFirstItem = false;

      const res: ItemRow = {
        item,
        level,
        childrenHeight: this.getChildrenHeight(item),
        position: { x: spacings.xBase + level * spacings.xStep, y: offset },
        color: c.text,
        childrenColor: c.line,
      };
      offset += halfOfHeight;
      return res;
    };
    return flattenItemChildren(parent, createRow);
  };

  // assumes all children are below level 0
  private getChildrenHeight = (item: Item): number =>
    flattenItemChildren(item, () => spacings.itemHeight).reduce(
      (sum, val) => sum + val,
      0
    );

  private getParentItemView(item: Item) {
    return this.rows.find((r) => r.item.children.indexOf(item) >= 0);
  }
  private getParentIndex(currentIndex: number) {
    const item = this.rows[currentIndex].item;
    return this.rows.findIndex((r) => r.item.children.indexOf(item) >= 0);
  }

  private getItemHeight = (item: ItemRow) => {
    return item.level === 0
      ? spacings.zeroLevelItemHeight
      : spacings.itemHeight;
  };
}
