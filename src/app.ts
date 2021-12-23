import {
  forEachOpenChild,
  getItemAbove,
  getItemBelow,
  isEmpty,
  needsToBeClosed,
  needsToBeOpened,
} from "./domain/tree.traversal";
import { sp } from "./view/design";

type ItemViews = {
  circle: Circle;
  text: TextShape;
};

export type AppContent = {
  views: Views;
  itemsToViews: Map<Item, ItemViews>;
  root: Item;
  selectedItem: Item | undefined;
};

export const init = (root: Item): AppContent => {
  const app: AppContent = {
    root,
    itemsToViews: new Map(),
    views: new Set(),
    selectedItem: root.children[0],
  };
  renderViews(app, root, sp.start, sp.start);
  return app;
};

export const forEachShape = (app: AppContent, cb: F1<Shape>) =>
  app.views.forEach(cb);

export const handleKeyDown = (app: AppContent, e: KeyboardEvent) => {
  const { selectedItem } = app;
  if (selectedItem) {
    if (e.code === "ArrowDown") changeSelection(app, getItemBelow);
    else if (e.code === "ArrowUp") changeSelection(app, getItemAbove);
    else if (e.code === "ArrowLeft") {
      if (needsToBeClosed(selectedItem)) closeItem(app, selectedItem);
      else changeSelection(app, (item) => item.parent);
    } else if (e.code === "ArrowRight") {
      if (needsToBeOpened(selectedItem)) openItem(app, selectedItem);
      else changeSelection(app, (item) => item.children[0]);
    }
  }
};

const closeItem = (app: AppContent, item: Item) => {
  item.isOpen = false;
  forEachOpenChild(item, (child) => {
    const view = app.itemsToViews.get(child);
    if (view) {
      app.views.delete(view.circle);
      app.views.delete(view.text);
    }
  });
  updateExistingItemPositions(app, sp.start, sp.start);
};

const openItem = (app: AppContent, item: Item) => {
  item.isOpen = true;
  const view = app.itemsToViews.get(item);
  if (view) {
    renderViews(app, item, view.circle.x + sp.xStep, view.circle.y + sp.yStep);
  }
  updateExistingItemPositions(app, sp.start, sp.start);
};

const changeSelection = (
  app: AppContent,
  getNextItem: F2<Item, Item | undefined>
) => {
  const { selectedItem } = app;
  if (selectedItem) {
    const next = getNextItem(selectedItem);
    if (next) {
      unselect(app, selectedItem);
      select(app, next);
    }
  }
};

const unselect = (app: AppContent, item: Item) => {
  const views = app.itemsToViews.get(item);
  if (views) {
    views.circle.color = "white";
    views.text.color = "white";
  }
};

//select is used directly only from tests,
export const select = (app: AppContent, item?: Item) => {
  if (item) {
    const views = app.itemsToViews.get(item);
    if (views) {
      views.circle.color = sp.selectedCircle;
      views.text.color = sp.selectedCircle;
    }
  }
  app.selectedItem = item;
};

const renderViews = (
  app: AppContent,
  itemFocused: Item,
  x: number,
  y: number
) => {
  let yOffset = y;
  const renderViewsInner = (item: Item, x: number) => {
    item.children.forEach((item) => {
      const color = app.selectedItem === item ? sp.selectedCircle : "white";
      const circle: Circle = {
        type: "circle",
        color,
        x: x,
        y: yOffset,
        filled: !isEmpty(item),
        r: 3,
      };
      const text: TextShape = {
        type: "text",
        color,
        x: x + sp.circleToTextDistance,
        y: yOffset + 0.32 * sp.fontSize,
        text: item.title,
        fontSize: sp.fontSize,
      };
      app.views.add(circle);
      app.views.add(text);
      app.itemsToViews.set(item, { circle, text });
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0) {
        renderViewsInner(item, x + sp.xStep);
      }
    });
  };
  renderViewsInner(itemFocused, x);
};

const updateExistingItemPositions = (app: AppContent, x: number, y: number) => {
  let yOffset = y;
  const updateItemPositions = (item: Item, x: number) => {
    item.children.forEach((item) => {
      const view = app.itemsToViews.get(item);
      if (view) {
        // duplicated from renderViews
        view.circle.x = x;
        view.circle.y = yOffset;
        view.text.x = x + sp.circleToTextDistance;
        view.text.y = yOffset + 0.32 * sp.fontSize;
      }
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0) {
        updateItemPositions(item, x + sp.xStep);
      }
    });
  };
  updateItemPositions(app.root, x);
};
