import { Animated } from "./animationEngine";

//constant speed animation
export class AnimatedNumber2 implements Animated {
  private speed = 800; //pixels per second
  private targetValue = 0;
  isAnimating: boolean = false;
  private animationDirection: "increating" | "decreasing" = "decreasing";

  constructor(public value = 0) {}

  onTick?: (val: number) => void;
  tick(deltaTimeMs: number) {
    const deltaTimeSeconds = deltaTimeMs / 1000;
    const direction = this.animationDirection === "decreasing" ? -1 : 1;
    const shift = deltaTimeSeconds * this.speed * direction;
    const nextValue = this.value + shift;

    const isFinished =
      (this.animationDirection === "increating" &&
        nextValue >= this.targetValue) ||
      (this.animationDirection === "decreasing" &&
        nextValue <= this.targetValue);

    if (isFinished) {
      this.value = this.targetValue;
      this.isAnimating = false;
    } else {
      this.value = nextValue;
    }
    this.onTick && this.onTick(this.value);
  }

  animateToDelta(delta: number) {
    this.startAnimation(this.targetValue + delta);
  }

  animateTo(target: number) {
    this.startAnimation(target);
  }

  private startAnimation(targetValue: number) {
    this.targetValue = targetValue;
    this.animationDirection =
      this.targetValue > this.value ? "increating" : "decreasing";

    this.isAnimating = true;
  }
}
