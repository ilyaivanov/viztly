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
  const anim = new SpringAnimated(from, to);
  anim.onTick = onTick;
  anim.isAnimating = true;
  engine.addAnimation(anim);
};

export const springProp = <T, TKey extends keyof T>(
  obj: T,
  prop: TKey,
  target: number
) => {
  if (typeof obj[prop] !== "number")
    throw new Error("Expected number during animation for property: " + prop);
  const current = obj[prop] as unknown as number;
  spring(current, target, (v, isDone) => {
    obj[prop] = v as unknown as T[TKey];
  });
};

export const springKeyed = (
  key: {},
  from: number,
  to: number,
  onTick: (currentVal: number, ended: boolean) => void
) => {
  const current = engine.getAnim(key);
  if (current) {
    if (current instanceof SpringAnimated) {
      current.switchTo(from, to);
      current.onTick = onTick;
    }
  } else {
    const anim = new SpringAnimated(from, to);
    anim.onTick = onTick;
    anim.isAnimating = true;
    engine.addKeyedAnimation(key, anim);
  }
};

export const animatePosition = (
  position: { x: number; y: number },
  x: number,
  y: number,
  isDone: () => void = () => undefined
) => {
  const xStart = position.x;
  const yStart = position.y;
  const yDiff = Math.abs(yStart - y);
  const xDiff = Math.abs(xStart - x);
  if (xDiff > yDiff) {
    springKeyed(position, xStart, x, (v, done) => {
      const xNormalized = Math.abs(xStart - v) / Math.abs(x - xStart); //0..1
      const yInterpolated = yStart + (y - yStart) * xNormalized;
      position.x = v;
      position.y = yInterpolated;
      if (done) isDone();
    });
  } else {
    springKeyed(position, yStart, y, (v, done) => {
      const yNormalized = Math.abs(yStart - v) / Math.abs(y - yStart); //0..1
      const xInterpolated = xStart + (x - xStart) * yNormalized;
      position.y = v;
      position.x = xInterpolated;
      if (done) isDone();
    });
  }
};
