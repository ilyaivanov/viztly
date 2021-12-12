import { engine } from "../src/infra/animations";
import { Canvas } from "../src/infra/canvas";
import { onKeyDown } from "./keyboard";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistance";
import { isEditing, stopEditing } from "./itemInput";
import { sp } from "./design";

let localTree = loadFromLocalStorage();
const canvas = new Canvas();

document.body.appendChild(canvas.el);

const getTreeWidth = (parent: Item) => {
  let maxWidth = 0;

  const traverse = (item: Item) => {
    const view = map.get(item);
    if (view) {
      const width =
        view.x +
        canvas.ctx.measureText(item.title).width +
        sp.circleToTextDistance;
      maxWidth = Math.max(width, maxWidth);
    }
    item.isOpen && item.children.forEach(traverse);
  };

  traverse(parent);
  return maxWidth;
};

const updateViews = (root: Item) => {
  map.clear();
  console.log("rebulding views map");

  //returns height of the list
  const renderList = (x: number, y: number, parent: Item) => {
    let listStart = y;
    canvas.ctx.font = `${sp.fontSize}px 'Segoe UI', sans-serif`;
    parent.children.forEach((item) => {
      if (item.view === "tree") listStart += renderTreeAt(x, listStart, item);
      else {
        map.set(item, createView(x, listStart, item));
        if (item.isOpen) {
          let tabHeights: number[] = [];
          let lastTreeWidth = 0;
          item.children.forEach((child, index) => {
            tabHeights.push(
              renderTreeAt(
                (index == 0 ? x : 0) + sp.xStep + lastTreeWidth,
                listStart + sp.yStep * 1.4,
                child
              )
            );
            lastTreeWidth = getTreeWidth(child);
          });
          listStart +=
            tabHeights.reduce((val, max) => Math.max(max, val), 0) +
            sp.yStep * 1.4;
        } else {
          listStart += sp.yStep;
        }
      }
    });
    return listStart - y + sp.yStep;
  };

  const renderTreeAt = (
    x: number,
    y: number,
    item: Item,
    totalHeight = 0
  ): number => {
    map.set(item, createView(x, y, item));
    if (item.isOpen)
      return totalHeight + renderList(x + sp.xStep, y + sp.yStep, item);
    else return totalHeight + sp.yStep;
  };

  renderList(sp.start, sp.start, root);
};

const map = new Map<Item, ItemView>();

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

const drawItem = ({ item, x, y, opacity }: ItemView) => {
  const color = item == localTree.selectedItem ? "#ACE854" : "white";
  canvas.ctx.globalAlpha = opacity;

  if (item.children.length === 0) {
    //drawing this circle ho hide connection edge, which is visible inside open circle
    canvas.drawCircle({ x, y }, 3, "#1e1e1e");
    canvas.drawCirclePath({ x, y }, 3, color);
  } else canvas.drawCircle({ x, y }, 3, color);

  if (item !== localTree.itemEdited) {
    canvas.ctx.fillStyle = color;
    canvas.ctx.font = `${sp.fontSize}px 'Segoe UI', sans-serif`;
    canvas.ctx.fillText(
      item.title,
      x + sp.circleToTextDistance,
      y + 0.32 * sp.fontSize
    );
  }
};

const drawItemConnection = (x1: number, y1: number, x2: number, y2: number) => {
  canvas.ctx.strokeStyle = "#3C413D";
  canvas.ctx.lineWidth = 1.5;
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(x1, y1);
  canvas.ctx.lineTo(x2, y1);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.stroke();
};

const drawTabConnection = (x1: number, y1: number, x2: number, y2: number) => {
  canvas.ctx.strokeStyle = "#3C413D";
  canvas.ctx.lineWidth = 1.5;
  const height = Math.abs(y2 - y1);
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(x1, y1);
  canvas.ctx.lineTo(x1, y1 - height / 2);
  canvas.ctx.lineTo(x2, y1 - height / 2);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.stroke();
};

updateViews(localTree.root);
render();
canvas.onResize = render;

document.addEventListener("keydown", async (e) => {
  if (isEditing()) {
    if (e.code === "Enter" || e.code === "NumpadEnter") stopEditing();
    return;
  }

  await onKeyDown(localTree, e, map);
  saveToLocalStorage(localTree);
  updateViews(localTree.root);
  render();
});

engine.onTick = render;

document.fonts.onloadingdone = render;
