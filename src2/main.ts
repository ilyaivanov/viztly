import { engine } from "../src/infra/animations";
import { Canvas } from "../src/infra/canvas";
import {
  closeItem,
  createItem,
  createItemClosed,
  createTree,
  openItem,
  selectFirstChild,
  selectNextItem,
  selectParent,
  selectPreviousItem,
} from "./core";
import { createList, forEachView, ItemView, sp, updateList } from "./view";

const canvas = new Canvas();

document.body.appendChild(canvas.el);

const tree = createTree(
  createItem("root", [
    createItem("Item 1", [
      createItem("Item 1.1", [
        createItem("Item 1.1.1"),
        createItem("Item 1.1.2"),
        createItem("Item 1.1.2"),
      ]),
    ]),
    createItem("Item 2", [
      createItem("Item 2.1", [
        createItem("Item 2.1.1"),
        createItem("Item 2.1.2"),
        createItem("Item 2.1.3"),
        createItem("Item 2.1.4"),
        createItem("Item 2.1.5"),
        createItem("Item 2.1.6"),
      ]),
    ]),
    createItemClosed("Item 3", [
      createItem("Item 3.1", [
        createItem("Item 3.1.1"),
        createItem("Item 3.1.2"),
        createItem("Item 3.1.3"),
        createItem("Item 3.1.4"),
        createItem("Item 3.1.5"),
        createItem("Item 3.1.6"),
      ]),
    ]),
    createItem("Item 3"),
    createItem("Item 4"),
    createItem("Item 5"),
    createItem("Item 6"),
    createItem("Item 7"),
    createItem("Item 8"),
  ])
);
let list = createList(tree);

const drawItem = (view: ItemView) => {
  const { item } = view;
  canvas.ctx.globalAlpha = view.opacity;
  canvas.ctx.fillStyle = view.color;
  canvas.drawCirclePath(view.position, view.circleRadius, view.color);
  if (!view.isCircleEmpty)
    canvas.drawCircle(view.position, view.circleRadius, view.color);
  canvas.drawText(view.textPosition, item.title, sp.fontSize, view.color);
};

const render = () => {
  canvas.clear();
  canvas.ctx.font = `${sp.fontSize}px Segoe UI`;
  forEachView(list, drawItem);
};

render();
canvas.onResize = render;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") selectNextItem(tree);
  if (e.code === "ArrowLeft") {
    if (tree.selectedItem) {
      if (tree.selectedItem.isOpen) closeItem(tree.selectedItem);
      else selectParent(tree, tree.selectedItem);
    }
  }
  if (e.code === "ArrowRight") {
    if (tree.selectedItem) {
      if (!tree.selectedItem.isOpen) openItem(tree.selectedItem);
      else selectFirstChild(tree, tree.selectedItem);
    }
  }
  if (e.code === "ArrowUp") selectPreviousItem(tree);

  updateList(list, tree);
  render();
});

engine.onTick = render;
