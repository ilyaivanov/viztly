import { spacings, c } from "./designSystem";
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
    const itemHeight =
      level === 0 ? spacings.level1ItemHeight : spacings.itemHeight;
    currentYOffset += itemHeight / 2;
    visibleItems.push({
      item,
      level,
      itemHeight,
      lineColor: new AnimatedColor(c.line),
      position: {
        y: currentYOffset,
        x: spacings.xBase + level * spacings.xStep,
      },
    });
    currentYOffset += itemHeight / 2;
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
  // canvas.drawCircle(p, 3.5, item.isSelected ? c.selectedItem : c.circle);

  const fontSize =
    itemView.level === 0 ? spacings.level1FontSize : spacings.fontSize;
  0;
  const textPosition = add(p, { x: 10, y: fontSize * 0.32 });

  // canvas.drawText(
  //   textPosition,
  //   itemView.item.title,
  //   fontSize,
  //   item.isSelected ? c.selectedItem : c.text
  // );
};

export type ItemViewModel = {
  position: Vector;
  itemHeight: number;
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
  const gatherChildren = (child: Item) => {
    childs.push(child);
    traverseChildren(child);
  };
  const traverseChildren = (i: Item) =>
    hasVisibleChildren(i) && i.children.forEach(gatherChildren);

  traverseChildren(item);
  return childs;
};

//TODO: this assumes all children have the same height
export const countChildrenHeight = (item: Item) =>
  visibleChildrenCount(item) * spacings.itemHeight;
// const hasSelectedChild = (item: Item) =>
//   item.children.some((child) => child.isSelected);

//need to traverse children of itemViews
