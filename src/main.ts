import { AnimatedNumber, engine } from "./animationEngine";
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

const xBase = 40;
const yBase = 40;
const xStep = 25;
const yStep = 25;

type ItemViewModel = {
  xOffset: number;
  yOffset: number;
  item: Item;
};
const visibleItems: ItemViewModel[] = [];

let currentYOffset = yBase;

const viewItem = (item: Item, level: number) => {
  visibleItems.push({
    item,
    yOffset: currentYOffset,
    xOffset: xBase + level * xStep,
  });
  currentYOffset += yStep;
  item.children.forEach((c) => viewItem(c, level + 1));
};

root.children.forEach((child) => viewItem(child, 0));

const render = () => {
  const drawCircle = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawItem = (itemView: ItemViewModel) => {
    const {
      xOffset,
      yOffset,
      item: { title },
    } = itemView;
    drawCircle(xOffset, yOffset, 3.5);
    const xText = xOffset + 10;

    ctx.fillText(title, xText, yOffset + fontSize * 0.3);
  };

  ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
  ctx.fillStyle = color2;
  ctx.font = `${fontSize}px Segoe UI`;

  visibleItems.forEach(drawItem);

  drawSelectionBox();
};

const drawSelectionBox = () => {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, yBase - yStep / 2 + positionOffset.value, 400000, xStep);
};

let positionOffset = new AnimatedNumber();

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    positionOffset.animateToDelta(positionOffset.targetValue + xStep);
    render();
  }

  if (e.code === "ArrowUp") {
    positionOffset.animateToDelta(positionOffset.targetValue - xStep);
    render();
  }
});

engine.onRender = render;

render();
