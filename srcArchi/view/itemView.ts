import { isRoot } from "../../src/domain/tree.traversal";
import { canvas } from "../../src/infra";
import { sp } from "../../src/view/design";
import { isSelected } from "../tree";

export type ItemView2 = {
  opacity: number;

  x: number;
  y: number;

  //while y is holding animated value, targetY is holding targeted value,
  //so that other elements can calculate proper position while animation is running
  targetY: number;

  lastChildOffset: number;
  item: Item;
};

export const draw = ({ item, x, y, opacity, lastChildOffset }: ItemView2) => {
  const c = canvas;

  c.canvas.ctx.globalAlpha = opacity;

  if (item.parent && !isRoot(item.parent))
    c.drawLine(x, y, x - sp.xStep, y, sp.line, 2);

  if (lastChildOffset) c.drawLine(x, y, x, y + lastChildOffset, sp.line, 2);

  const color = isSelected(item) ? sp.selectedCircle : sp.regularColor;
  c.drawCircle(x, y, sp.circleR, color, item.children.length > 0);
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;
  c.drawText(textX, textY, item.title, sp.fontSize, color);
};

export const drawTextOnMinimap = ({ item, x, y, opacity }: ItemView2) => {
  const c = canvas;
  c.canvas.ctx.globalAlpha = opacity;

  const color = isSelected(item) ? sp.selectedCircle : sp.regularColor;
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * sp.fontSize;
  const xOffset = canvas.canvas.width - canvas.canvas.width / sp.minimapScale;
  c.drawText(
    xOffset + textX / sp.minimapScale,
    textY / sp.minimapScale,
    item.title,
    sp.fontSize / sp.minimapScale,
    color
  );
};
