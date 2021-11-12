import { c } from "./designSystem";
import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";

const canvas = new Canvas();
const ctx = canvas.ctx;

canvas.onResize = () => render();

class Input {
  constructor(private x: number, private y: number) {}

  draw = () => {
    ctx.rect(50, 50, 200, 16);

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();
  };
}

const input = new Input(50, 50);

const render = () => {
  canvas.clear();
  input.draw();
};

document.body.appendChild(canvas.el);

engine.onTick = render;

render();

//Three main goals
// 1. Input
// 2. Text wrapping
// 3. Ways to compose this shit
