type CanvasState = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  shapes: Set<Shape>;
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
    shapes: new Set(),
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

export const drawShapes = () => canvas.shapes.forEach(drawShape);

export const drawShape = (shape: Shape) => {
  if (shape.type === "circle")
    drawCircle(shape.x, shape.y, shape.r, shape.color, shape.filled);
  else if (shape.type === "text")
    drawText(shape.x, shape.y, shape.text, shape.fontSize, shape.color);
  else if (shape.type === "rectangle")
    drawRect(shape.x, shape.y, shape.width, shape.height, shape.color);
  else if (shape.type === "line")
    drawLine(
      shape.start.x,
      shape.start.y,
      shape.end.x,
      shape.end.y,
      shape.color,
      shape.width
    );
};

export const drawCircle = (
  x: number,
  y: number,
  r: number,
  color: string,
  filled = true
) => {
  const { ctx } = canvas;
  ctx.beginPath();
  const lineWidth = 1.5;
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  }
};

export const drawText = (
  x: number,
  y: number,
  text: string,
  fontSize: number,
  color: string
) => {
  canvas.ctx.font = `${fontSize}px Segoe UI, Ubuntu, Roboto, sans-serif`;
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillText(text, x, y);
};

export const drawRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillRect(x, y, width, height);
};

export const drawLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number
) => {
  canvas.ctx.strokeStyle = color;
  canvas.ctx.lineWidth = width;
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(x1, y1);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.stroke();
};
