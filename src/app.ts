import { addItemAfter, createItem, removeItem } from "./domain/items";
import * as movement from "./domain/tree.movement";
import * as traversal from "./domain/tree.traversal";
import * as input from "./view/itemInput";
import { sp } from "./view/design";
import { canvas } from "./infra";
import {
  createItemViewAt,
  updateItemPosition,
  updateOpenItemLines,
} from "./view/itemView";

export type AppContent = {
  //domain state
  root: Item;
  selectedItem: Item | undefined;

  //view (canvas) state
  views: Views;
  itemsToViews: Map<Item, ItemView>;

  pageHeight: number;
  pageOffset: number;

  ui: { scrollbar: Rectangle };
};

export const init = (root: Item): AppContent => {
  const app: AppContent = {
    root,
    selectedItem: root.children[0],

    itemsToViews: new Map(),
    views: new Set(),
    pageHeight: 0,
    pageOffset: 0,
    ui: {
      scrollbar: {
        color: "rgba(255,255,255,0.3)",
        x: 0,
        y: 0,
        height: 0,
        width: 10,
        type: "rectangle",
      },
    },
  };
  renderViews(app, root, sp.start, sp.start);
  updateScrollbar(app);
  input.addEventListener("onInputBlur", () => {
    setValueToSelectedItemFromInput(app);
  });
  return app;
};

export const updateScrollbar = (app: AppContent) => {
  const canvasHeight = canvas.canvas.height;
  if (canvasHeight < app.pageHeight) {
    app.ui.scrollbar.height = Math.pow(canvasHeight, 2) / app.pageHeight;
    app.ui.scrollbar.x = canvas.canvas.width - app.ui.scrollbar.width;
    app.ui.scrollbar.y = app.pageOffset * (canvasHeight / app.pageHeight);
  } else {
    app.ui.scrollbar.height = 0;
  }
};

const setPageOffset = (app: AppContent, offset: number) => {
  app.pageOffset = clampScrollPosition(app, offset);
  updateScrollbar(app);
};

export const forEachShape = (app: AppContent, cb: F1<Shape>) =>
  app.views.forEach(cb);

export const handleWheelEvent = (app: AppContent, deltaY: number) =>
  setPageOffset(app, app.pageOffset + deltaY);

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
    centerOnSelectedIfOutOfViewport(app);
  }
};

const closeItem = (app: AppContent, item: Item) => {
  item.isOpen = false;
  traversal.forEachOpenChild(item, (child) => removeAllItemViews(app, child));
  updateExistingItemPositions(app, sp.start, sp.start);
  updateOpenLine(app, item);
};

const openItem = (app: AppContent, item: Item) => {
  item.isOpen = true;
  const view = app.itemsToViews.get(item);
  if (view) {
    renderViews(app, item, view.circle.x + sp.xStep, view.circle.y + sp.yStep);
  }
  updateExistingItemPositions(app, sp.start, sp.start);
  updateOpenLine(app, item);
};

const removeItemFromTree = (app: AppContent, item: Item) => {
  const newSelection = removeItem(item);
  removeAllItemViews(app, item);
  traversal.forEachOpenChild(item, (child) => removeAllItemViews(app, child));
  changeSelection(app, () => newSelection);
  updateExistingItemPositions(app, sp.start, sp.start);
};

export const changeSelection = (
  app: AppContent,
  getNextItem: F2<Item, Item | undefined>
) => {
  const { selectedItem } = app;
  if (selectedItem) {
    const next = getNextItem(selectedItem);
    if (next) {
      unselect(app, selectedItem);
      select(app, next);
      centerOnSelectedIfOutOfViewport(app);
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

const select = (app: AppContent, item?: Item) => {
  if (item) {
    const views = app.itemsToViews.get(item);
    if (views) {
      views.circle.color = sp.selectedCircle;
      views.text.color = sp.selectedCircle;
    }
  }
  app.selectedItem = item;
};

const centerOnSelectedIfOutOfViewport = (app: AppContent) => {
  if (app.selectedItem) {
    const views = app.itemsToViews.get(app.selectedItem);
    if (views) {
      const circleY = views.circle.y;
      if (!isYPointOnScreen(app, circleY)) {
        const targetScreenPosition = circleY - canvas.canvas.height / 2;
        setPageOffset(app, targetScreenPosition);
      }
    }
  }
};

const isYPointOnScreen = (app: AppContent, y: number) =>
  y >= app.pageOffset && y <= app.pageOffset + canvas.canvas.height;

const clampScrollPosition = (app: AppContent, offset: number) =>
  clampNumber(offset, 0, app.pageHeight - canvas.canvas.height);

const renderViews = (
  app: AppContent,
  itemFocused: Item,
  x: number,
  y: number
) => {
  let yOffset = y;
  const openItems = new Set<Item>();
  const renderViewsInner = (item: Item, x: number) => {
    item.children.forEach((item) => {
      renderItem(app, item, x, yOffset);
      if (item.isOpen) openItems.add(item);
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0) {
        renderViewsInner(item, x + sp.xStep);
      }
    });
  };
  renderViewsInner(itemFocused, x);
  app.pageHeight = yOffset - sp.yStep + sp.start;
  updateScrollbar(app);
  openItems.forEach((i) => updateOpenItemLines(app, i));
};

const renderItem = (
  app: AppContent,
  item: Item,
  x: number,
  y: number
): ItemView => {
  const view = createItemViewAt(app, item, x, y);
  //this determines order of items
  if (view.childLine) app.views.add(view.childLine);
  if (view.openLine) app.views.add(view.openLine);
  app.views.add(view.text);
  app.views.add(view.circle);
  app.itemsToViews.set(item, view);
  return view;
};

const updateExistingItemPositions = (app: AppContent, x: number, y: number) => {
  let yOffset = y;
  const openItems = new Set<Item>();
  const updateItemPositions = (item: Item, x: number) => {
    item.children.forEach((item) => {
      const view = app.itemsToViews.get(item);
      if (item.isOpen) openItems.add(item);
      if (view) updateItemPosition(view, item, x, yOffset);
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0)
        updateItemPositions(item, x + sp.xStep);
    });
  };
  updateItemPositions(app.root, x);
  openItems.forEach((i) => updateOpenItemLines(app, i));
  app.pageHeight = yOffset - sp.yStep + sp.start;
  updateScrollbar(app);
};

const updateOpenLine = (app: AppContent, item: Item) => {
  const view = app.itemsToViews.get(item);
  if (view && view.openLine) {
    if (!item.isOpen) {
      view.openLine.end.x = view.openLine.start.x;
      view.openLine.end.y = view.openLine.start.y;
    } else {
      updateOpenItemLines(app, item);
    }
  }
};

const removeAllItemViews = (app: AppContent, item: Item) => {
  const view = app.itemsToViews.get(item);
  if (view) {
    app.views.delete(view.circle);
    app.views.delete(view.text);
    if (view.childLine) app.views.delete(view.childLine);
    if (view.openLine) app.views.delete(view.openLine);
    app.itemsToViews.delete(item);
  }
};

const clampNumber = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
