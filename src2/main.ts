import { Canvas } from "../src/infra/canvas";
import {
  createItem,
  createTree,
  selectNextItem,
  selectPreviousItem,
} from "./core";
import { flattenItems, ItemView } from "./view";

const canvas = new Canvas();

document.body.appendChild(canvas.el);

const tree = createTree(
  createItem("root", [
    createItem("Item 1", [createItem("Item 1.1")]),
    createItem("Item 2"),
  ])
);
let rows = flattenItems(tree);

const drawItem = (view: ItemView) => {
  canvas.ctx.fillStyle = view.color;
  canvas.drawCircle({ x: view.x, y: view.y }, 5, view.color);
  canvas.ctx.fillText(view.item.title, view.x + 10, view.y + 0.32 * 18);
};

const render = () => {
  canvas.clear();
  canvas.ctx.font = `18px Segoe UI`;
  rows.forEach(drawItem);
};

render();
canvas.onResize = render;

const updateRows = () => {
  rows = flattenItems(tree);
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") selectNextItem(tree);
  if (e.code === "ArrowUp") selectPreviousItem(tree);

  updateRows();
  render();
});
