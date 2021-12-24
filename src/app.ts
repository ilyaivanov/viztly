import { addItemAfter, createItem, removeItem } from "./domain/items";
import * as movement from "./domain/tree.movement";
import * as traversal from "./domain/tree.traversal";
import * as input from "./view/itemInput";
import { sp } from "./view/design";

type ItemView = {
  circle: Circle;
  text: TextShape;
};

export type AppContent = {
  //domain state
  root: Item;
  selectedItem: Item | undefined;

  //view (canvas) state
  views: Views;
  itemsToViews: Map<Item, ItemView>;
};

export const init = (root: Item): AppContent => {
  const app: AppContent = {
    root,
    selectedItem: root.children[0],

    itemsToViews: new Map(),
    views: new Set(),
  };
  renderViews(app, root, sp.start, sp.start);

  input.addEventListener("onInputBlur", () => {
    setValueToSelectedItemFromInput(app);
  });
  return app;
};

export const forEachShape = (app: AppContent, cb: F1<Shape>) =>
  app.views.forEach(cb);

export const handleKeyDown = (app: AppContent, e: KeyboardEvent) => {
  const { selectedItem } = app;
  const code = e.code as KeyboardKey;

  if (input.isEditing()) {
    if (e.code === "Enter" || e.code === "Escape") {
      setValueToSelectedItemFromInput(app);
      input.finishEdit();
    }
    return;
  }

  if (selectedItem) {
    if (code === "ArrowDown") {
      if (e.altKey && e.shiftKey) applyMovement(app, movement.moveItemDown);
      else changeSelection(app, traversal.getItemBelow);
    } else if (code === "ArrowUp") {
      if (e.altKey && e.shiftKey) applyMovement(app, movement.moveItemUp);
      else changeSelection(app, traversal.getItemAbove);
    } else if (code === "ArrowLeft") {
      if (e.altKey && e.shiftKey) applyMovement(app, movement.moveItemLeft);
      else if (traversal.needsToBeClosed(selectedItem))
        closeItem(app, selectedItem);
      else changeSelection(app, (item) => item.parent);
    } else if (code === "ArrowRight") {
      if (e.altKey && e.shiftKey) applyMovement(app, movement.moveItemRight);
      else if (traversal.needsToBeOpened(selectedItem))
        openItem(app, selectedItem);
      else changeSelection(app, (item) => item.children[0]);
    } else if (e.shiftKey && e.altKey && code === "Backspace")
      removeItemFromTree(app, selectedItem);
    else if (code === "KeyE") {
      const view = app.itemsToViews.get(selectedItem);
      if (view) {
        view.text.text = "";
        viewInput(view, selectedItem.title);
      }
      e.preventDefault();
    } else if (code === "Enter") {
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
  input.renderInputAt(
    view.text.x,
    view.circle.y - sp.fontSize * 0.32 * 2.5,
    value
  );

const setValueToSelectedItemFromInput = (app: AppContent) => {
  if (app.selectedItem) {
    const newTitle = input.getValue();
    const view = app.itemsToViews.get(app.selectedItem);
    if (view) {
      view.text.text = newTitle || "";
      app.selectedItem.title = newTitle || "";
    }
  }
};

const applyMovement = (app: AppContent, movingFn: F1<Item>) => {
  if (app.selectedItem) {
    movingFn(app.selectedItem);
    updateExistingItemPositions(app, sp.start, sp.start);
  }
};

const closeItem = (app: AppContent, item: Item) => {
  item.isOpen = false;
  traversal.forEachOpenChild(item, (child) => removeAllItemViews(app, child));
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
  traversal.forEachOpenChild(item, (child) => removeAllItemViews(app, child));
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
    filled: !traversal.isEmpty(item),
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

        view.circle.filled = !traversal.isEmpty(item);

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
