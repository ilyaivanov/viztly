import { globalCanvas } from "./globalCanvas";
import sp from "./spacings";
import * as t from "./types";

export const layoutChildren = (
  item: t.Item,
  renderItem: (item: t.Item, gridX: number, gridY: number) => void,
  gridXStart: number,
  gridYStart: number
) => viewItem(item, gridXStart, gridYStart, renderItem);

const viewItem = (
  item: t.Item,
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
) => {
  const renderer =
    item.view === "tree"
      ? traverseItems
      : item.view === "gallery"
      ? renderGallery
      : renderBoardChildren;

  return renderer(item.children, gridX, gridY, fn);
};

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
        ? viewItem(child, gridX + 1, currentGridY + 1, fn)
        : 0)
    );
  }, 0);

const renderGallery = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
) => {
  return 10;
};

const renderBoardChildren = (
  items: t.Item[],
  gridX: number,
  gridY: number,
  fn: A3<t.Item, number, number>
) => {
  let maxHeight = 0;
  const viewY = gridY + 1;

  let viewX = gridX;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    let xOffset = gridDistanceForText(child.title);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = traverseItems(
        child.children,
        viewX + 1,
        viewY + 1,
        (item, x, y) => {
          const xGridDistanceToBoardItem = x - viewX;
          xOffset = Math.max(
            gridDistanceForText(item.title) + xGridDistanceToBoardItem,
            xOffset
          );
          fn(item, x, y);
        }
      );
      maxHeight = Math.max(subtreeHeight, maxHeight);
    }
    viewX += xOffset;
  });
  return 3 + maxHeight;
};

const hasVisibleChildren = (item: t.Item) =>
  item.isOpen && item.children.length > 0;

// text offset * 2 because it's from beggining and end
export const textWidthWithMarging = (label: string) =>
  globalCanvas.getTextWidth(label) + sp.textOffsetFromCircleCenter * 2;

export const gridDistanceForText = (label: string) =>
  Math.ceil(textWidthWithMarging(label) / sp.gridSize);
