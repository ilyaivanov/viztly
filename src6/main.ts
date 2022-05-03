import { engine } from "./animations/engine";
import { App } from "./app";
import { MyCanvas } from "./canvas";

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const app = new App(new MyCanvas(ctx));

app.setRoot({
  text: "Root",
  children: [
    {
      text: "Foo",
      children: [
        { text: "Sub" },
        { text: "Sub" },
        { text: "Sub" },
        { text: "Sub" },
        {
          text: "Bar",
          children: [
            {
              text: "Bar",
              children: [{ text: "Bar", children: [{ text: "Bar" }] }],
            },
            { text: "Sub" },
            { text: "Sub" },
            { text: "Sub" },
          ],
        },
      ],
    },
    { text: "Sub" },
    { text: "Sub" },
    { text: "Sub" },
    { text: "Sub" },
    { text: "Sub" },
    { text: "Sub" },
    { text: "Sub" },
  ],
});

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

engine.onTick = () => app.draw();
