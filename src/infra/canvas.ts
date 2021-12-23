type CanvasState = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // later I will need cached canvas dimensions for scrollbars, modals, etc
  width: number;
  height: number;
};

let canvas: CanvasState;

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

export const drawCircle = (x: number, y: number, r: number, color: string) => {
  canvas.ctx.fillStyle = color;

  canvas.ctx.beginPath();
  canvas.ctx.arc(x, y, r, 0, 2 * Math.PI);
  canvas.ctx.fill();
};

export const drawText = (
  x: number,
  y: number,
  text: string,
  fontSize: number,
  color: string
) => {
  canvas.ctx.font = `${fontSize}px Segoe UI, Ubuntu`;
  canvas.ctx.fillStyle = color;
  canvas.ctx.fillText(text, x, y);
};
