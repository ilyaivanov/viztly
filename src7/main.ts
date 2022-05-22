import { MyCanvas } from "./canvas";
import { renderItemChildren } from "./tree.layouter";
import * as t from "./types";
import initialState from "./initialState";
import { warmGrey } from "./pallete";

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const canva = new MyCanvas(ctx);

const gridSize = 18;

const currentTheme = warmGrey;

const colors = {
  text: currentTheme["900"],

  circleOutline: currentTheme["500"],
  circleFilled: currentTheme["400"],

  lines: currentTheme["200"],

  gridPoint: currentTheme["200"],
  background: currentTheme["050"],
};

const drawGrid = () => {
  for (let x = 0; x < window.innerWidth; x += gridSize) {
    for (let y = 0; y < window.innerHeight; y += gridSize) {
      canva.fillRect(x - 1, y - 1, 2, 2, colors.gridPoint);
    }
  }
};

const circleR = 4;
const circleAtGridPoints = (
  gridX: number,
  gridY: number,
  innerColor?: string
) => {
  const x = gridX * gridSize;
  const y = gridY * gridSize;

  canva.outlineCircle(x, y, circleR, 2, colors.circleOutline, innerColor);
};

const drawLabel = (label: string, x: number, y: number) => {
  ctx.fillStyle = colors.text;
  ctx.textBaseline = "middle";
  ctx.font = "14px Roboto, sans-serif";
  const textXOffset = 10;
  const textYOffset = 1;
  ctx.fillText(label, x * gridSize + textXOffset, y * gridSize + textYOffset);
};

const itemAt = (item: t.Item, gridX: number, gridY: number) => {
  const isFilled = !item.isOpen && item.children.length > 0;
  circleAtGridPoints(
    gridX,
    gridY,
    isFilled ? colors.circleFilled : colors.background
  );
  drawLabel(item.title, gridX, gridY);
};

const lineBetween = (view1: t.ItemView, view2: t.ItemView) => {
  const x1 = view1.gridX * gridSize - circleR - 3;
  const y1 = view1.gridY * gridSize;

  const x2 = view2.gridX * gridSize;
  const y2 = view2.gridY * gridSize + circleR + 3;
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
  ctx.stroke();
};

const mapItem = (item: t.Item): t.Item => {
  const res: t.Item = item;
  res.children = item.children.map((c) => {
    const item = mapItem(c);
    item.parent = res;
    return item;
  });
  return res;
};

const rootParsed = mapItem(initialState);

class App {
  renderChildren = (root: t.Item) => {
    const views = new Map<t.Item, t.ItemView>();

    renderItemChildren(root, views, 10, 2);

    for (const [item, view] of views) {
      if (item.parent) {
        const parentView = views.get(item.parent);
        if (parentView) lineBetween(view, parentView);
      }
      itemAt(item, view.gridX, view.gridY);
    }
  };
}

const app = new App();

canva.clearRect(colors.background);
drawGrid();

app.renderChildren(rootParsed);
