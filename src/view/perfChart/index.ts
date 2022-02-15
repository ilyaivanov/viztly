import { sp } from "../../design";
import { canvas, numbers } from "../../infra";

const CHART_SCALE = 2;
const TICKS_TO_SHOW = 200;
const ticks = [] as number[];

const chartHeight = 80;
const chartMargin = 40;
const getMinimapX = () => chartMargin;
const getMinimapY = () => canvas.canvas.height - chartHeight - chartMargin;

export const render = () => {
  if (!isShown) return;
  const ctx = canvas.canvas.ctx;

  ctx.save();
  ctx.shadowBlur = 10;
  const x = getMinimapX();
  const y = getMinimapY();
  canvas.drawRect(x, y, TICKS_TO_SHOW, chartHeight, sp.footer);
  ctx.shadowBlur = 0;

  drawScaleAt(y + chartHeight - 17 * CHART_SCALE, "17ms");

  ticks.forEach((tick, index) => drawBar(x, y + chartHeight, tick, index));
  ctx.restore();
};

let isShown = false;
export const toggleVisibility = () => (isShown = !isShown);

let renderStaretedAt = 0;
export const renderStart = () => {
  if (isShown) renderStaretedAt = performance.now();
};

export const renderFinished = () => {
  if (isShown) {
    if (ticks.length > TICKS_TO_SHOW) ticks.shift();

    const diff = performance.now() - renderStaretedAt;
    ticks.push(diff);
  }
};

const drawScaleAt = (y: number, label: string) => {
  const ctx = canvas.canvas.ctx;
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  const x = getMinimapX();
  const yR = numbers.roundToHalf(y);
  canvas.drawText(x - 4, yR, label, 12, "gray");
  canvas.drawLine(x, yR, x + TICKS_TO_SHOW, yR, "#4A4A3B", 1);
};

const drawBar = (x: number, y: number, tick: number, index: number) => {
  const barColor = tick <= 1000 / 60 ? "green" : tick < 40 ? "yellow" : "red";

  const h = tick * CHART_SCALE;
  const barX = numbers.roundToHalf(x + index * 1);
  canvas.drawLine(barX, y, barX, y - h, barColor, 1);
};
