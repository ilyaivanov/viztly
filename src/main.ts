import { canvas } from "./infra";
import { createItem } from "./domain";
import {
  init,
  handleKeyDown,
  forEachShape,
  handleWheelEvent,
  updateScrollbar,
} from "./app";
import { createRoot, list } from "./domain/items";

//TODO: think about how to gracefully remove dependency from main to itemInput
import * as input from "./view/itemInput";

const el = canvas.createFullscreenCanvas();

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

const app = init(
  createRoot([
    createItem("Item 1", [createItem("Item 1.1", list("Item 1.1", 20))]),
    createItem("Item 2", [
      createItem("Item 2.1", [
        createItem("Item 2.1.1", list("Item 2.1.1", 10)),
        createItem("Item 2.2.2", list("Item 2.2.2", 15)),
      ]),
      createItem("Item 2.2", list("Item 2.2", 20)),
    ]),
    createItem("Item 3", list("Item 3", 40)),
  ])
);

const render = () => {
  canvas.clear();
  canvas.setTranslation(0, 0);
  canvas.drawRect(app.ui.scrollbar);
  canvas.setTranslation(0, -app.pageOffset);
  forEachShape(app, canvas.drawShape);
};

document.addEventListener("keydown", (e) => {
  handleKeyDown(app, e);
  render();
});

document.addEventListener("wheel", (e) => {
  handleWheelEvent(app, e.deltaY);
  render();
});

canvas.addEventListener("resize", () => {
  updateScrollbar(app);
  render();
});

input.addEventListener("onInputBlur", render);

render();
