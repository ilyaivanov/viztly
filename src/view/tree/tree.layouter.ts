import { isRoot } from "../../tree/tree.traversal";
import { createItemView, ItemView2 } from "./itemView";
import { animatePosition } from "../../infra";
import { sp } from "../../design";

export const renderItemChildren = (
  views: Map<Item, ItemView2>,
  item: Item,
  xStart: number,
  yStart: number
) => {
  let yOffset = yStart;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;

    const view = createItemView(x, yOffset, item);
    views.set(item, view);

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
  };

  if (isRoot(item)) item.children.forEach((c) => step(c, 0));
  else step(item, 0);
};

export const updatePositionsForItemAndChildren = (
  views: Map<Item, ItemView2>,
  item: Item
) => {
  let yOffset = sp.start;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + sp.start;
    const itemView = views.get(item);

    if (itemView && (itemView.x !== x || itemView.y !== yOffset)) {
      itemView.targetY = yOffset;
      animatePosition(itemView, x, yOffset);
    }

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
  };

  if (isRoot(item)) item.children.forEach((c) => step(c, 0));
  else step(item, 0);
};
