import { SpringAnimated } from "./spring";
import { AnimatedColor2 } from "./animatedColor2";
import { AnimatedNumber2 } from "./animatedNumber";
import { AnimationEngine } from "./animationEngine";

export const engine = new AnimationEngine();

export const animate = (
  from: number,
  to: number,
  onTick: (currentVal: number) => void
) => {
  const anim = new AnimatedNumber2(from);
  anim.onTick = onTick;
  anim.animateTo(to);
  engine.addAnimation(anim);
};

export const animateColor = (
  from: string,
  to: string,
  onTick: (currentVal: string) => void
) => {
  const anim = new AnimatedColor2(from);
  anim.onTick = onTick;
  anim.animateTo(to);
  engine.addAnimation(anim);
};

export const spring = (
  from: number,
  to: number,
  onTick: (currentVal: number, ended: boolean) => void
) => {
  const anim = new SpringAnimated(from);
  anim.target = to;
  anim.onTick = onTick;
  anim.isAnimating = true;
  engine.addAnimation(anim);
};
