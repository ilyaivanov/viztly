import { engine, Animated } from "./animationEngine";

//constant speed animation
export class AnimatedNumber implements Animated {
  value = 0;

  speed = 100; //pixels per second
  targetValue = 0;
  isAnimating: boolean = false;
  animationDirection: "increating" | "decreasing" = "decreasing";

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
    engine.addAnimation(this);
  }
}
