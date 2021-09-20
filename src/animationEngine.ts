//constant speed animation
export class AnimatedNumber {
  value = 0;

  speed = 600; //pixels per second
  targetValue = 0;
  isAnimating: boolean = false;
  animationDirection: "increating" | "decreasing" = "decreasing";

  onTick(deltaTimeMs: number) {
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

  animateToDelta(target: number) {
    this.targetValue = target;
    this.animationDirection =
      this.targetValue > this.value ? "increating" : "decreasing";

    this.isAnimating = true;
    engine.addAnimation(this);
  }
}

export class AnimationEngine {
  onRender!: () => void;
  currentAnimations: Set<AnimatedNumber> = new Set();
  startedAt: number = 0;
  addAnimation(val: AnimatedNumber) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.onTick);

    this.currentAnimations.add(val);
  }

  onTick = (time: number) => {
    if (!this.startedAt) this.startedAt = time;

    const deltaTime = time - this.startedAt;
    this.startedAt = time;

    const animationsToRemove: AnimatedNumber[] = [];
    this.currentAnimations.forEach((a) => {
      a.onTick(deltaTime);
      if (!a.isAnimating) animationsToRemove.push(a);
    });
    animationsToRemove.forEach((a) => this.currentAnimations.delete(a));

    if (this.currentAnimations.size !== 0) requestAnimationFrame(this.onTick);
    else this.startedAt = 0;

    this.onRender();
  };
}

export const engine = new AnimationEngine();
