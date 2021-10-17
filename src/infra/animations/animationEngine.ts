export interface Animated {
  isAnimating: boolean;
  tick: (deltaTime: number) => void;
}

export class AnimationEngine {
  currentAnimations: Set<Animated> = new Set();
  startedAt: number = 0;
  addAnimation(val: Animated) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.tick);

    this.currentAnimations.add(val);
  }

  tick = (time: number) => {
    if (!this.startedAt) this.startedAt = time;

    const deltaTime = time - this.startedAt;
    this.startedAt = time;

    const animationsToRemove: Animated[] = [];
    this.currentAnimations.forEach((a) => {
      a.tick(deltaTime);
      if (!a.isAnimating) animationsToRemove.push(a);
    });
    animationsToRemove.forEach((a) => this.currentAnimations.delete(a));

    if (this.currentAnimations.size !== 0) requestAnimationFrame(this.tick);
    else this.startedAt = 0;

    this.onTick && this.onTick();
  };

  onTick?: () => void;
}
