import { AnimatedColor } from "./animations/animatedColor";
import { AnimatedNumber } from "./animations/animatedNumber";
import { MyCanvas } from "./canvas";

export const view = (ctx: MyCanvas) => {
  ctx.fillRect(
    position.x.current,
    position.y.current,
    width.current,
    100,
    color.getHexColor()
  );
};

export const animateTo = (targetColor: string) => {
  color.animateTo(targetColor);
};

export const setWidth = (w: number) => {
  width.switchTo(w);
};

const color = new AnimatedColor("#ff00ff");
const width = new AnimatedNumber(160);

const position = {
  x: new AnimatedNumber(160),
  y: new AnimatedNumber(160),
};

document.addEventListener("click", (e) => {
  position.x.switchTo(e.clientX);
  position.y.switchTo(e.clientY);
});
