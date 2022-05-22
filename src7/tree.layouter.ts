import sp from "./spacings";
import * as t from "./types";

const isRoot = (item: t.Item) => !item.parent;

export const renderItemChildren = (
  item: t.Item,
  views: Map<t.Item, t.ItemView>,
  gridXStart: number,
  gridYStart: number,
  getTextWidth: (text: string) => number
) => {
  const renderItem = (item: t.Item, gridX: number, gridY: number) =>
    views.set(item, { gridX, gridY });

  const childsToRender = isRoot(item) ? item.children : [item];
  traverseItems(
    childsToRender,
    gridXStart,
    gridYStart,
    renderItem,
    getTextWidth
  );
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
  fn: A3<t.Item, number, number>,
  getTextWidth: (text: string) => number
): number =>
  items.reduce((totalGridHeight, child) => {
    const currentGridY = gridY + totalGridHeight;
    fn(child, gridX, currentGridY);

    return (
      totalGridHeight +
      1 +
      (hasVisibleChildren(child)
        ? child.view === "tree"
          ? traverseItems(
              child.children,
              gridX + 1,
              currentGridY + 1,
              fn,
              getTextWidth
            )
          : renderBoardChildren(
              child.children,
              gridX,
              currentGridY,
              fn,
              getTextWidth
            )
        : 0)
    );
  }, 0);

const renderBoardChildren = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>,
  getTextWidth: (text: string) => number
) => {
  let maxHeight = 0;
  const viewY = gridY + 2;

  let viewX = gridX + 1;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    // text offset * 2 because it's from beggining and end
    const totalTextWidthWithMargins =
      getTextWidth(child.title) + sp.textOffsetFromCircleCenter * 2;

    let xOffset = Math.ceil(totalTextWidthWithMargins / sp.gridSize);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = traverseItems(
        child.children,
        viewX + 1,
        viewY + 1,
        (item, x, y) => {
          // const textWidth = canvas.getTextWidth(item.title, sp.fontSize);
          // xOffset = Math.max(xOffset, x - viewX + textWidth);
          fn(item, x, y);
        },
        getTextWidth
      );
      maxHeight = Math.max(subtreeHeight, maxHeight);
    }
    viewX += xOffset;
  });
  return 3 + maxHeight;
};

const hasVisibleChildren = (item: t.Item) =>
  item.isOpen && item.children.length > 0;
