import { c } from "./designSystem";
import { Canvas } from "./infra/canvas";
import { add } from "./infra/vector";

export const createItemViews = (root: Item): ItemViewModel[] => {
  const visibleItems: ItemViewModel[] = [];

  let currentYOffset = c.yBase;
  const viewItem = (item: Item, level: number) => {
    visibleItems.push({
      item,
      position: { y: currentYOffset, x: c.xBase + level * c.xStep },
    });
    currentYOffset += c.yStep;
    item.isOpen && item.children.forEach((c) => viewItem(c, level + 1));
  };

  root.children.forEach((child) => viewItem(child, 0));
  return visibleItems;
};

export const viewItem = (canvas: Canvas, itemView: ItemViewModel) => {
  const p = itemView.position;
  const item = itemView.item;
  canvas.drawCircle(p, 3.5, item.isSelected ? c.selectedItem : c.circle);

  const textPosition = add(p, {
    x: 10,
    y: c.fontSize * 0.32,
  });
  canvas.drawText(
    textPosition,
    itemView.item.title,
    c.fontSize,
    item.isSelected ? c.selectedItem : c.text
  );
};

export type ItemViewModel = {
  position: Vector;
  item: Item;
};
