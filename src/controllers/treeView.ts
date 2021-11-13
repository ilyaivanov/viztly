import { spacings } from "../designSystem";
import { Canvas } from "../infra/canvas";
import Item from "../itemTree/item";
import Tree from "../itemTree/tree";
import ItemRow from "../views/ItemRow";

export class TreeView {
  rows: ItemRow[];
  itemToRows: Map<Item, ItemRow> = new Map();

  constructor(public tree: Tree) {
    this.rows = this.createRows(tree.focusedNode);
  }

  draw = (canvas: Canvas) => this.rows.forEach((view) => view.draw(canvas));

  updateRows = () => {
    if (
      this.tree.focusedNode.isRoot() &&
      this.tree.focusedNode.children.length === 0
    ) {
      this.rows = [];
      this.itemToRows = new Map();
      return;
    }
    const rows = this.createRows(this.tree.focusedNode);
    this.itemToRows = new Map(rows.map((r) => [r.item, r]));
    this.mergeRows(rows);
  };

  public getContentHeight() {
    if (this.rows.length === 0) return 0;

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
    localRoot: Item,
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

      if (item === this.tree.selectedNode.parent) res.highlightChildrenBorder();

      offset += halfOfHeight;
      return res;
    };
    const newRows = localRoot.isRoot()
      ? this.tree.flattenItemChildren(localRoot, createRow)
      : this.tree.flattenItemWithChildren(localRoot, createRow);
    return this.updateHeights(newRows);
  };

  private updateHeights = (rows: ItemRow[]) => {
    const set = new Map(rows.map((r) => [r.item, r]));

    rows.forEach((row) => {
      const lastChild = row.item.children[row.item.children.length - 1];
      if (lastChild) {
        const view = set.get(lastChild);
        if (view) row.lastChildY = view.position.y + 1;
      }
    });

    return rows;
  };
}
