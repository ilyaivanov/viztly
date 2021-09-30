import { c, colors, spacings as sp } from "../designSystem";
import { countChildrenHeight, hasVisibleChildren } from "../ItemView";

export type FlatItemView = {
  item: Item;
  level: number;
  position: Vector;
  childrenBorder?: Line;

  //to think about
  itemHeight: number;
};

export class FlatednedList {
  visibleItems: FlatItemView[] = [];

  constructor(root: Item) {
    let offset = sp.yBase;
    const viewItem = (item: Item, level: number, nextSibling?: Item) => {
      const itemHeight = level === 0 ? sp.level1ItemHeight : sp.itemHeight;
      offset += itemHeight / 2;

      const itemView: FlatItemView = {
        item,
        level,

        itemHeight,
        // lineColor: new AnimatedColor(c.line),
        position: {
          y: offset,
          x: sp.xBase + level * sp.xStep,
        },
      };
      if (hasVisibleChildren(item)) {
        itemView.childrenBorder = createBorder(itemView);
      }
      this.visibleItems.push(itemView);
      offset += itemHeight / 2;
      traverseChildren(item, level + 1);
    };

    const traverseChildren = (item: Item, level: number) =>
      item.isOpen &&
      item.children.forEach((c, index) =>
        viewItem(c, level, item.children[index + 1])
      );

    traverseChildren(root, 0);
  }
}

const createBorder = (item: FlatItemView): Line => {
  const lineHeight = countChildrenHeight(item.item);
  const start = {
    x: item.position.x,
    y: item.position.y + sp.circleRadius + sp.lineDistanceToCircle,
  };
  return {
    start,
    end: {
      x: item.position.x,
      y:
        start.y +
        lineHeight +
        item.itemHeight -
        sp.circleRadius * 2 -
        sp.lineDistanceToCircle * 2,
    },
    color: c.line,
  };
};
