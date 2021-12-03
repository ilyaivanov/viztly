import { engine } from "../src/infra/animations";
import { Canvas } from "../src/infra/canvas";
import { createItem, Item, Tree } from "../src2/core";

const canvas = new Canvas();

document.body.appendChild(canvas.el);

const mapTree = <T>(
  { root }: Tree,
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
const tree: Tree = {
  root: createItem("Root", [
    createItem("Music", [
      createItem("Carbon Based Lifeforms", [
        createItem("1998 - The Path"),
        createItem("2003 - Hydroponic Garden"),
        createItem("2006 - World Of Sleepers"),
        createItem("2010 - Interloper"),
        createItem("2011 - Twentythree"),
        createItem("2013 - Refuge"),
        createItem("2016 - Alt:01"),
        createItem("2017 - Derelicts"),
        createItem("2020 - ALT:02"),
      ]),
      createItem("Sync24"),
      createItem("Solar Fields"),
    ]),
    createItem("Tasks"),
  ]),
};

const render = () => {
  canvas.clear();

  canvas.ctx.fillStyle = "white";

  const start = 50;
  const xStep = 20;
  const yStep = 20;
  const map = new Map<Item, ItemView>();
  const views = mapTree(tree, (item, index, level) => {
    const view = {
      x: start + xStep * level,
      y: start + yStep * index,
      level,
      item,
    };
    map.set(item, view);
    return view;
  });

  views.forEach((view) => {
    const parent = view.item.parent;
    if (parent) {
      const parentView = map.get(parent);
      if (parentView)
        drawItemConnection(view.x, view.y, parentView.x, parentView.y);
    }
  });

  views.forEach((view) => drawItem(view));
};

type ItemView = {
  x: number;
  y: number;
  level: number;
  item: Item;
};

const drawItem = ({ item, x, y }: ItemView) => {
  const fontSize = 14;
  canvas.ctx.font = `${fontSize}px 'Ubuntu', sans-serif`;
  canvas.drawCircle({ x, y }, 3, "white");
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
  render();
});

engine.onTick = render;

document.fonts.onloadingdone = render;
