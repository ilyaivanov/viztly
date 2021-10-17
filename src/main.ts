import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import initialState from "./initialState";
import drawItemRow from "./list/drawItem";
import { List } from "./list/list";
import Scrollbar from "./list/scrollbar";

const canvas = new Canvas();

const list = new List(initialState);

const scrollbar = new Scrollbar(canvas, list);

canvas.onResize = () => {
  scrollbar.translateCanvas();
  render();
};

const render = () => {
  canvas.clear();
  list.rows.forEach((view) => drawItemRow(view, canvas));
  scrollbar.draw();
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
  if (e.code === "Backspace" && e.altKey && e.shiftKey)
    list.removeSelectedItem();

  if (!scrollbar.isYPointOnScreen(list.getSelectedItemRow().position.y))
    scrollbar.centerScrollOn(list.getSelectedItemRow().position.y);

  render();
});

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
