import { Canvas } from "./infra/canvas";
import { createItem, createTree } from "./domain/items";
import { forEachView, renderViews } from "./view/views";

const canvas = new Canvas();

canvas.el.style.display = "block";
document.body.appendChild(canvas.el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

const tree = createTree([
  createItem("Item 1", "tree", [createItem("Item 1.1")]),
  createItem("Item 2", "tree", [
    createItem("Item 2.1", "tree", [
      createItem("Item 2.1.1"),
      createItem("Item 2.2.2"),
    ]),
    createItem("Item 2.2"),
  ]),
  createItem("Item 3"),
]);

const views: Views = renderViews(tree, 50, 50);

const render = () => {
  canvas.clear();
  forEachView(views, drawShape);
};

const drawShape = (shape: Shape) => {
  if (shape.type === "circle")
    canvas.drawCircle(shape.x, shape.y, shape.r, shape.color);
  if (shape.type === "text")
    canvas.drawText(shape.x, shape.y, shape.text, shape.fontSize, shape.color);
};

canvas.onResize = render;
render();
