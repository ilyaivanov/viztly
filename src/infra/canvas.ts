type CanvasState = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // later I will need cached canvas dimensions for scrollbars, modals, etc
  width: number;
  height: number;
};

export let canvas: CanvasState;

export const createFullscreenCanvas = (): HTMLCanvasElement => {
  const el = document.createElement("canvas");
  canvas = {
    el,
    ctx: el.getContext("2d")!,
    width: 0,
    height: 0,
  };
  updateHeight();
  window.addEventListener("resize", () => {
    updateHeight();
    resizeCbs.forEach((cb) => cb());
  });
  return el;
};

let resizeCbs: A[] = [];

export const addEventListener = (event: "resize", cb: A) => {
  if (event === "resize") resizeCbs.push(cb);
};

export const clear = () => canvas.ctx.clearRect(-20000, -20000, 40000, 40000);

export const updateHeight = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const scaleFactor = window.devicePixelRatio;
  canvas.el.width = canvas.width * scaleFactor;
  canvas.el.height = canvas.height * scaleFactor;
  canvas.ctx.scale(scaleFactor, scaleFactor);
};

export const setTranslation = (x: number, y: number) => {
  canvas.ctx.resetTransform();

  const scaleFactor = window.devicePixelRatio;
  canvas.ctx.scale(scaleFactor, scaleFactor);
  canvas.ctx.translate(x, y);
};

export const drawShape = (shape: Shape) => {
  if (shape.type === "circle") drawCircle(shape);
  if (shape.type === "text") drawText(shape);
};

const drawCircle = ({ x, y, r, color, filled }: Circle) => {
  const { ctx } = canvas;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
};

const drawText = ({ x, y, text, fontSize, color }: TextShape) => {
  canvas.ctx.font = `${fontSize}px Segoe UI, Ubuntu, Roboto, sans-serif`;
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillText(text, x, y);
};

export const drawRect = ({ x, y, width, height, color }: Rectangle) => {
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillRect(x, y, width, height);
};
