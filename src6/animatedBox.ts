import { AnimatedColor } from "./animations/animatedColor";
import { AnimatedNumber } from "./animations/animatedNumber";
import { MyCanvas } from "./canvas";

export const view = (ctx: MyCanvas) => {
  ctx.fillRect(160, 160, width.current, 100, color.getHexColor());
};

export const animateTo = (targetColor: string) => {
  color.animateTo(targetColor);
};

export const setWidth = (w: number) => {
  width.switchTo(w);
};

const color = new AnimatedColor("#ff00ff");
const width = new AnimatedNumber(160);
