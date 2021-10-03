import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { drawItem } from "./flatlist/drawItem";
import { FlatednedList } from "./flatlist/FlatednedList";
import { root } from "./store";
import { c, spacings } from "./designSystem";

const canvas = new Canvas();
const list = new FlatednedList(root);

const render = () => {
  canvas.clear();
  const scrollHeight = getScrollbarHeight(
    list.getContentHeight(),
    canvas.height
  );
  if (scrollHeight) canvas.ctx.translate(0, contentOffset);

  list.visibleItems.forEach((item) => drawItem(item, canvas));
  canvas.ctx.resetTransform();

  const scrollWidth = spacings.scrollWidth;

  if (scrollHeight) {
    const scrollbarPosition = {
      x: canvas.width - scrollWidth,
      y: -getScrollbarOffset(list.getContentHeight(), canvas.height),
    };
    canvas.drawRect(scrollbarPosition, scrollWidth, scrollHeight, c.scrollbar);
  }
};

canvas.onResize = () => {
  render();
};

engine.onTick = render;

document.body.appendChild(canvas.el);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    list.selectNextItem();
    centerOnSelectedItemIfOutsideWindow();
    render();
  }
  if (e.code === "ArrowUp") {
    list.selectPreviousItem();
    centerOnSelectedItemIfOutsideWindow();
    render();
  }
  if (e.code === "ArrowLeft") {
    const item = list.getSelectedItem();
    if (item.isOpen && item.children.length > 0) list.closeSelected();
    else list.selectParent();
    centerOnSelectedItemIfOutsideWindow();
    render();
  }
  if (e.code === "ArrowRight") {
    const item = list.getSelectedItem();
    if (!item.isOpen && item.children.length > 0) list.openSelected();
    else list.selectNextItem();
    centerOnSelectedItemIfOutsideWindow();
    render();
  }

  if (e.code === "Backspace" && e.ctrlKey && e.shiftKey) {
    list.removeSelected();
    render();
  }
});

document.addEventListener("wheel", (e) => {
  const contentHeight = list.getContentHeight();
  if (contentHeight > canvas.height) {
    contentOffset = clampContentOffset(contentOffset - e.deltaY);
    render();
  }
});

const centerOnSelectedItemIfOutsideWindow = () => {
  const itemPosition = list.visibleItems[list.selectedItemIndex].position;
  if (
    itemPosition.y > -contentOffset + canvas.height ||
    itemPosition.y < -contentOffset
  ) {
    contentOffset = clampContentOffset(-(itemPosition.y - canvas.height / 2));
  }
};

let contentOffset = 0;
const getScrollbarHeight = (contentHeight: number, windowHeight: number) =>
  windowHeight < contentHeight
    ? (windowHeight * windowHeight) / contentHeight
    : undefined;

const getScrollbarOffset = (contentHeight: number, windowHeight: number) =>
  contentOffset * (windowHeight / contentHeight);

render();

const clampContentOffset = (newOffset: number) => {
  const maxOffset = list.getContentHeight() - canvas.height;
  return clamp(newOffset, -maxOffset, 0);
};

//utils
const clamp = (val: number, min: number, max: number) => {
  if (val < min) return min;
  else if (val > max) return max;
  else return val;
};
