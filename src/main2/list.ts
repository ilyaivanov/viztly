import { spacings } from "../designSystem";
import { flattenItemChildren } from "./domain";

//VIEW
export type ItemRow = {
  item: Item;
  level: number;
  position: Vector;
  childrenHeight: number;
};

export class List {
  rows: ItemRow[];
  constructor(public root: Item) {
    this.rows = this.createRows(root);
  }

  createRows = (parent: Item) => {
    let offset = spacings.yBase;
    const createRow = (item: Item, level: number): ItemRow => {
      const halfOfHeight =
        level === 0
          ? spacings.zeroLevelItemHeight / 2
          : spacings.itemHeight / 2;

      //not changing on first iteration
      offset = offset === spacings.yBase ? offset : offset + halfOfHeight;

      const res: ItemRow = {
        item,
        level,
        childrenHeight: this.getChildrenHeight(item),
        position: { x: spacings.xBase + level * spacings.xStep, y: offset },
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
}
