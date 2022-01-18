import { sp } from "../../design";
import { canvas, numbers } from "../../infra";
import { getMinimapWidth } from "../tree/minimap";

const CHART_SCALE = 2;
const ticks = [] as number[];
export const render = () => {
  const ctx = canvas.canvas.ctx;

  const w = canvas.canvas.width;
  const x = w - getMinimapWidth() - 100;

  ctx.save();
  ctx.shadowBlur = 10;
  canvas.drawRect(x, 20, 80, 80, sp.footer);

  ctx.textBaseline = "middle";
  ctx.textAlign = "right";

  drawScaleAt(100 - 16.6 * CHART_SCALE, "16.6ms");

  ticks.forEach((tick, index) => drawBar(x, tick, index));
  ctx.restore();
};

let renderStaretedAt = 0;
export const renderStart = () => {
  renderStaretedAt = performance.now();
};

export const renderFinished = () => {
  if (ticks.length > 80) ticks.shift();

  const diff = performance.now() - renderStaretedAt;
  ticks.push(diff);
};

const drawScaleAt = (y: number, label: string) => {
  const w = canvas.canvas.width;
  const x = w - getMinimapWidth() - 110;
  canvas.drawText(x + 2, y, label, 12, "gray");
  canvas.drawLine(x + 4, y, x + 8, y, "gray", 1);
};

const drawBar = (x: number, tick: number, index: number) => {
  const barColor = tick <= 1000 / 60 ? "green" : tick < 40 ? "yellow" : "red";

  const h = tick * CHART_SCALE;
  const barX = numbers.roundToHalf(x + index * 1);
  canvas.drawLine(barX, 100, barX, 100 - h, barColor, 1);
};
