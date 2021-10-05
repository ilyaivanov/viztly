import { spacings } from "../designSystem";

//VIEW
export type ItemRow = {
  item: Item;
  level: number;
  position: Vector;
};

export class List {
  rows: ItemRow[];
  constructor(public root: Item) {
    this.rows = this.createRows(root);
  }

  createRows = (parent: Item) => {
    let offset = spacings.yBase;
    const createRow = (item: Item, level: number): ItemRow => {
      const res: ItemRow = {
        item,
        level,
        position: { x: spacings.xBase, y: offset },
      };
      offset += spacings.level1ItemHeight;
      return res;
    };
    return flattenItemChildren(parent, createRow);
  };
}

//DOMAIN
const flattenItemChildren = <T>(
  item: Item,
  mapper: (item: Item, level: number) => T
): T[] => {
  const res: T[] = [];

  const traverseChildren = (item: Item, level: number) =>
    item.isOpen && item.children.forEach((c) => res.push(mapper(c, level)));

  traverseChildren(item, 0);

  return res;
};
