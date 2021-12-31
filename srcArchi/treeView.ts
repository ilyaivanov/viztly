import { forEachOpenChild } from "../src/domain/tree.traversal";
import { canvas } from "../src/infra";
import { sp } from "../src/view/design";
import { on, AppEvents, getFocused } from "./tree";
import { createItemView, ItemView, setItemViewPosition } from "./itemView";

let itemToViews: Map<Item, ItemView> = new Map();
export const treeShapes = new Set<Shape>();
const addViewShapes = (itemView: ItemView) =>
  Object.values(itemView).forEach((s) => s && treeShapes.add(s));
const removeViewShapes = (itemView: ItemView) =>
  Object.values(itemView).forEach((s) => s && treeShapes.delete(s));

export const init = (focused: Item) => {
  viewItemChildren(focused, sp.start, sp.start);
  initMinimap();
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
  const isOpened = item.isOpen;
  if (view) {
    if (isOpened) {
      viewItemChildren(item, view.circle.x, view.circle.y);
      updatePositions(getFocused());
    } else {
      const removeItem = (item: Item) => {
        const itemView = itemToViews.get(item);
        if (itemView) {
          removeViewShapes(itemView);
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

  const res: Shape[] = [];
  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;
    const itemView = createItemView(item, x, yOffset);

    itemToViews.set(item, itemView);
    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
    addViewShapes(itemView);
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
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
  };

  item.children.forEach((c) => step(c, 0));
};

//minimap
const initMinimap = () => {
  const c = canvas.canvas;
  const shapes = c.shapes;
  const minimapWidth = c.width / sp.minimapScale;
  shapes.add({
    type: "rectangle",
    x: canvas.canvas.width - minimapWidth,
    y: 0,
    width: minimapWidth,
    height: canvas.canvas.height,
    color: "rgba(255,255,255,0.03)",
  });

  shapes.add({
    type: "rectangle",
    x: canvas.canvas.width - minimapWidth,
    y: 0,
    width: minimapWidth,
    height: canvas.canvas.height / sp.minimapScale,
    color: "rgba(255,255,255,0.1)",
  });
};
