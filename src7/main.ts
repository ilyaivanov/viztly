import { MyCanvas } from "./canvas";
import { renderItemChildren } from "./tree.layouter";
import * as t from "./types";
import sp from "./spacings";
import { warmGrey } from "./pallete";

// import initialState from "./initialState";
import initialState from "./viztly.json";

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const canva = new MyCanvas(ctx);

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
  for (let x = 0; x < window.innerWidth; x += sp.gridSize) {
    for (let y = 0; y < window.innerHeight; y += sp.gridSize) {
      canva.fillRect(x - 1, y - 1, 2, 2, colors.gridPoint);
    }
  }
};

const drawCircleAndText = (item: t.Item, gridX: number, gridY: number) => {
  const x = gridX * sp.gridSize;
  const y = gridY * sp.gridSize;

  const isFilled = item.children.length > 0;
  const circleInnerColor = isFilled ? colors.circleFilled : colors.background;
  const r = sp.circleR;
  canva.outlineCircle(x, y, r, 2, colors.circleOutline, circleInnerColor);

  const xOffset = sp.textOffsetFromCircleCenter;
  const yOffset = 1;
  canva.fillTextAtMiddle(item.title, x + xOffset, y + yOffset, colors.text);
};

const lineToCircleDistance = 3;

//TODO: think about how to animate between lineBetween and boardChildtoParentLine
const lineBetween = (view1: t.ItemView, view2: t.ItemView) => {
  const x1 = view1.gridX * sp.gridSize - sp.circleR - lineToCircleDistance;
  const y1 = view1.gridY * sp.gridSize;

  const x2 = view2.gridX * sp.gridSize;
  const y2 = view2.gridY * sp.gridSize + sp.circleR + lineToCircleDistance;
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
  ctx.stroke();
};

const boardChildtoParentLine = (from: t.ItemView, to: t.ItemView) => {
  const x1 = from.gridX * sp.gridSize;
  const y1 = from.gridY * sp.gridSize - sp.circleR - lineToCircleDistance;

  const x2 = to.gridX * sp.gridSize;
  const y2 = to.gridY * sp.gridSize + sp.circleR + lineToCircleDistance;

  const middleYPoint = (from.gridY - 1) * sp.gridSize;
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, middleYPoint);
  ctx.lineTo(x2, middleYPoint);
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

const rootParsed = mapItem(initialState as any);

class App {
  renderChildren = (root: t.Item) => {
    const views = new Map<t.Item, t.ItemView>();

    renderItemChildren(root, views, 8, 2, canva.getTextWidth);

    for (const [item, view] of views) {
      if (item.parent) {
        const parentView = views.get(item.parent);
        if (parentView) {
          if (item.parent.view === "board")
            boardChildtoParentLine(view, parentView);
          else lineBetween(view, parentView);
        }
      }
      drawCircleAndText(item, view.gridX, view.gridY);
    }
  };
}

const app = new App();

canva.clearRect(colors.background);
drawGrid();

app.renderChildren(rootParsed);
