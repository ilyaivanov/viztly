import { c, spacings } from "../designSystem";
import { Canvas } from "../infra/canvas";
import { drawChevron } from "../infra/icons";

export const draw = (canvas: Canvas) => {
  canvas.drawRect({ x: 0, y: 0 }, canvas.width, spacings.header, c.header);

  const { ctx } = canvas;
  const labels = ["Music", "Light Metal", "nobody.one"];
  ctx.fillStyle = "#dddddd";
  let offset = 20;
  drawChevron(canvas, offset, spacings.header / 2);
  offset += 12;
  ctx.font = `${14}px Segoe UI`;
  labels.forEach((l) => {
    const width = ctx.measureText(l).width;
    ctx.fillText(l, offset, spacings.header / 2 + 0.32 * 14);
    offset += width + 12;
    drawChevron(canvas, offset, spacings.header / 2);
    offset += 12;
  });
};
