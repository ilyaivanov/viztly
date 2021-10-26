import { animate, engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";

const canvas = new Canvas();
canvas.onResize = () => {
  render();
};

const position = {
  x: 230,
  y: 50,
};

const size = 20;
const render = () => {
  canvas.clear();
  canvas.drawRect(position, size, size, "white");
};

render();

document.addEventListener("click", (e) => {
  const targetY = e.clientY - size / 2;
  animate(position.y, targetY, (y) => {
    position.y = y;
  });
  render();
});
document.body.appendChild(canvas.el);

engine.onTick = render;
//https://github.com/sveltejs/svelte/blob/master/src/runtime/motion/spring.ts
type TickContext = {
  inv_mass: number;
  dt: number;
  opts: Spring;
  settled: boolean;
};

type Spring = {
  precision: number;
  damping: number;
  stiffness: number;
};
