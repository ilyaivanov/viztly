import { root } from "./store";

const createFullScreenCanvas = (): HTMLCanvasElement => {
  const res = document.createElement("canvas");

  const updateHeight = () => {
    res.setAttribute("width", window.innerWidth + "");
    res.setAttribute("height", window.innerHeight + "");
  };
  updateHeight();
  window.addEventListener("resize", () => {
    updateHeight();
    render();
  });
  return res;
};

const canvas = createFullScreenCanvas();
const ctx = canvas.getContext("2d")!;

document.body.appendChild(canvas);

const fontSize = 16;
const color2 = "#2A3135";

const drawCircle = (x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
};

const drawItem = (x: number, y: number, title: string) => {
  drawCircle(x, y, 3.5);
  const xText = x + 10;

  ctx.fillText(title, xText, y + fontSize * 0.3);
};

const xBase = 40;
const xStep = 25;

const render = () => {
  ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
  ctx.fillStyle = color2;
  ctx.font = `${fontSize}px Segoe UI`;
  let currentXOffset = 0;

  const viewItem = (item: Item, level: number) => {
    drawItem(xBase + level * xStep, xBase + currentXOffset * xStep, item.title);
    currentXOffset += 1;
    item.children.forEach((c) => viewItem(c, level + 1));
  };

  root.children.forEach((child) => viewItem(child, 0));

  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 40 - 13 + position * xStep, 400000, xStep);
};

let position = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    position += 1;
    render();
  }

  if (e.code === "ArrowUp") {
    position -= 1;
    render();
  }
});

render();
