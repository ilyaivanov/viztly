import { Item, Tree } from "./core";

export type ItemView = {
  item: Item;
  y: number;
  x: number;
  color: string;
};

export const flattenItems = ({ root }: Tree): ItemView[] => {
  const res: ItemView[] = [];

  let offset = 0;
  const traverseChildren = (parent: Item, level: number) => {
    parent.children.forEach((item) => {
      offset += 20;
      const color = item.isSelected ? "red" : "white";
      res.push({ item: item, y: offset, x: level * 20 + 20, color });
      traverseChildren(item, level + 1);
    });
  };

  traverseChildren(root, 0);

  return res;
};
