import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { updateInputCoordinates } from "./list/itemInput";
import { List } from "./list/list";
import Scrollbar from "./list/scrollbar";

import * as stateReader from "./stateReader";
import KeyboardHandler from "./keyboard";

const canvas = new Canvas();

const root: Item = stateReader.load();

const onKeyHandled = () => {
  stateReader.save(root);
  render();
};

const list = new List(root);
const scrollbar = new Scrollbar(canvas, list);
const input = new KeyboardHandler(list, scrollbar, onKeyHandled);

canvas.onResize = () => {
  scrollbar.translateCanvas();
  render();
};

const render = () => {
  canvas.clear();
  canvas.setTranslation(0, -scrollbar.transformY);

  list.rows.forEach((view) => view.draw(canvas));

  canvas.setTranslation(0, 0);
  scrollbar.draw();

  updateInputCoordinates(list.getSelectedItemRow(), scrollbar);
};

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

render();
document.body.appendChild(canvas.el);

engine.onTick = render;
