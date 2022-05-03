import { AnimatedValue, engine } from "./engine";

const precision = 0.1;

export class AnimatedNumber implements AnimatedValue {
  isAnimating: boolean = false;

  public last: number;

  // { stiffness: 0.02, damping: 2, invertedMass: 0.2 },
  stiffness = 0.02;
  damping = 2.5;
  invertedMass = 0.28;
  public target: number;

  constructor(public current: number) {
    this.last = current;
    this.target = current;
  }

  switchTo = (to: number) => {
    this.last = this.current;
    this.current = this.current;
    this.target = to;

    this.isAnimating = true;
    engine.addAnimation(this);
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
  };
}
