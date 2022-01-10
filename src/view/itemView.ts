import { isRoot } from "../tree/tree.traversal";
import { canvas } from "../infra";
import { sp } from "../design";
import { isSelected } from "../tree";
import { getMinimapWidth } from "./treeView";

export type ItemView2 = {
  opacity: number;

  x: number;
  y: number;

  isTextHidden?: boolean;
  item: Item;
};

export const draw = (
  { item, x, y, opacity, isTextHidden }: ItemView2,
  lastChild?: ItemView2
) => {
  const c = canvas;

  c.canvas.ctx.globalAlpha = opacity;

  if (item.parent && !isRoot(item.parent))
    c.drawLine(x, y, x - sp.xStep, y, sp.line, 2);

  if (lastChild) c.drawLine(x, y, x, lastChild.y, sp.line, 2);

  const color = isSelected(item) ? sp.selectedCircle : sp.regularColor;
  c.drawCircle(x, y, sp.circleR, color, item.children.length > 0);

  if (!isTextHidden) {
    const textX = x + sp.circleToTextDistance;
    const textY = y + 0.32 * sp.fontSize;
    c.drawText(textX, textY, item.title, sp.fontSize, color);
  }
};

export const drawTextOnMinimap = ({ item, x, y, opacity }: ItemView2) => {
  const c = canvas;
  c.canvas.ctx.globalAlpha = opacity;

  const color = isSelected(item) ? sp.selectedCircle : sp.minimapColor;
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;
  const xOffset = canvas.canvas.width - getMinimapWidth();
  c.drawText(
    xOffset + textX / sp.minimapScale,
    textY / sp.minimapScale,
    item.title,
    sp.fontSize / sp.minimapScale,
    color
  );
};

export const createItemView = (
  x: number,
  y: number,
  item: Item
): ItemView2 => ({ opacity: 1, x, y, item });