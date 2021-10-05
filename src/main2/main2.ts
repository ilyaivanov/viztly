import { c, fontSizes, spacings as sp } from "../designSystem";
import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import { createItem, createRoot } from "./domain";
import { ItemRow, List } from "./list";

const canvas = new Canvas();
const list = new List(
  createRoot([
    createItem("First", [
      createItem("First.1"),
      createItem("First.2"),
      createItem("First.3"),
    ]),
    createItem("Second", [
      createItem("Second.1", [
        createItem("Second.1.1"),
        createItem("Second.2.2"),
        createItem("Second.3.3"),
      ]),
    ]),
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
  canvas.drawCircle(itemRow.position, sp.circleRadius, "white");

  const font = itemRow.level === 0 ? fontSizes.big : fontSizes.regular;
  canvas.drawText(
    add(itemRow.position, { x: 10, y: font * 0.32 }),
    itemRow.item.title,
    font,
    "white"
  );

  if (itemRow.childrenHeight) {
    const itemHeight =
      itemRow.level === 0 ? sp.zeroLevelItemHeight : sp.itemHeight;
    const start = add(itemRow.position, { x: 0, y: itemHeight / 2 });
    const end = add(start, { x: 0, y: itemRow.childrenHeight });
    canvas.drawLine(start, end, 2, c.line);
  }
};

render();
document.body.appendChild(canvas.el);
