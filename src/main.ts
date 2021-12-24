import { canvas } from "./infra";
import { createItem } from "./domain";
import { init, handleKeyDown, forEachShape } from "./app";
import { createRoot } from "./domain/items";

//TODO: think about how to gracefully remove dependency from main to itemInput
import * as input from "./view/itemInput";

const el = canvas.createFullscreenCanvas();

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

const app = init(
  createRoot([
    createItem("Item 1", "tree", [createItem("Item 1.1")]),
    createItem("Item 2", "tree", [
      createItem("Item 2.1", "tree", [
        createItem("Item 2.1.1"),
        createItem("Item 2.2.2"),
      ]),
      createItem("Item 2.2"),
    ]),
    createItem("Item 3"),
  ])
);

const render = () => {
  canvas.clear();
  forEachShape(app, canvas.drawShape);
};

document.addEventListener("keydown", (e) => {
  handleKeyDown(app, e);
  render();
});

canvas.addEventListener("resize", render);
input.addEventListener("onInputBlur", render);

render();
