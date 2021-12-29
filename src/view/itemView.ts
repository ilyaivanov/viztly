import * as traversal from "../domain/tree.traversal";
import { AppContent } from "../app";
import { sp } from "./design";
import { isRoot } from "../domain/tree.traversal";

export const createItemViewAt = (
  app: AppContent,
  item: Item,
  x: number,
  y: number
): ItemView => {
  const color = app.selectedItem === item ? sp.selectedCircle : sp.regularColor;
  const text = item.title;
  const childLine: Line | undefined =
    item.parent && !isRoot(item.parent)
      ? { type: "line", color: sp.line, x1: 0, y1: 0, x2: 0, y2: 0, width: 2 }
      : undefined;

  const openLine: Line | undefined = item.isOpen
    ? { type: "line", color: sp.line, x1: 0, y1: 0, x2: 0, y2: 0, width: 2 }
    : undefined;
  const view: ItemView = {
    circle: { type: "circle", color, x: 0, y: 0, filled: false, r: 3 },
    text: { type: "text", color, x: 0, y: 0, text, fontSize: sp.fontSize },
    childLine,
    openLine,
  };
  updateItemPosition(app, view, item, x, y);
  return view;
};

export const updateItemPosition = (
  app: AppContent,
  view: ItemView,
  item: Item,
  x: number,
  y: number
) => {
  view.circle.x = x;
  view.circle.y = y;

  if (view.childLine) {
    view.childLine.x1 = x;
    view.childLine.y1 = y;
    view.childLine.x2 = x - sp.xStep;
    view.childLine.y2 = y;
  }

  view.circle.filled = !traversal.isEmpty(item);

  view.text.x = x + sp.circleToTextDistance;
  view.text.y = y + 0.32 * sp.fontSize;
};

export const updateOpenItemLines = (app: AppContent, item: Item) => {
  const view = app.itemsToViews.get(item);
  if (view && view.openLine) {
    const lastChild = app.itemsToViews.get(
      item.children[item.children.length - 1]
    );
    if (lastChild) {
      view.openLine.x1 = view.circle.x;
      view.openLine.y1 = view.circle.y;
      view.openLine.x2 = lastChild.circle.x - sp.xStep;
      view.openLine.y2 = lastChild.circle.y + 1;
    }
  }
};
