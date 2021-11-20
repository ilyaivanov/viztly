import { animatePosition, engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { TreeView } from "./controllers/treeView";
import Scrollbar from "./controllers/scrollbar";

import * as stateReader from "./controllers/stateReader";
import KeyboardHandler from "./controllers/keyboard";
import Tree from "./itemTree/tree";
import Footer from "./views/footer";
import * as modal from "./views/modal";
import { updateInputCoordinates } from "./views/itemInput";
import { Point } from "./infra/point";
import { Line } from "./primitives";

const canvas = new Canvas();

const root = stateReader.loadLocally();

const onKeyHandled = () => {
  stateReader.saveLocally(root);
  treeView.updateRows();
  render();
};

const tree = new Tree(root);
const treeView = new TreeView(tree);
const scrollbar = new Scrollbar(canvas, treeView);
const footer = new Footer(canvas, tree);

const input = new KeyboardHandler(
  tree,
  treeView,
  footer,
  scrollbar,
  onKeyHandled
);

canvas.onResize = () => render();

const line = new Line(canvas);

const render = () => {
  canvas.clear();

  canvas.setTranslation(0, -scrollbar.transformY);

  // canvas.ctx.font = `${16}px Segoe UI`;
  // line.draw();

  treeView.draw(canvas);

  canvas.ctx.resetTransform();
  modal.view(canvas);
  scrollbar.draw();
  const item = treeView.itemToRows.get(tree.selectedNode);
  if (item) updateInputCoordinates(item, scrollbar);
};

document.addEventListener("click", (e) => {
  // animatePosition(position, e.clientX, e.clientY);
  // render();
});

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

document.body.appendChild(canvas.el);

engine.onTick = render;

render();
