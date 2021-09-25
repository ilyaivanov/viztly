import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { randomInt } from "./infra/random";
import { createItemViews, ItemViewModel, viewItem } from "./ItemView";
import { root } from "./store";

const canvas = new Canvas();
const visibleItems: ItemViewModel[] = createItemViews(root);

const render = () => {
  canvas.clear();
  visibleItems.forEach((i) => viewItem(canvas, i));
};

canvas.onResize = render;
engine.onTick = render;

document.body.appendChild(canvas.el);

render();

document.addEventListener("keydown", (e) => {
  const index = randomInt(0, visibleItems.length);
  if (e.code === "ArrowRight") {
    visibleItems[index].xShift.animateToDelta(10);
  }
  if (e.code === "ArrowLeft") {
    visibleItems[index].xShift.animateToDelta(-10);
  }
});
