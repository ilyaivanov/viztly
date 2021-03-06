import { Animated } from "./animationEngine";

const precision = 0.1;

export class SpringAnimated implements Animated {
  isAnimating: boolean = false;

  public last: number;

  // { stiffness: 0.02, damping: 2, invertedMass: 0.2 },
  stiffness = 0.02;
  damping = 2.5;
  invertedMass = 0.28;

  onTick?: (val: number, ended: boolean) => void;

  constructor(public current: number, public target: number) {
    this.last = current;
  }

  switchTo = (from: number, to: number) => {
    this.last = from;
    this.current = from;
    this.target = to;
  };

  tick = (deltaTime: number) => {
    const { current, target, last, stiffness, damping, invertedMass } = this;
    const delta = target - current;
    const velocity = (current - last) / deltaTime;
    const spring = stiffness * delta;
    const damper = damping * velocity;
    const acceleration = (spring - damper) * invertedMass;
    const d = (velocity + acceleration) * deltaTime;

    if (Math.abs(d) < precision && Math.abs(delta) < precision) {
      this.isAnimating = false;
      this.current = target;
    } else {
      this.last = this.current;
      this.current += d;
    }

    this.onTick && this.onTick(this.current, !this.isAnimating);
  };
}
