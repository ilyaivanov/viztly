import { createItem, createRoot, list } from "../src/domain/items";
import { canvas, engine } from "../src/infra";
import { animatePosition } from "../src/infra/animations";

import * as tree from "./tree";
import { init, subscribe } from "./treeView";

const el = canvas.createFullscreenCanvas();

tree.createTree(
  createRoot([
    createItem("Item 1", list("Item 1.", 10)),
    createItem("Item 2"),
    createItem("Item 3", [
      createItem("Item 3.1", list("Item 3.1", 3)),
      createItem("Item 3.2", list("Item 3.2", 4)),
    ]),
    createItem("Item 4", list("Item 4.", 5)),
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
const shapes = init(tree.getFocused());
subscribe();
tree.init();
const render = () => {
  canvas.clear();
  shapes.forEach(canvas.drawShape);
};

document.addEventListener("keydown", () => {
  render();
});

canvas.addEventListener("resize", render);

render();
