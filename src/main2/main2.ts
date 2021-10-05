import { spacings } from "../designSystem";
import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import { createItem, createRoot } from "./domain";
import { ItemRow, List } from "./list";

const canvas = new Canvas();
const list = new List(
  createRoot([
    createItem("First"),
    createItem("Second"),
    createItem("Third"),
    createItem("Fourth"),
    createItem("Fifth"),
  ])
);
canvas.onResize = () => {
  render();
};

const render = () => {
  list.rows.forEach(drawItemRow);
};

const drawItemRow = (itemRow: ItemRow) => {
  canvas.drawCircle(itemRow.position, spacings.circleRadius, "white");
  canvas.drawText(
    add(itemRow.position, { x: 10, y: 16 * 0.32 }),
    itemRow.item.title,
    16,
    "white"
  );
};

render();
document.body.appendChild(canvas.el);
