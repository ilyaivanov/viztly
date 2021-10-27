import { Animated } from "./animationEngine";

const precision = 0.1;

export class SpringAnimated implements Animated {
  isAnimating: boolean = false;

  public target: number;
  private last: number;

  stiffness = 0.06;
  damping = 4;
  invertedMass = 0.25;

  onTick?: (val: number) => void;

  constructor(public current: number) {
    this.target = current;
    this.last = current;
  }

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
      this.current += d;
    }

    this.onTick && this.onTick(this.current);
  };
}
