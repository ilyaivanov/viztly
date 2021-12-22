import { Canvas } from "./infra";
import { createItem } from "./domain";
import { init, handleKeyDown, forEachShape } from "./app";
import { createRoot } from "./domain/items";

const canvas = new Canvas();

canvas.el.style.display = "block";
document.body.appendChild(canvas.el);

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
  forEachShape(app, drawShape);
};

document.addEventListener("keydown", (e) => {
  handleKeyDown(app, e);
  render();
});

const drawShape = (shape: Shape) => {
  if (shape.type === "circle")
    canvas.drawCircle(shape.x, shape.y, shape.r, shape.color);
  if (shape.type === "text")
    canvas.drawText(shape.x, shape.y, shape.text, shape.fontSize, shape.color);
};

canvas.onResize = render;
render();
