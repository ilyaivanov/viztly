import {
  forEachOpenChild,
  getPreviousSiblingOrItemAbove,
} from "../../tree/tree.traversal";
import { sp } from "../../design";
import {
  on,
  getFocused,
  getSelected,
  isSelected,
  loadChildren,
} from "../../tree";
import { createItemView, draw, ItemView2 } from "./itemView";
import { spring } from "../../infra/animations";
import { renderInputAt, updateInputCoords } from "../itemInput";
import * as minimap from "./minimap";
import { canvas, engine, fn } from "../../infra";
import { setChildren } from "../../tree/tree.crud";
import * as treeLayouter from "./tree.layouter";

let itemToViews: Map<Item, ItemView2> = new Map();

let itemBeingEdited: Item | undefined;
export const drawTree = () => {
  canvas.setTranslation(getLeftOffest(), -minimap.canvasOffset);
  itemToViews.forEach((view) => {
    const lastChild = view.item.isOpen
      ? itemToViews.get(view.item.children[view.item.children.length - 1])
      : undefined;
    draw(view, isSelected(view.item), itemBeingEdited == view.item, lastChild);
  });

  canvas.resetTranslation();
  minimap.drawMinimap(itemToViews, getPageHeight());
};

export const init = () => {
  itemToViews.clear();
  const f = getFocused();
  treeLayouter.renderItemChildren(itemToViews, f, sp.start, sp.start);
};

const searchDebounced = fn.debounce(loadChildren, 600);

const itemChildrenLoaded = (item: Item, children: Item[]) => {
  removeChildViewsForItem(item);
  setChildren(item, children);
  toggleItem(item);
  engine.onTick && engine.onTick();
};
export const subscribe = () => {
  on("item-toggled", toggleItem);
  on("item-focused", refocus);
  on("init", init);
  on("item-moved", () => {
    treeLayouter.updatePositionsForItemAndChildren(itemToViews, getFocused());
    centerOnSelectedItemIfOffscreen();
  });
  on("item-added", (item) => {
    const prevItem = getPreviousSiblingOrItemAbove(item);
    if (prevItem) {
      const prevView = itemToViews.get(prevItem);

      const view: ItemView2 = prevView
        ? createItemView(prevView.x, prevView.y, item)
        : createItemView(0, 0, item);
      itemToViews.set(item, view);
      treeLayouter.updatePositionsForItemAndChildren(itemToViews, getFocused());
      centerOnSelectedItemIfOffscreen();
    }
  });
  on("item-removed", (e) => {
    removeChildViewsForItem(e.itemRemoved);
    removeViewForItem(e.itemRemoved);
  });

  on("item-children-loaded", (e) => itemChildrenLoaded(e.item, e.children));
  on("selection-changed", centerOnSelectedItemIfOffscreen);

  on("item-startEdit", (item) => {
    itemBeingEdited = item;
    const view = itemToViews.get(item);
    if (view) {
      const onInput = (e: Event) => {
        if (e.currentTarget) {
          const input = e.currentTarget as HTMLInputElement;
          if (
            input.value.trimStart().startsWith("/y") &&
            item.type !== "YTsearch"
          ) {
            item.type = "YTsearch";
            input.value = input.value.slice(2);
            engine.onTick && engine.onTick();
          } else if (item.type === "YTsearch" && input.value) {
            item.title = input.value;
            if (item.title.trim().length > 0) searchDebounced(item);
          }
        }
      };
      renderInputAt(getLeftOffest() + view.x, view.y, item.title, onInput);
    }
  });
  on("item-finishEdit", () => {
    itemBeingEdited = undefined;
  });
};

export const updateSelectedItemInputCoords = () => {
  const s = getSelected();
  if (s) {
    const view = itemToViews.get(s);
    if (view) updateInputCoords(getLeftOffest() + view.x, view.y);
  }
};

export const getPageHeight = () => {
  let max = 0;
  //TODO: this can be cached and updates in updatePositions
  itemToViews.forEach((view) => {
    if (max < view.y) max = view.y;
  });
  return max + sp.start + 100; //100 pixels is for the player
};

const centerOnSelectedItemIfOffscreen = () => {
  const selected = getSelected();
  if (selected) {
    const view = itemToViews.get(selected);
    if (view && !minimap.isItemOnScreen(view))
      minimap.centerOnItem(view, getPageHeight());
  }
};

const toggleItem = (item: Item) => {
  const view = itemToViews.get(item);
  const isOpened = item.isOpen;
  if (view) {
    if (isOpened) {
      treeLayouter.renderItemChildren(itemToViews, item, view.x, view.y);
      treeLayouter.updatePositionsForItemAndChildren(itemToViews, getFocused());
      forEachOpenChild(item, (i) => {
        const view = itemToViews.get(i);
        if (view) spring(0, 1, (v) => (view.opacity = v));
      });
    } else {
      removeChildViewsForItem(item);
    }
  }
};

const removeChildViewsForItem = (item: Item) => {
  forEachOpenChild(item, removeViewForItem);
  treeLayouter.updatePositionsForItemAndChildren(itemToViews, getFocused());
};

const removeViewForItem = (item: Item) => {
  const view = itemToViews.get(item);
  if (view) {
    spring(view.x, view.x - sp.xStep, (val, isEnded) => {
      view.x = val;
      if (isEnded && itemToViews.get(item) === view) {
        itemToViews.delete(item);
      }
    });
    spring(view.opacity, 0, (v) => (view.opacity = v));
  }
};

const refocus = ({ prev, current }: { prev: Item; current: Item }) => {
  itemToViews.clear();
  treeLayouter.renderItemChildren(itemToViews, current, sp.start, sp.start);
  centerOnSelectedItemIfOffscreen();
};

const getLeftOffest = () => Math.max((canvas.canvas.width - 800) / 2, 0);
