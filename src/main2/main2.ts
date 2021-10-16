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
  canvas.clear();
  list.rows.forEach(drawItemRow);
};

// this is called 60FPS,
// thus making this code faster will improve animation perfomance
const drawItemRow = (itemRow: ItemRow) => {
  canvas.drawCircle(itemRow.position, sp.circleRadius, itemRow.color);

  const fontSize = itemRow.level === 0 ? fontSizes.big : fontSizes.regular;

  canvas.drawText(
    add(itemRow.position, {
      x:
        itemRow.level == 0
          ? sp.zeroLevelCircleToTextDistance
          : sp.circleToTextDistance,
      y: fontSize * 0.32,
    }),
    itemRow.item.title,
    fontSize,
    itemRow.color
  );

  if (itemRow.childrenHeight) {
    const itemHeight =
      itemRow.level === 0 ? sp.zeroLevelItemHeight : sp.itemHeight;
    const start = add(itemRow.position, { x: 0, y: itemHeight / 2 });
    const end = add(start, { x: 0, y: itemRow.childrenHeight });
    canvas.drawLine(start, end, 2, itemRow.childrenColor);
  }
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") list.selectNextItem();
  if (e.code === "ArrowUp") list.selectPreviousItem();
  if (e.code === "ArrowLeft") list.selectParentItem();
  if (e.code === "ArrowRight") list.selectNextItem();

  render();
});

render();
document.body.appendChild(canvas.el);
