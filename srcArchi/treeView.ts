import { forEachOpenChild } from "../src/domain/tree.traversal";
import { canvas } from "../src/infra";
import { sp } from "../src/view/design";
import { on, AppEvents, getFocused } from "./tree";
import { draw, drawTextOnMinimap, ItemView2 } from "./itemView";
import { animatePosition, spring, springKeyed } from "../src/infra/animations";

let itemToViews: Map<Item, ItemView2> = new Map();

export const drawTree = () => {
  itemToViews.forEach(draw);

  drawMinimap();
};

export const init = (focused: Item) => {
  viewItemChildren(focused, sp.start, sp.start);
};

export const subscribe = () => {
  on("item-toggled", toggleItem);
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
      forEachOpenChild(item, (i) => {
        const view = itemToViews.get(i);
        if (view) {
          animatePosition(view, view.x - sp.xStep, view.y, () => {
            //checking if this animating view is still under item
            if (itemToViews.get(i) === view) itemToViews.delete(i);
          });
          spring(1, 0, (v) => (view.opacity = v));
        }
      });
      if (view) {
        spring(view.lastChildOffset, 0, (v) => (view.lastChildOffset = v));
      }
      updatePositions(getFocused());
    }
  }
};

const viewItemChildren = (item: Item, xStart: number, yStart: number) => {
  let yOffset = yStart;

  const res: Shape[] = [];
  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + xStart;

    const view: ItemView2 = {
      opacity: 1,
      x,
      targetY: yOffset,
      y: yOffset,
      item,
      lastChildOffset: 0,
    };
    itemToViews.set(item, view);

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));

      const lastChildView = itemToViews.get(
        item.children[item.children.length - 1]
      );
      if (lastChildView) view.lastChildOffset = lastChildView.y - view.y + 1;
    }
  };

  item.children.forEach((c) => step(c, 0));
  return res;
};

const updatePositions = (item: Item) => {
  let yOffset = sp.start;

  const step = (item: Item, level: number) => {
    const x = level * sp.xStep + sp.start;
    const itemView = itemToViews.get(item);

    if (itemView && (itemView.x !== x || itemView.y !== yOffset)) {
      itemView.targetY = yOffset;
      animatePosition(itemView, x, yOffset);
    }

    yOffset += sp.yStep;
    if (item.isOpen && item.children.length > 0) {
      item.children.forEach((c) => step(c, level + 1));
      const lastChildView = itemToViews.get(
        item.children[item.children.length - 1]
      );
      if (itemView && lastChildView)
        itemView.lastChildOffset = lastChildView.targetY - itemView.targetY + 1;
    }
  };

  item.children.forEach((c) => step(c, 0));
};

//minimap
const drawMinimap = () => {
  const c = canvas;
  c.canvas.ctx.globalAlpha = 1;

  const minimapWidth = c.canvas.width / sp.minimapScale;
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
