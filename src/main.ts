import { c } from "./designSystem";
import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import {
  createItemViews,
  hasVisibleChildren,
  ItemViewModel,
  viewItem,
  visibleChildrenCount,
} from "./ItemView";
import { root } from "./store";

const canvas = new Canvas();
let visibleItems: ItemViewModel[] = createItemViews(root, 0, c.yBase);

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
    if (hasVisibleChildren(getSelectedItem().item))
      closeItem(getSelectedItem());
    else selectParent(getSelectedItem().item);

    render();
  }
  if (e.code === "ArrowRight") {
    const item = getSelectedItem().item;
    if (canBeOpen(item)) openItem(getSelectedItem());
    else if (hasVisibleChildren(item)) selectItem(item.children[0]);

    render();
  }
});

const closeItem = (itemView: ItemViewModel) => {
  const index = visibleItems.indexOf(itemView) + 1;

  //asumes items are of level2+
  const offset = visibleChildrenCount(itemView.item) * c.itemHeight;
  visibleItems.splice(index, visibleChildrenCount(itemView.item));
  visibleItems.slice(index).forEach((item) => (item.position.y -= offset));
  itemView.item.isOpen = false;
};

const openItem = (itemView: ItemViewModel) => {
  itemView.item.isOpen = true;
  const index = visibleItems.indexOf(itemView) + 1;
  const views = createItemViews(
    itemView.item,
    itemView.level + 1,
    itemView.position.y + itemView.itemHeight / 2
  );
  visibleItems.splice(index, 0, ...views);

  //asumes items are of level2+
  const offsetAdded = views.length * c.itemHeight;
  visibleItems
    .slice(index + views.length)
    .forEach((item) => (item.position.y += offsetAdded));
};

const selectItem = (item: Item) => {
  const index = visibleItems.findIndex((v) => v.item === item);
  selectItemAt(index);
};

const selectParent = (item: Item) => {
  const parentIndex = getParentIndex(item);
  selectItemAt(parentIndex);
};

const getParentIndex = (item: Item) =>
  visibleItems.findIndex((i) => i.item.children.indexOf(item) >= 0);

const getParentOfSelectedItem = () => {
  const parentIndex = getParentIndex(visibleItems[selectedItemIndex].item);
  return visibleItems[parentIndex];
};

const getSelectedItem = (): ItemViewModel => visibleItems[selectedItemIndex];

const canBeOpen = (item: Item) => !item.isOpen && item.children.length > 0;

const selectItemAt = (index: number) => {
  getParentOfSelectedItem()?.lineColor.animateTo(c.line);
  getSelectedItem().item.isSelected = false;
  selectedItemIndex = index;
  getParentOfSelectedItem()?.lineColor.animateTo(c.lineSelected);
  getSelectedItem().item.isSelected = true;
};

selectItemAt(0);
render();
