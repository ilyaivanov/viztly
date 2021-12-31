import * as traversal from "../domain/tree.traversal";
import { AppContent } from "../app";
import { sp } from "./design";
import { isRoot } from "../domain/tree.traversal";
import { animatePosition } from "../infra/animations";

//itemView consist of individual shapes and operations upon them

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
      ? {
          type: "line",
          color: sp.line,
          start: { x: 0, y: 0 },
          end: { x: 0, y: 0 },
          width: 2,
        }
      : undefined;

  const openLine: Line | undefined = item.isOpen
    ? {
        type: "line",
        color: sp.line,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        width: 2,
      }
    : undefined;

  const view: ItemView = {
    circle: { type: "circle", color, x: 0, y: 0, filled: false, r: 3 },
    text: { type: "text", color, x: 0, y: 0, text, fontSize: sp.fontSize },
    childLine,
    openLine,
  };

  updateItemPosition(view, item, x, y);
  return view;
};

export const updateItemPosition = (
  view: ItemView,
  item: Item,
  x: number,
  y: number
) => {
  view.circle.x = x;
  view.circle.y = y;

  if (view.childLine) {
    view.childLine.start.x = x;
    view.childLine.start.y = y;
    view.childLine.end.x = x - sp.xStep;
    view.childLine.end.y = y;
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
      view.openLine.start.x = view.circle.x;
      view.openLine.start.y = view.circle.y;
      view.openLine.end.x = lastChild.circle.x - sp.xStep;
      view.openLine.end.y = lastChild.circle.y + 1;
    }
  }
};
