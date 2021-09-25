import { c } from "./designSystem";
import { AnimatedNumber } from "./infra/animatedNumber";
import { Canvas } from "./infra/canvas";
import { add } from "./infra/vector";

export const createItemViews = (root: Item): ItemViewModel[] => {
  const visibleItems: ItemViewModel[] = [];

  let currentYOffset = c.yBase;
  const viewItem = (item: Item, level: number) => {
    visibleItems.push({
      item,
      xShift: new AnimatedNumber(),
      position: { y: currentYOffset, x: c.xBase + level * c.xStep },
    });
    currentYOffset += c.yStep;
    item.children.forEach((c) => viewItem(c, level + 1));
  };

  root.children.forEach((child) => viewItem(child, 0));
  return visibleItems;
};

export const viewItem = (canvas: Canvas, itemView: ItemViewModel) => {
  const p = add(itemView.position, { x: itemView.xShift.value, y: 0 });
  canvas.drawCircle(p, 3.5, c.color2);

  const textPosition = add(p, {
    x: 10,
    y: c.fontSize * 0.32,
  });
  canvas.drawText(textPosition, itemView.item.title, c.fontSize);
};

export type ItemViewModel = {
  position: Vector;
  xShift: AnimatedNumber;
  item: Item;
};
