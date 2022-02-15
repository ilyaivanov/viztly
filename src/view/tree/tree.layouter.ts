import { isRoot } from "../../tree/tree.traversal";
import { createItemView, ItemView2 } from "./itemView";
import { animatePosition, canvas } from "../../infra";
import { sp } from "../../design";

export const renderItemChildren = (
  views: Map<Item, ItemView2>,
  item: Item,
  xStart: number,
  yStart: number
) => {
  const renderItem = (item: Item, x: number, y: number) => {
    const view = createItemView(x, y, item);
    views.set(item, view);
  };

  if (isRoot(item)) traverseItems(item.children, xStart, yStart, renderItem);
  else traverseItems([item], xStart, yStart, renderItem);
};

export const updatePositionsForItemAndChildren = (
  views: Map<Item, ItemView2>,
  item: Item
) => {
  const updateItemPosition = (item: Item, x: number, y: number) => {
    const itemView = views.get(item);
    if (itemView && (itemView.x !== x || itemView.y !== y)) {
      itemView.targetY = y;
      animatePosition(itemView, x, y);
    }
  };

  if (isRoot(item))
    traverseItems(item.children, sp.start, sp.start, updateItemPosition);
  else traverseItems([item], sp.start, sp.start, updateItemPosition);
};

const traverseItems = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
): number =>
  items.reduce((totalHeight, child) => {
    const cy = y + totalHeight;
    fn(child, x, cy);

    return (
      totalHeight +
      sp.yStep +
      (hasVisibleChildren(child)
        ? child.view === "tree"
          ? traverseItemsDeeper(child.children, x, cy, fn)
          : renderBoardChildren(child.children, x, cy, fn)
        : 0)
    );
  }, 0);

const traverseItemsDeeper = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
) => traverseItems(items, x + sp.xStep, y + sp.yStep, fn);

const renderBoardChildren = (
  items: Item[],
  x: number,
  y: number,
  fn: A3<Item, number, number>
) => {
  let maxHeight = 0;
  let xOffset = 0;
  const viewY = y + sp.yStep * 2;

  let viewX = x + sp.xStep;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    xOffset = canvas.getTextWidth(child.title, sp.fontSize);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = traverseItemsDeeper(
        child.children,
        viewX,
        viewY,
        (item, x, y) => {
          const textWidth = canvas.getTextWidth(item.title, sp.fontSize);
          xOffset = Math.max(xOffset, x - viewX + textWidth);
          fn(item, x, y);
        }
      );
      maxHeight = Math.max(subtreeHeight, maxHeight);
    }
    viewX += xOffset + 30;
  });
  return sp.yStep * 2.5 + maxHeight;
};

const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;
