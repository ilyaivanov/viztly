import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { createItemViews, ItemViewModel, viewItem } from "./ItemView";
import { root } from "./store";

const canvas = new Canvas();
let visibleItems: ItemViewModel[] = createItemViews(root);

const render = () => {
  canvas.clear();
  visibleItems.forEach((i) => viewItem(canvas, i));
};

canvas.onResize = render;
engine.onTick = render;

document.body.appendChild(canvas.el);

let selectedItemIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    if (selectedItemIndex < visibleItems.length - 1) {
      selectItemAt(selectedItemIndex + 1);
      render();
    }
  }
  if (e.code === "ArrowUp") {
    if (selectedItemIndex > 0) {
      selectItemAt(selectedItemIndex - 1);
      render();
    }
  }
  if (e.code === "ArrowLeft") {
    if (hasVisibleChildren(visibleItems[selectedItemIndex].item)) {
      visibleItems[selectedItemIndex].item.isOpen = false;
      visibleItems = createItemViews(root);
    } else {
      const parentIndex = getParentIndex(visibleItems[selectedItemIndex].item);
      selectItemAt(parentIndex);
    }
    render();
  }
  if (e.code === "ArrowRight") {
    const item = visibleItems[selectedItemIndex].item;
    if (canBeOpen(item)) {
      item.isOpen = true;
      visibleItems = createItemViews(root);
    } else if (hasVisibleChildren(item)) {
      selectItem(item.children[0]);
    }
    render();
  }
});

const selectItem = (item: Item) => {
  const index = visibleItems.findIndex((v) => v.item === item);
  console.log(index);
  selectItemAt(index);
};

const getParentIndex = (item: Item) =>
  visibleItems.findIndex((i) => i.item.children.indexOf(item) >= 0);

const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;

const canBeOpen = (item: Item) => !item.isOpen && item.children.length > 0;

const selectItemAt = (index: number) => {
  visibleItems[selectedItemIndex].item.isSelected = false;
  selectedItemIndex = index;
  visibleItems[selectedItemIndex].item.isSelected = true;
};

selectItemAt(0);
render();
