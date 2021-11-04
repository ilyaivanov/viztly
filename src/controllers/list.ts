import { c, spacings } from "../designSystem";
import { Canvas } from "../infra/canvas";
import Item from "../itemTree/item";
import ItemsTree from "../itemTree/tree";
import ItemRow from "../views/ItemRow";

export class List {
  rows: ItemRow[];

  constructor(public tree: ItemsTree) {
    this.rows = this.createRows(tree.focusedNode);
  }

  draw = (canvas: Canvas) => this.rows.forEach((view) => view.draw(canvas));

  updateRows = (quick = false) => {
    if (quick) this.rows = this.createRows(this.tree.focusedNode);
    else this.mergeRows(this.createRows(this.tree.focusedNode));
  };

  public getContentHeight() {
    const lastItem = this.rows[this.rows.length - 1];
    const lastITemHeight =
      lastItem.level === 0 ? spacings.zeroLevelItemHeight : spacings.itemHeight;
    return lastItem.position.y + lastITemHeight + spacings.yBase;
  }

  private mergeRows = (newRows: ItemRow[]) => {
    const prevRows = new Map(this.rows.map((r) => [r.item, r]));
    this.rows = newRows;

    this.rows.forEach((row) => {
      const prevRow = prevRows.get(row.item);

      if (prevRow) row.merge(prevRow);
    });
  };

  private createRows = (
    root: Item,
    startingYOffset = spacings.yBase,
    startingLevel = 0
  ): ItemRow[] => {
    let offset = startingYOffset;
    let isFirstItem = true;
    const createRow = (item: Item, lvl: number): ItemRow => {
      const level = lvl + startingLevel;
      const halfOfHeight =
        level === 0
          ? spacings.zeroLevelItemHeight / 2
          : spacings.itemHeight / 2;

      if (!isFirstItem) offset += halfOfHeight;

      isFirstItem = false;

      const res = new ItemRow(item, level, offset);

      offset += halfOfHeight;
      return res;
    };
    const newRows = this.tree.isRoot(root)
      ? this.tree.flattenItemChildren(root, createRow)
      : this.tree.flattenItemWithChildren(root, createRow);
    return this.updateHeights(newRows);
  };

  private updateHeights = (rows: ItemRow[]) => {
    const set = new Map(rows.map((r) => [r.item, r]));

    rows.forEach((row) => {
      row.childrenHeight = this.getItemHeight(set, row);
    });

    return rows;
  };

  private getItemHeight = (map: Map<Item, ItemRow>, row: ItemRow) => {
    if (!row.item.isOpen) return 0;

    let lastNestedChild = row;

    while (lastNestedChild.item.isOpen) {
      lastNestedChild = map.get(
        lastNestedChild.item.children[lastNestedChild.item.children.length - 1]
      )!;
    }
    return lastNestedChild.position.y - row.position.y;
  };
}
