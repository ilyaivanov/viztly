import { sp } from "../../design";
import { canvas, numbers } from "../../infra";
import { spring } from "../../infra/animations";
import { getSelected, isSelected } from "../../tree";
import { getPlayerHeight } from "../player/player";
import { drawTextOnMinimap, ItemView2 } from "./itemView";

export let canvasOffset = 0;
export const drawMinimap = (
  itemToViews: Map<Item, ItemView2>,
  pageHeight: number
) => {
  const c = canvas;
  const ctx = c.canvas.ctx;
  ctx.globalAlpha = 1;

  const minimapWidth = getMinimapWidth();
  ctx.shadowColor = "black";
  ctx.shadowBlur = 5;
  c.drawRect(
    canvas.canvas.width - minimapWidth,
    0,
    minimapWidth,
    canvas.canvas.height,
    sp.background
  );
  ctx.shadowBlur = 0;

  c.drawRect(
    canvas.canvas.width - minimapWidth,
    getScrollbarOffset(pageHeight, c.canvas.height),
    minimapWidth,
    (canvas.canvas.height - getPlayerHeight()) / sp.minimapScale,
    "rgba(255,255,255,0.1)"
  );

  c.setTranslation(0, getMinimapOffset(pageHeight, c.canvas.height));
  itemToViews.forEach((view) => drawTextOnMinimap(view, isSelected(view.item)));
  const s = getSelected();
  if (s) {
    const selectedView = itemToViews.get(s);
    if (selectedView) {
      c.canvas.ctx.globalAlpha = 0.6;
      c.drawRect(
        canvas.canvas.width - minimapWidth,
        selectedView.y / sp.minimapScale - sp.yStep / 2 / sp.minimapScale,
        minimapWidth,
        sp.yStep / sp.minimapScale,
        sp.selectedCircle
      );
      c.canvas.ctx.globalAlpha = 1;
    }
  }
  c.resetTranslation();
};

export const getMinimapWidth = () =>
  Math.min(canvas.canvas.width / sp.minimapScale, 120);

export const resetOffset = () => (canvasOffset = 0);

export const appendToOffset = (delta: number, pageHeight: number) => {
  if (pageHeight > canvas.canvas.height) {
    const nextValue = canvasOffset + delta;

    canvasOffset = clampOffset(nextValue, pageHeight);
  } else canvasOffset = 0;
};

export const centerOnItem = (view: ItemView2, pageHeight: number) => {
  spring(
    canvasOffset,
    clampOffset(view.targetY - canvas.canvas.height / 2, pageHeight),
    (v) => {
      canvasOffset = v;
    }
  );
};

export const isItemOnScreen = (view: ItemView2) =>
  view.targetY >= canvasOffset &&
  view.targetY <= canvasOffset + canvas.canvas.height;

const getScrollbarOffset = (page: number, canvasHeight: number) => {
  if (page / sp.minimapScale < canvasHeight)
    return canvasOffset / sp.minimapScale;

  const canvasOffsetCoef = canvasOffset / (page - canvasHeight);
  return (canvasHeight - canvasHeight / sp.minimapScale) * canvasOffsetCoef;
};

const getMinimapOffset = (page: number, canvasHeight: number) => {
  if (page / sp.minimapScale < canvasHeight) return 0;
  return (
    -canvasOffset / sp.minimapScale + getScrollbarOffset(page, canvasHeight)
  );
};

const clampOffset = (offset: number, pageHeight: number) => {
  if (pageHeight < canvas.canvas.height) return 0;
  return numbers.clamp(offset, 0, pageHeight - canvas.canvas.height);
};
