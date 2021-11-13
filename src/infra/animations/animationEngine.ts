export interface Animated {
  isAnimating: boolean;
  tick: (deltaTime: number) => void;
}

const ANIMATION_SLOW_COEF = 1; // how much times to slow animation

export class AnimationEngine {
  private currentAnimations: Set<Animated> = new Set();
  private lastTime: number = 0;
  addAnimation(val: Animated) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.tick);

    this.currentAnimations.add(val);
  }

  private tick = (currentTime: number) => {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 1000 / 60;

    this.lastTime = currentTime;

    const animationsToRemove: Animated[] = [];
    this.currentAnimations.forEach((a) => {
      a.tick(deltaTime / ANIMATION_SLOW_COEF);
      if (!a.isAnimating) animationsToRemove.push(a);
    });
    animationsToRemove.forEach((a) => this.currentAnimations.delete(a));

    if (this.currentAnimations.size !== 0) requestAnimationFrame(this.tick);
    else this.lastTime = 0;

    this.onTick && this.onTick();
  };

  onTick?: () => void;
}
