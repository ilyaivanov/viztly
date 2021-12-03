import { engine, spring } from "../src/infra/animations";
import { Canvas } from "../src/infra/canvas";
import { Item, selectNextItem, selectPreviousItem, Tree } from "../src2/core";
import { tree } from "./initialState";

const canvas = new Canvas();

document.body.appendChild(canvas.el);

const mapTree = <T>(
  root: Item,
  map: (item: Item, offset: number, level: number) => T
): T[] => {
  const res: T[] = [];
  let index = 0;
  const traverseChildren = (parent: Item, level: number) => {
    parent.isOpen &&
      parent.children.forEach((item) => {
        res.push(map(item, index, level));
        index += 1;
        traverseChildren(item, level + 1);
      });
  };

  traverseChildren(root, 0);
  return res;
};

const start = 50;
const xStep = 20;
const yStep = 20;
const map = new Map<Item, ItemView>();

const createView = (item: Item, index: number, level: number): ItemView => ({
  x: start + xStep * level,
  y: start + yStep * index,
  index,
  level,
  item,
  opacity: 1,
});

mapTree(tree.root, (item, index, level) => {
  map.set(item, createView(item, index, level));
});

const updatePositions = (tree: Tree) => {
  mapTree(tree.root, (item, index, level) => {
    const view = map.get(item);
    if (view) {
      if (view.index !== index) {
        spring(start + yStep * view.index, start + yStep * index, (v) => {
          view.y = v;
        });
        view.index = index;
      }
    }
  });
};

const remove = () => {
  const itemToRemove = tree.selectedItem;
  const parent = itemToRemove?.parent;
  if (itemToRemove && parent) {
    selectPreviousItem(tree);
    parent.children = parent.children.filter((i) => i !== itemToRemove);
    startRemovalAnimation(itemToRemove);
    mapTree(itemToRemove, (item) => {
      startRemovalAnimation(item);
    });
  }
};

const startRemovalAnimation = (item: Item) => {
  const view = map.get(item);
  if (view) {
    const start = view.x;
    const end = view.x - 20;
    spring(start, end, (v, isDone) => {
      view.x = v;
      view.opacity = Math.max((v - end) / (start - end), 0);
      if (isDone) {
        map.delete(view.item);
        updatePositions(tree);
      }
    });
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
        drawItemConnection(view.x, view.y, parentView.x, parentView.y);
      }
    }
  });

  views.forEach((view) => drawItem(view));
};

type ItemView = {
  x: number;
  y: number;
  opacity: number;
  index: number;
  level: number;
  item: Item;
};

const drawItem = ({ item, x, y, opacity }: ItemView) => {
  canvas.ctx.globalAlpha = opacity;
  const fontSize = 14;
  canvas.ctx.fillStyle = item.isSelected ? "#ACE854" : "white";
  canvas.ctx.font = `${fontSize}px 'Ubuntu', sans-serif`;
  canvas.drawCircle({ x, y }, 3, item.isSelected ? "#ACE854" : "white");
  canvas.ctx.fillText(item.title, x + 10, y + 0.32 * fontSize);
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

render();
canvas.onResize = render;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") remove();
  if (e.code === "ArrowDown") selectNextItem(tree);
  if (e.code === "ArrowUp") selectPreviousItem(tree);
  render();
});

engine.onTick = render;

document.fonts.onloadingdone = render;
