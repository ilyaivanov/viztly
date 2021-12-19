import { Canvas } from "../src/infra/canvas";
import { createItem, createTree } from "./items";
import { Shape, Views, renderViews, forEachView } from "./views";

const canvas = new Canvas();
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
    canvas.drawCircle({ x: shape.x, y: shape.y }, shape.r, "white");
  if (shape.type === "text")
    canvas.drawText(
      { x: shape.x, y: shape.y },
      shape.text,
      shape.fontSize,
      "white"
    );
};

render();

canvas.onResize = render;
document.body.appendChild(canvas.el);
