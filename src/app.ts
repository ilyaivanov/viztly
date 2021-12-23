import { addItemAfter, createItem, removeItem } from "./domain/items";
import {
  forEachOpenChild,
  getItemAbove,
  getItemBelow,
  isEmpty,
  needsToBeClosed,
  needsToBeOpened,
} from "./domain/tree.traversal";
import { sp } from "./view/design";
import {
  addEventListener,
  finishEdit,
  getValue,
  isEditing,
  renderInputAt,
} from "./view/itemInput";

type ItemView = {
  circle: Circle;
  text: TextShape;
};

export type AppContent = {
  //domain state
  root: Item;
  selectedItem: Item | undefined;

  //view state
  views: Views;
  itemsToViews: Map<Item, ItemView>;
};

export const init = (root: Item): AppContent => {
  const app: AppContent = {
    root,
    itemsToViews: new Map(),
    views: new Set(),
    selectedItem: root.children[0],
  };
  renderViews(app, root, sp.start, sp.start);

  addEventListener("onInputBlur", () => {
    setValueToSelectedItemFromInput(app);
  });
  return app;
};

export const forEachShape = (app: AppContent, cb: F1<Shape>) =>
  app.views.forEach(cb);

export const handleKeyDown = (app: AppContent, e: KeyboardEvent) => {
  const { selectedItem } = app;

  if (isEditing()) {
    if (e.code === "Enter" || e.code === "Escape") {
      setValueToSelectedItemFromInput(app);
      finishEdit();
    }
    return;
  }

  if (selectedItem) {
    if (e.code === "ArrowDown") changeSelection(app, getItemBelow);
    else if (e.code === "ArrowUp") changeSelection(app, getItemAbove);
    else if (e.code === "ArrowLeft") {
      if (needsToBeClosed(selectedItem)) closeItem(app, selectedItem);
      else changeSelection(app, (item) => item.parent);
    } else if (e.code === "ArrowRight") {
      if (needsToBeOpened(selectedItem)) openItem(app, selectedItem);
      else changeSelection(app, (item) => item.children[0]);
    } else if (e.shiftKey && e.altKey && e.code === "Backspace")
      removeItemFromTree(app, selectedItem);
    else if (e.code === "KeyE") {
      const view = app.itemsToViews.get(selectedItem);
      if (view) {
        view.text.text = "";
        viewInput(view, selectedItem.title);
      }
      e.preventDefault();
    } else if (e.code === "Enter") {
      const newItem: Item = createItem("");
      const view = app.itemsToViews.get(selectedItem);
      if (view) {
        addItemAfter(selectedItem, newItem);
        const newItemView = renderItem(
          app,
          newItem,
          view.circle.x,
          view.circle.y + sp.yStep
        );
        updateExistingItemPositions(app, sp.start, sp.start);
        changeSelection(app, () => newItem);
        viewInput(newItemView, newItem.title);
      }
    }
  }
};

const viewInput = (view: ItemView, value: string) =>
  renderInputAt(view.text.x, view.circle.y - sp.fontSize * 0.32 * 2.5, value);

const setValueToSelectedItemFromInput = (app: AppContent) => {
  if (app.selectedItem) {
    const newTitle = getValue();
    const view = app.itemsToViews.get(app.selectedItem);
    if (view) {
      view.text.text = newTitle || "";
      app.selectedItem.title = newTitle || "";
    }
  }
};

const closeItem = (app: AppContent, item: Item) => {
  item.isOpen = false;
  forEachOpenChild(item, (child) => removeAllItemViews(app, child));
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

const removeItemFromTree = (app: AppContent, item: Item) => {
  const newSelection = removeItem(item);
  removeAllItemViews(app, item);
  forEachOpenChild(item, (child) => removeAllItemViews(app, child));
  changeSelection(app, () => newSelection);
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
      renderItem(app, item, x, yOffset);
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0) {
        renderViewsInner(item, x + sp.xStep);
      }
    });
  };
  renderViewsInner(itemFocused, x);
};

const renderItem = (
  app: AppContent,
  item: Item,
  x: number,
  y: number
): ItemView => {
  const color = app.selectedItem === item ? sp.selectedCircle : "white";
  const circle: Circle = {
    type: "circle",
    color,
    x: x,
    y: y,
    filled: !isEmpty(item),
    r: 3,
  };
  const text: TextShape = {
    type: "text",
    color,
    x: x + sp.circleToTextDistance,
    y: y + 0.32 * sp.fontSize,
    text: item.title,
    fontSize: sp.fontSize,
  };
  app.views.add(circle);
  app.views.add(text);
  const view: ItemView = { circle, text };
  app.itemsToViews.set(item, view);
  return view;
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

        view.circle.filled = !isEmpty(item);

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

const removeAllItemViews = (app: AppContent, item: Item) => {
  const view = app.itemsToViews.get(item);
  if (view) {
    app.views.delete(view.circle);
    app.views.delete(view.text);
  }
};