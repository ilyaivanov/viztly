import * as t from "./types";

const isRoot = (item: t.Item) => !item.parent;

export const renderItemChildren = (
  item: t.Item,
  views: Map<t.Item, t.ItemView>,
  gridXStart: number,
  gridYStart: number
) => {
  const renderItem = (item: t.Item, gridX: number, gridY: number) =>
    views.set(item, { gridX, gridY });

  const childsToRender = isRoot(item) ? item.children : [item];
  traverseItems(childsToRender, gridXStart, gridYStart, renderItem);
};

// export const updatePositionsForItemAndChildren = (
//   views: Map<Item, t.ItemView>,
//   item: Item
// ) => {
//   const updateItemPosition = (item: Item, x: number, y: number) => {
//     const itemView = views.get(item);
//     if (itemView && (itemView.x !== x || itemView.y !== y)) {
//       itemView.targetY = y;
//       animatePosition(itemView, x, y);
//     }
//   };

//   if (isRoot(item))
//     traverseItems(item.children, sp.start, sp.start, updateItemPosition);
//   else traverseItems([item], sp.start, sp.start, updateItemPosition);
// };

const traverseItems = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
): number =>
  items.reduce((totalGridHeight, child) => {
    const currentGridY = gridY + totalGridHeight;
    fn(child, gridX, currentGridY);

    return (
      totalGridHeight +
      1 +
      (hasVisibleChildren(child)
        ? child.view === "tree"
          ? traverseItemsDeeper(child.children, gridX, currentGridY, fn)
          : renderBoardChildren(child.children, gridX, currentGridY, fn)
        : 0)
    );
  }, 0);

const traverseItemsDeeper = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
) => traverseItems(items, gridX + 1, gridY + 1, fn);

const renderBoardChildren = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
) => traverseItems(items, gridX + 1, gridY + 1, fn);

// const renderBoardChildren = (
//   items: Item[],
//   x: number,
//   y: number,
//   fn: A3<Item, number, number>
// ) => {
//   let maxHeight = 0;
//   let xOffset = 0;
//   const viewY = y + sp.yStep * 2;

//   let viewX = x + sp.xStep;
//   items.forEach((child) => {
//     fn(child, viewX, viewY);

//     xOffset = canvas.getTextWidth(child.title, sp.fontSize);

//     if (hasVisibleChildren(child)) {
//       const subtreeHeight = traverseItemsDeeper(
//         child.children,
//         viewX,
//         viewY,
//         (item, x, y) => {
//           const textWidth = canvas.getTextWidth(item.title, sp.fontSize);
//           xOffset = Math.max(xOffset, x - viewX + textWidth);
//           fn(item, x, y);
//         }
//       );
//       maxHeight = Math.max(subtreeHeight, maxHeight);
//     }
//     viewX += xOffset + 30;
//   });
//   return sp.yStep * 2.5 + maxHeight;
// };

const hasVisibleChildren = (item: t.Item) =>
  item.isOpen && item.children.length > 0;
