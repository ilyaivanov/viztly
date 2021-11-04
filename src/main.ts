import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { updateInputCoordinates } from "./views/itemInput";
import { TreeView } from "./controllers/treeView";
import Scrollbar from "./controllers/scrollbar";

import * as stateReader from "./stateReader";
import KeyboardHandler from "./controllers/keyboard";
import Tree from "./itemTree/tree";

const canvas = new Canvas();

const root = stateReader.load();

const onKeyHandled = () => {
  stateReader.save(root);
  list.updateRows();
  render();
};

const selection = new Tree(root);
const list = new TreeView(selection);
const scrollbar = new Scrollbar(canvas, list);
const input = new KeyboardHandler(selection, onKeyHandled);

canvas.onResize = () => {
  scrollbar.translateCanvas();
  render();
};

const render = () => {
  canvas.clear();
  canvas.setTranslation(0, -scrollbar.transformY);

  list.draw(canvas);

  canvas.setTranslation(0, 0);
  scrollbar.draw();

  // updateInputCoordinates(list.getSelectedItemRow(), scrollbar);
};

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
