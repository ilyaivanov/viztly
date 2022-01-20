import { sp } from "../../design";
import { canvas, numbers } from "../../infra";
import { getMinimapWidth } from "../tree/minimap";

const CHART_SCALE = 2;
const TICKS_TO_SHOW = 200;
const ticks = [] as number[];

export const render = () => {
  const ctx = canvas.canvas.ctx;

  const w = canvas.canvas.width;
  const x = w - getMinimapWidth() - TICKS_TO_SHOW - 20;

  ctx.save();
  ctx.shadowBlur = 10;
  canvas.drawRect(x, 20, TICKS_TO_SHOW, 80, sp.footer);
  ctx.shadowBlur = 0;

  drawScaleAt(100 - 17 * CHART_SCALE, "17ms");

  ticks.forEach((tick, index) => drawBar(x, tick, index));
  ctx.restore();
};

let renderStaretedAt = 0;
export const renderStart = () => {
  renderStaretedAt = performance.now();
};

export const renderFinished = () => {
  if (ticks.length > TICKS_TO_SHOW) ticks.shift();

  const diff = performance.now() - renderStaretedAt;
  ticks.push(diff);
};

const drawScaleAt = (y: number, label: string) => {
  const ctx = canvas.canvas.ctx;
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  const w = canvas.canvas.width;
  const x = w - getMinimapWidth() - TICKS_TO_SHOW - 20;
  const yR = numbers.roundToHalf(y);
  canvas.drawText(x - 4, yR, label, 12, "gray");
  canvas.drawLine(x, yR, x + TICKS_TO_SHOW, yR, "#4A4A3B", 1);
};

const drawBar = (x: number, tick: number, index: number) => {
  const barColor = tick <= 1000 / 60 ? "green" : tick < 40 ? "yellow" : "red";

  const h = tick * CHART_SCALE;
  const barX = numbers.roundToHalf(x + index * 1);
  canvas.drawLine(barX, 100, barX, 100 - h, barColor, 1);
};
