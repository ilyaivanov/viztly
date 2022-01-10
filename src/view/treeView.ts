import {
  forEachOpenChild,
  getPreviousSiblingOrItemAbove,
} from "../tree/tree.traversal";
import { canvas } from "../infra";
import { sp } from "../design";
import { on, getFocused, getSelected } from "../tree";
import { createItemView, draw, drawTextOnMinimap, ItemView2 } from "./itemView";
import { animatePosition, spring } from "../infra/animations";
import { renderInputAt, updateInputCoords } from "./itemInput";

let itemToViews: Map<Item, ItemView2> = new Map();

export const drawTree = () => {
  itemToViews.forEach((item) => {
    const lastChild = item.item.isOpen
      ? itemToViews.get(item.item.children[item.item.children.length - 1])
      : undefined;
    draw(item, lastChild);
  });

  drawMinimap();
};

export const init = (focused: Item) => {
  viewItemChildren(focused, sp.start, sp.start);
};

export const subscribe = () => {
  on("item-toggled", toggleItem);
  on("item-moved", () => updatePositions(getFocused()));
  on("item-added", (item) => {
    const prevItem = getPreviousSiblingOrItemAbove(item);
    if (prevItem) {
      const prevView = itemToViews.get(prevItem);

      const view: ItemView2 = prevView
        ? createItemView(prevView.x, prevView.y, item)
        : createItemView(0, 0, item);
      itemToViews.set(item, view);
      updatePositions(getFocused());
    }
  });
  on("item-removed", (e) => {
    removeChildViewsForItem(e.itemRemoved);
    removeViewForItem(e.itemRemoved);
  });

  on("item-startEdit", (item) => {
    const view = itemToViews.get(item);
    if (view) {
      view.isTextHidden = true;

      renderInputAt(view.x, view.y, item.title);
    }
  });
  on("item-finishEdit", (item) => {
    const view = itemToViews.get(item);
    if (view) delete view.isTextHidden;
  });
};

export const updateSelectedItemInputCoords = () => {
  const s = getSelected();
  if (s) {
    const view = itemToViews.get(s);
    if (view) updateInputCoords(view.x, view.y);
  }
};

const toggleItem = (item: Item) => {
  const view = itemToViews.get(item);
  const isOpened = item.isOpen;
  if (view) {
    if (isOpened) {
      viewItemChildren(item, view.x, view.y);
      updatePositions(getFocused());
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
  updatePositions(getFocused());
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

const viewItemChildren = (item: Item, xStart: number, yStart: number) => {
  let yOffset = yStart;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;

    const view = createItemView(x, yOffset, item);
    itemToViews.set(item, view);

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
  };

  item.children.forEach((c) => step(c, 0));
};

const updatePositions = (item: Item) => {
  let yOffset = sp.start;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + sp.start;
    const itemView = itemToViews.get(item);

    if (itemView && (itemView.x !== x || itemView.y !== yOffset)) {
      animatePosition(itemView, x, yOffset);
    }

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
    }
  };

  item.children.forEach((c) => step(c, 0));
};

//minimap
const drawMinimap = () => {
  const c = canvas;
  c.canvas.ctx.globalAlpha = 1;

  const minimapWidth = getMinimapWidth();
  c.drawRect(
    canvas.canvas.width - minimapWidth,
    0,
    minimapWidth,
    canvas.canvas.height,
    "rgba(255,255,255,0.03)"
  );
  c.drawRect(
    canvas.canvas.width - minimapWidth,
    0,
    minimapWidth,
    canvas.canvas.height / sp.minimapScale,
    "rgba(255,255,255,0.1)"
  );
  itemToViews.forEach(drawTextOnMinimap);
};

export const getMinimapWidth = () =>
  Math.min(canvas.canvas.width / sp.minimapScale, 120);
