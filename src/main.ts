import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import initialState from "./initialState";
import drawItemRow from "./list/drawItem";
import { List } from "./list/list";

const canvas = new Canvas();

const list = new List(initialState);

canvas.onResize = () => {
  canvas.ctx.translate(0, targetDelta);
  render();
};

const render = () => {
  canvas.clear();
  list.rows.forEach((view) => drawItemRow(view, canvas));
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") list.selectNextItem();
  if (e.code === "ArrowUp") list.selectPreviousItem();
  if (e.code === "ArrowLeft") {
    if (list.getSelectedItemRow().item.isOpen) list.closeSelectedItem();
    else list.selectParentItem();
  }
  if (e.code === "ArrowRight") {
    if (list.getSelectedItemRow().item.isOpen) list.selectNextItem();
    else list.openSelectedItem();
  }

  render();
});

let targetDelta = 0;
document.addEventListener("wheel", (e) => {
  targetDelta -= e.deltaY;
  canvas.ctx.resetTransform();
  canvas.ctx.translate(0, targetDelta);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
