import { canvas, engine } from "./infra";
import { animatePosition } from "./infra/animations";

const el = canvas.createFullscreenCanvas();

el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

//VIEW
const render = () => {
  canvas.clear();
  renderBox();
};

document.addEventListener("keydown", (e) => {
  randomizePosition();
  render();
});

canvas.addEventListener("resize", render);

engine.onTick = render;

//BOX
//
//
//
//
//
//

const randomizePosition = () => {
  animatePosition(
    position,
    Math.random() * canvas.canvas.width,
    Math.random() * canvas.canvas.height
  );
};
const position = { x: 100, y: 100 };
const renderBox = () => {
  canvas.drawRectRounded(position.x, position.y, 100, 100, 6, "white");
};

render();
