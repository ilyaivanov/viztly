import { c, spacings } from "../designSystem";
import { flattenItemChildren, visibleChildrenCount } from "../itemTree";
import { animate, animateColor } from "../infra/animations";

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

  public closeSelectedItem() {
    const childs = visibleChildrenCount(this.getSelectedItemRow().item);
    this.rows.splice(this.selectedItemIndex + 1, childs);

    const height = this.getSelectedItemRow().childrenHeight;
    this.rows[this.selectedItemIndex].childrenHeight = 0;
    this.rows[this.selectedItemIndex].item.isOpen = false;

    this.rows.slice(this.selectedItemIndex + 1).forEach((row) => {
      row.position.y -= height;
    });

    this.updateAllParents();
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

    this.updateAllParents();
  }

  private updateAllParents() {
    let parentIndex = this.getParentIndex(this.selectedItemIndex);

    while (parentIndex !== -1) {
      this.rows[parentIndex].childrenHeight =
        visibleChildrenCount(this.rows[parentIndex].item) * spacings.itemHeight;

      parentIndex = this.getParentIndex(parentIndex);
    }
  }

  public selectParentItem() {
    const parentIndex = this.getParentIndex(this.selectedItemIndex);
    if (typeof parentIndex !== "undefined")
      this.changeItemSelection(parentIndex);
  }

  public getSelectedItemRow() {
    return this.rows[this.selectedItemIndex];
  }

  private changeItemSelection(index: number) {
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
}