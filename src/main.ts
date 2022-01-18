import { canvas, engine } from "./infra";
import * as tree from "./tree";
import * as input from "./view/itemInput";
import {
  subscribe,
  drawTree,
  updateSelectedItemInputCoords,
  getPageHeight,
} from "./view/tree/treeView";
import { appendToOffset } from "./view/tree/minimap";
import { onKeyDown } from "./keyboard";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistance";
import * as modal from "./view/modal/modal";
import * as player from "./view/player/player";
import * as perfChart from "./view/perfChart";

const el = canvas.createFullscreenCanvas();

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

//VIEW
subscribe();
tree.init(loadFromLocalStorage());

const render = () => {
  perfChart.renderStart();

  canvas.clear();
  drawTree();
  modal.render();
  player.render();

  perfChart.renderFinished();
  perfChart.render();
};

//when blured finishEdit is called from input, which won't re-render items
tree.on("item-finishEdit", render);

//this is called not only during first loading, but also when app loads state from file
tree.on("init", render);
player.init();

document.addEventListener("keydown", (e) => {
  onKeyDown(e);
  saveToLocalStorage(tree.getTree());
  render();
});

document.addEventListener("wheel", (e) => {
  appendToOffset(e.deltaY, getPageHeight());
  render();
});

canvas.addEventListener("resize", render);

engine.onTick = () => {
  render();

  if (input.isEditing()) updateSelectedItemInputCoords();
};
render();
