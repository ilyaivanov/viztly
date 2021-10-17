import { AnimatedColor2 } from "./animatedColor2";
import { AnimatedNumber2 } from "./animatedNumber";
import { AnimationEngine } from "./animationEngine";

export const animate = (
  from: number,
  to: number,
  onTick: (currentVal: number) => void
) => {
  const anim = new AnimatedNumber2(from);
  anim.onTick = onTick;
  anim.animateTo(to);
};

export const animateColor = (
  from: string,
  to: string,
  onTick: (currentVal: string) => void
) => {
  const anim = new AnimatedColor2(from);
  anim.onTick = onTick;
  anim.animateTo(to);
};

export const engine = new AnimationEngine();
