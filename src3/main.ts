import { engine } from "../src/infra/animations";
import { Canvas } from "../src/infra/canvas";
import * as t from "./tree";
import { tree } from "./initialState";
type Item = t.Item;
const canvas = new Canvas();

document.body.appendChild(canvas.el);

const getTreeWidth = (parent: t.Item) => {
  let maxWidth = 0;

  const traverse = (item: t.Item) => {
    const view = map.get(item);
    if (view) {
      const width =
        view.x +
        canvas.ctx.measureText(item.title).width +
        circleToTextDistance;
      maxWidth = Math.max(width, maxWidth);
    }
    item.isOpen && item.children.forEach(traverse);
  };

  traverse(parent);
  return maxWidth;
};

const start = 50;
const xStep = 20;
const yStep = 20;

//design
const fontSize = 14;
const circleToTextDistance = 8;

const updateViews = (root: Item) => {
  map.clear();

  //returns height of the list
  const renderList = (x: number, y: number, parent: Item) => {
    let listStart = y;
    canvas.ctx.font = `${fontSize}px 'Ubuntu', sans-serif`;
    parent.children.forEach((item) => {
      if (item.view === "tree") listStart += renderTreeAt(x, listStart, item);
      else {
        map.set(item, createView(x, listStart, item));
        let tabHeights: number[] = [];
        let lastTreeWidth = 0;
        item.children.forEach((child, index) => {
          tabHeights.push(
            renderTreeAt(
              (index == 0 ? x : 0) + xStep + lastTreeWidth,
              listStart + yStep * 1.4,
              child
            )
          );
          lastTreeWidth = getTreeWidth(child);
        });
        listStart +=
          tabHeights.reduce((val, max) => Math.max(max, val), 0) + yStep * 1.4;
      }
    });
    return listStart - y + yStep;
  };

  const renderTreeAt = (
    x: number,
    y: number,
    item: Item,
    totalHeight = 0
  ): number => {
    map.set(item, createView(x, y, item));
    if (item.isOpen)
      return totalHeight + renderList(x + xStep, y + yStep, item);
    else return totalHeight + yStep;
  };

  renderList(start, start, root);
};

const map = new Map<Item, ItemView>();

const remove = () => {
  const itemToRemove = tree.selectedItem;
  const parent = itemToRemove?.parent;
  if (itemToRemove && parent) {
    t.selectPreviousItem(tree);
    parent.children = parent.children.filter((i) => i !== itemToRemove);
    updateViews(tree.root);
  }
};

const render = () => {
  canvas.clear();
  const views = Array.from(map.values());
  views.forEach((view) => {
    const parent = view.item.parent;
    if (parent) {
      const parentView = map.get(parent);
      if (parentView) {
        canvas.ctx.globalAlpha = view.opacity;
        if (parentView.item.view === "board")
          drawTabConnection(view.x, view.y, parentView.x, parentView.y);
        else drawItemConnection(view.x, view.y, parentView.x, parentView.y);
      }
    }
  });

  views.forEach((view) => drawItem(view));
};

const createView = (x: number, y: number, item: Item): ItemView => ({
  x,
  y,
  item,
  opacity: 1,
});

type ItemView = {
  x: number;
  y: number;
  opacity: number;
  item: Item;
};

const drawItem = ({ item, x, y, opacity }: ItemView) => {
  canvas.ctx.globalAlpha = opacity;
  canvas.ctx.fillStyle = item.isSelected ? "#ACE854" : "white";
  canvas.ctx.font = `${fontSize}px 'Ubuntu', sans-serif`;
  canvas.drawCircle({ x, y }, 3, item.isSelected ? "#ACE854" : "white");
  canvas.ctx.fillText(
    item.title,
    x + circleToTextDistance,
    y + 0.32 * fontSize
  );
};

const drawItemConnection = (x1: number, y1: number, x2: number, y2: number) => {
  canvas.ctx.strokeStyle = "#3C413D";
  canvas.ctx.lineWidth = 2;
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(x1, y1);
  canvas.ctx.lineTo(x2, y1);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.stroke();
};

const drawTabConnection = (x1: number, y1: number, x2: number, y2: number) => {
  canvas.ctx.strokeStyle = "#3C413D";
  canvas.ctx.lineWidth = 2;
  const height = Math.abs(y2 - y1);
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(x1, y1);
  canvas.ctx.lineTo(x1, y1 - height / 2);
  canvas.ctx.lineTo(x2, y1 - height / 2);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.stroke();
};

updateViews(tree.root);
render();
canvas.onResize = render;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (e.ctrlKey) {
      const s = tree.selectedItem;
      if (s) {
        s.view = s.view === "board" ? "tree" : "board";
        updateViews(tree.root);
      }
    } else remove();
  } else if (e.code === "ArrowRight") {
    if (e.ctrlKey) t.selectTabRight(tree);
    else if (tree.selectedItem && !tree.selectedItem.isOpen) {
      t.openItem(tree.selectedItem);
    } else if (tree.selectedItem) t.selectFirstChild(tree, tree.selectedItem);
  } else if (e.code === "ArrowLeft") {
    if (e.ctrlKey) t.selectTabLeft(tree);
    else if (tree.selectedItem && tree.selectedItem.isOpen) {
      t.closeItem(tree.selectedItem);
    } else if (tree.selectedItem) t.selectParent(tree, tree.selectedItem);
  } else if (e.code === "ArrowDown") t.selectNextItem(tree);
  else if (e.code === "ArrowUp") t.selectPreviousItem(tree);
  render();
});

engine.onTick = render;

document.fonts.onloadingdone = render;
