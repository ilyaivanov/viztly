import { spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";

const state = {
  isShown: false,
  progress: 0,
};

export const showModal = () => {
  state.isShown = true;
  spring(0, 1, (v) => {
    state.progress = v;
  });
};

export const draw = (canvas: Canvas) => {
  if (state.isShown) {
    canvas.ctx.fillStyle = `rgba(0,0,0,${state.progress * 0.3})`;
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    roundRect(
      canvas.ctx,
      canvas.width / 2 - 200 / 2,
      canvas.height / 2 - 400 / 2 + (1 - state.progress) * 40,
      200,
      400,
      10,
      `rgba(37,37,37,${state.progress})`
    );
  }
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
