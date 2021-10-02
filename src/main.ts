import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { drawItem } from "./specs/drawItem";
import { FlatednedList } from "./specs/itemsLayout";
import { root } from "./store";

const canvas = new Canvas();
const list = new FlatednedList(root);

const render = () => {
  canvas.clear();
  list.visibleItems.forEach((item) => drawItem(item, canvas));
};

canvas.onResize = render;
engine.onTick = render;

document.body.appendChild(canvas.el);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    list.selectNextItem();
    render();
  }
  if (e.code === "ArrowUp") {
    list.selectPreviousItem();
    render();
  }
  if (e.code === "ArrowLeft") {
    const item = list.getSelectedItem();
    if (item.isOpen && item.children.length > 0) list.closeSelected();
    else list.selectParent();
    render();
  }
  if (e.code === "ArrowRight") {
    const item = list.getSelectedItem();
    if (!item.isOpen && item.children.length > 0) list.openSelected();
    else list.selectNextItem();
    render();
  }
});

render();
