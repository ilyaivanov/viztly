import { forEachOpenChild } from "../src/domain/tree.traversal";
import { canvas } from "../src/infra";
import { animatePosition } from "../src/infra/animations";
import { sp } from "../src/view/design";
import { on, AppEvents, getFocused } from "./tree";

let itemToViews: Map<Item, ItemView> = new Map();

export const init = (focused: Item) => {
  viewItemChildren(focused, sp.start, sp.start);
};

export const subscribe = () => {
  on("init", (p) => select(p.selectedItem));
  on("selection-changed", selectionChanged);
  on("item-toggled", toggleItem);
};

const selectionChanged = ({
  prev,
  current,
}: AppEvents["selection-changed"]) => {
  unselect(prev);
  select(current);
};

const select = (item: Item) => {
  const view = itemToViews.get(item);
  if (view) {
    view.circle.color = sp.selectedCircle;
    view.text.color = sp.selectedCircle;
  }
};
const unselect = (item: Item) => {
  const view = itemToViews.get(item);
  if (view) {
    view.circle.color = "white";
    view.text.color = "white";
  }
};

const toggleItem = (item: Item) => {
  const view = itemToViews.get(item);
  const shapes = canvas.canvas.shapes;
  const isOpened = item.isOpen;
  if (view) {
    if (isOpened) {
      viewItemChildren(item, view.circle.x, view.circle.y);
      updatePositions(getFocused());
    } else {
      const removeItem = (item: Item) => {
        const itemView = itemToViews.get(item);
        if (itemView) {
          Object.values(itemView).forEach((s) => shapes.delete(s));
          itemToViews.delete(item);
        }
      };
      forEachOpenChild(item, removeItem);
      updatePositions(getFocused());
    }
  }
};

const viewItemChildren = (item: Item, xStart: number, yStart: number) => {
  let yOffset = yStart;
  const shapes = canvas.canvas.shapes;
  const res: Shape[] = [];
  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;
    const itemView = createItemView(item, x, yOffset);
    shapes.add(itemView.circle);
    shapes.add(itemView.text);
    itemToViews.set(item, itemView);
    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0)
      item.children.forEach((c) => step(c, level + 1));
  };

  item.children.forEach((c) => step(c, 0));
  return res;
};

const updatePositions = (item: Item) => {
  let yOffset = sp.start;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + sp.start;
    const itemView = itemToViews.get(item);

    if (itemView) setItemViewPosition(itemView, x, yOffset);

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0)
      item.children.forEach((c) => step(c, level + 1));
  };

  item.children.forEach((c) => step(c, 0));
};

const createItemView = (item: Item, x: number, y: number): ItemView => {
  const view: ItemView = {
    circle: {
      type: "circle",
      y: 0,
      x: 0,
      color: "white",
      filled: item.children.length > 0,
      r: 3.2,
    },
    text: {
      type: "text",
      x: 0,
      y: 0,
      color: "white",
      fontSize: sp.fontSize,
      text: item.title,
    },
  };
  setItemViewPosition(view, x, y, false);
  return view;
};

const setItemViewPosition = (
  itemView: ItemView,
  x: number,
  y: number,
  isAnimating = true
) => {
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;

  if (!isAnimating) {
    itemView.circle.x = x;
    itemView.circle.y = y;
    itemView.text.x = textX;
    itemView.text.y = textY;
    return;
  }

  if (itemView.circle.x !== x || itemView.circle.y !== y)
    animatePosition(itemView.circle, x, y);

  if (itemView.text.x !== textX || itemView.text.y !== textY)
    animatePosition(itemView.text, textX, textY);
};
