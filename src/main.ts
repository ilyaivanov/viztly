import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { updateInputCoordinates } from "./views/itemInput";
import { TreeView } from "./controllers/treeView";
import Scrollbar from "./controllers/scrollbar";

import * as stateReader from "./stateReader";
import KeyboardHandler from "./controllers/keyboard";
import Tree from "./itemTree/tree";
import Footer from "./views/footer";

const canvas = new Canvas();

const root = stateReader.load();

const onKeyHandled = () => {
  stateReader.save(root);
  treeView.updateRows();
  render();
};

const tree = new Tree(root);
const treeView = new TreeView(tree);
const scrollbar = new Scrollbar(canvas, treeView);
const input = new KeyboardHandler(tree, treeView, scrollbar, onKeyHandled);
const footer = new Footer(canvas, tree);
canvas.onResize = () => render();

const render = () => {
  canvas.clear();
  canvas.setTranslation(0, -scrollbar.transformY);

  treeView.draw(canvas);

  canvas.setTranslation(0, 0);
  scrollbar.draw();

  footer.draw();
  const item = treeView.itemToRows.get(tree.selectedNode);
  if (item) updateInputCoordinates(item, scrollbar);
};

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
