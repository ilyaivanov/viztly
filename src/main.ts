import { createItem, createRoot, list } from "./tree/tree.crud";
import { canvas, engine } from "./infra";
import * as tree from "./tree";
import { finishEdit, isEditing } from "./view/itemInput";
import {
  init,
  subscribe,
  drawTree,
  updateSelectedItemInputCoords,
  getPageHeight,
} from "./view/treeView";
import { appendToOffset } from "./view/scrollbar";

const el = canvas.createFullscreenCanvas();

tree.createTree(
  createRoot([
    createItem("Item 1", list("Item 1.", 10)),
    createItem("Item 2"),
    createItem("Item 3", [
      createItem("Item 3.1", list("Item 3.1.", 20)),
      createItem("Item 3.2", list("Item 3.2.", 10)),
    ]),
    createItem("Item 4", [
      createItem("Item 4.1.", list("Item 4.1.", 10)),
      createItem("Item 4.2.", list("Item 4.2.", 10)),
      createItem("Item 4.3.", list("Item 4.3.", 10)),
    ]),
    createItem("Item 5", list("Item 5.", 5)),
    createItem("Item 6"),
    createItem("Item 7"),
  ])
);

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

//VIEW
init(tree.getFocused());
subscribe();
tree.init();
const render = () => {
  canvas.clear();
  drawTree();
};

//when blured finishEdit is called from input, which won't re-render items
tree.on("item-finishEdit", render);

document.addEventListener("keydown", (e) => {
  const code = e.code as KeyboardKey;

  if (isEditing()) {
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Escape")
      finishEdit();
    render();
    return;
  }

  if (code === "ArrowDown") {
    if (e.shiftKey && e.altKey) tree.moveSelectedDown();
    else if (e.altKey && e.ctrlKey) tree.goToNextSibling();
    else tree.goDown();
  } else if (code === "ArrowUp") {
    if (e.shiftKey && e.altKey) tree.moveSelectedUp();
    else if (e.altKey && e.ctrlKey) tree.goToPreviousSibling();
    else tree.goUp();
  } else if (code === "ArrowLeft") {
    if (e.shiftKey && e.altKey) tree.moveSelectedLeft();
    else tree.goLeft();
  } else if (code === "ArrowRight") {
    if (e.shiftKey && e.altKey) tree.moveSelectedRight();
    else tree.goRight();
  } else if (code === "Backspace" && e.altKey && e.shiftKey)
    tree.removeSelected();
  else if (code === "KeyE") {
    tree.startEdit();
    e.preventDefault();
  } else if (code === "Enter") {
    tree.createItemAfterSelected();
  }
  render();
});

document.addEventListener("wheel", (e) => {
  appendToOffset(e.deltaY, getPageHeight());
  render();
});

canvas.addEventListener("resize", render);

engine.onTick = () => {
  render();

  if (isEditing()) updateSelectedItemInputCoords();
};
render();
