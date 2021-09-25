import { c } from "./designSystem";
import { AnimatedColor } from "./infra/animatedColor";
import { Canvas } from "./infra/canvas";
import { add } from "./infra/vector";

export const createItemViews = (
  root: Item,
  level: number,
  offset: number
): ItemViewModel[] => {
  const visibleItems: ItemViewModel[] = [];

  let currentYOffset = offset;
  const viewItem = (item: Item, level: number) => {
    visibleItems.push({
      item,
      level,
      lineColor: new AnimatedColor(c.line),
      position: { y: currentYOffset, x: c.xBase + level * c.xStep },
    });
    currentYOffset += c.yStep;
    item.isOpen && item.children.forEach((c) => viewItem(c, level + 1));
  };

  root.children.forEach((child) => viewItem(child, level));
  return visibleItems;
};

export const viewItem = (canvas: Canvas, itemView: ItemViewModel) => {
  const p = itemView.position;
  const item = itemView.item;

  if (hasVisibleChildren(item)) {
    const lineStart = add(itemView.position, { x: 0, y: 12 });
    const lineHeight = countChildrenHeight(item);

    canvas.drawLine(
      lineStart,
      add(lineStart, { x: 0, y: lineHeight }),
      2,
      itemView.lineColor.getHexColor()
    );
  }
  canvas.drawCircle(p, 3.5, item.isSelected ? c.selectedItem : c.circle);

  const textPosition = add(p, { x: 10, y: c.fontSize * 0.32 });

  canvas.drawText(
    textPosition,
    itemView.item.title,
    c.fontSize,
    item.isSelected ? c.selectedItem : c.text
  );
};

export type ItemViewModel = {
  position: Vector;
  level: number;
  lineColor: AnimatedColor;
  item: Item;
};

export const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;

export const visibleChildrenCount = (item: Item) =>
  getVisibleChildren(item).length;

export const getVisibleChildren = (item: Item): Item[] => {
  let childs: Item[] = [];
  const traverseChildren = (child: Item) => {
    childs.push(child);
    if (hasVisibleChildren(child)) child.children.forEach(traverseChildren);
  };
  if (hasVisibleChildren(item)) item.children.forEach(traverseChildren);

  return childs;
};

//TODO: this assumes all children have the same height
export const countChildrenHeight = (item: Item) =>
  visibleChildrenCount(item) * c.yStep;
// const hasSelectedChild = (item: Item) =>
//   item.children.some((child) => child.isSelected);
