import { spacings as sp, colors, c } from "./designSystem";
import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { add } from "./infra/vector";
import { FlatednedList, FlatItemView } from "./specs/itemsLayout";
import { root } from "./store";

const canvas = new Canvas();
const list = new FlatednedList(root);

const viewItem = (view: FlatItemView) => {
  const { position, item, level } = view;

  const fontSize = level === 0 ? 22 : 14;
  const textPosition = add(position, { x: 10, y: fontSize * 0.32 });

  const color = view.textColor;
  canvas.drawCircle(position, sp.circleRadius, color);

  canvas.drawText(textPosition, item.title, fontSize, color);

  if (view.childrenBorder) {
    const b = view.childrenBorder;
    const endY = position.y + b.height;
    canvas.drawLine(
      add(position, { x: 0, y: sp.circleRadius }),
      { x: position.x, y: endY },
      2,
      b.color
    );
  }
};

const render = () => {
  canvas.clear();
  list.visibleItems.forEach(viewItem);
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
