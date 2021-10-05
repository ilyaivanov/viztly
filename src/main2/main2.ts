import { Canvas } from "../infra/canvas";

const canvas = new Canvas();

canvas.onResize = () => {
  render();
};

const render = () => {
  canvas.drawRect({ x: 20, y: 20 }, 200, 300, "black");
};

document.body.appendChild(canvas.el);
