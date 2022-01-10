import { sp } from "../design";
import { canvas, numbers } from "../infra";
import { spring } from "../infra/animations";
import { drawTextOnMinimap, ItemView2 } from "./itemView";

export let canvasOffset = 0;
export const drawMinimap = (itemToViews: Map<Item, ItemView2>) => {
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
    canvasOffset / sp.minimapScale,
    minimapWidth,
    canvas.canvas.height / sp.minimapScale,
    "rgba(255,255,255,0.1)"
  );
  itemToViews.forEach(drawTextOnMinimap);
};

export const getMinimapWidth = () =>
  Math.min(canvas.canvas.width / sp.minimapScale, 120);

export const appendToOffset = (delta: number, pageHeight: number) => {
  if (pageHeight > canvas.canvas.height) {
    const nextValue = canvasOffset + delta;

    canvasOffset = clampOffset(nextValue, pageHeight);
  } else canvasOffset = 0;
};

export const centerOnItem = (view: ItemView2, pageHeight: number) => {
  spring(
    canvasOffset,
    clampOffset(view.y - canvas.canvas.height / 2, pageHeight),
    (v) => {
      canvasOffset = v;
    }
  );
};

export const isItemOnScreen = (view: ItemView2) =>
  view.y >= canvasOffset && view.y <= canvasOffset + canvas.canvas.height;

const clampOffset = (offset: number, pageHeight: number) =>
  numbers.clamp(offset, 0, pageHeight - canvas.canvas.height);
