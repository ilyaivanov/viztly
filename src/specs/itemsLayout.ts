import { c, spacings as sp } from "../designSystem";
import * as tree from "./itemTree";

export type FlatItemView = {
  item: Item;
  level: number;
  position: Vector;
  childrenBorder?: Line;

  textColor: string;
  //to think about
  itemHeight: number;
};

export class FlatednedList {
  selectedItemIndex: number = 0;

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
        textColor:
          this.visibleItems.length === this.selectedItemIndex
            ? c.selectedItem
            : c.text,
        position: {
          y: offset,
          x: sp.xBase + level * sp.xStep,
        },
      };
      if (tree.hasVisibleChildren(item)) {
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

  selectNextItem = () => {
    this.visibleItems[this.selectedItemIndex].textColor = c.text;
    this.selectedItemIndex += 1;
    this.visibleItems[this.selectedItemIndex].textColor = c.selectedItem;
  };

  closeSelected = () => {
    const view = this.visibleItems[this.selectedItemIndex];

    const childrenCount = tree.visibleChildrenCount(view.item);

    //asumes items are of level2+
    const offset = childrenCount * sp.itemHeight;

    this.visibleItems.splice(this.selectedItemIndex + 1, childrenCount);

    view.item.isOpen = false;

    view.childrenBorder = undefined;
    this.visibleItems
      .slice(this.selectedItemIndex + 1)
      .forEach((item) => (item.position.y -= offset));
  };

  getSelectedItem = (): Item => this.visibleItems[this.selectedItemIndex].item;
}

const createBorder = (item: FlatItemView): Line => {
  const lineHeight = tree.visibleChildrenCount(item.item) * sp.itemHeight;
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
