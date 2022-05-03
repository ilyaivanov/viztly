import { createTree, init } from "../src/tree";
import { createItem, createRoot, list } from "../src/tree/tree.crud";
import { engine } from "./animations/engine";
import { App } from "./app";
import { MyCanvas } from "./canvas";

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const medium = createRoot([
  createItem("Item 1", list("Item 1.", 3)),
  createItem("Slackbot"),
  createItem("Slackbot"),
  createItem("Slackbot"),
  createItem("Item 3", [
    createItem("Item 3.1", list("Item 3.1.", 20)),
    createItem("Item 3.2", list("Item 3.2.", 10)),
  ]),
  createItem("Big", list("Big child ", 50)),
  createItem("Item 4", [
    createItem("Item 4.1.", list("Item 4.1.", 10)),
    createItem("Item 4.2.", list("Item 4.2.", 10)),
    createItem("Item 4.3.", list("Item 4.3.", 10)),
  ]),
  createItem("Item 5", list("Item 5.", 5)),
  createItem("Item 6"),
  createItem("Item 7"),
]);

const tree = createTree(medium);
init(tree);
const app = new App(new MyCanvas(ctx), tree);

document.addEventListener("keydown", (e) => {
  app.handleKey(e);

  app.draw();

  e.preventDefault();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  app.draw();
});

app.draw();

document.fonts.load("16px Roboto").then(() => {
  console.log("loaded");
  app.draw();
});

engine.onTick = () => app.draw();
