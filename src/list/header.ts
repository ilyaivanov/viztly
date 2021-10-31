import { c, spacings } from "../designSystem";
import { Canvas } from "../infra/canvas";
import { drawChevron } from "../infra/icons";
import { getPath } from "../itemTree";
import { List } from "./list";

export const draw = (canvas: Canvas, list: List) => {
  const { ctx } = canvas;

  canvas.drawRect({ x: 0, y: 0 }, canvas.width, spacings.header, c.header);

  const items = getPath(list.root, list.itemFocused).reverse();

  if (items.length > 0) {
    ctx.fillStyle = "#dddddd";
    let offset = 20;
    drawChevron(canvas, offset, spacings.header / 2);
    offset += 12;
    ctx.font = `${14}px Segoe UI`;
    items.forEach((item) => {
      const width = ctx.measureText(item.title).width;
      ctx.fillText(item.title, offset, spacings.header / 2 + 0.33 * 14);
      offset += width + 12;
      drawChevron(canvas, offset, spacings.header / 2);
      offset += 12;
    });
  }
};
