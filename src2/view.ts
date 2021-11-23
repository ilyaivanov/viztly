import { hasChildren, Item, Tree } from "./core";

export type ItemView = {
  item: Item;
  circlePosition: Point;
  textPosition: Point;
  color: string;
  circleRadius: number;
  isCircleEmpty: boolean;
};

export const flattenItems = ({ root }: Tree): ItemView[] => {
  const res: ItemView[] = [];

  let offset = 0;
  const traverseChildren = (parent: Item, level: number) => {
    parent.isOpen &&
      parent.children.forEach((item) => {
        offset += sp.yStep;
        const color = item.isSelected ? c.textSelected : c.textRegular;
        const circlePosition = { y: offset, x: level * sp.xStep + sp.xStep };
        res.push({
          item: item,
          circlePosition,
          textPosition: {
            x: circlePosition.x + 10,
            y: circlePosition.y + 0.32 * sp.fontSize,
          },
          circleRadius: 3.4,
          isCircleEmpty: !hasChildren(item),
          color,
        });
        traverseChildren(item, level + 1);
      });
  };

  traverseChildren(root, 0);

  return res;
};

export const sp = {
  yStep: 25,
  xStep: 20,
  fontSize: 18,
};

export const c = {
  textRegular: "white",
  textSelected: "#ACE854",
};

type Point = {
  x: number;
  y: number;
};
