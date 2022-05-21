export interface AnimatedValue {
  isAnimating: boolean;
  tick: (deltaTime: number) => void;
}

const ANIMATION_SLOW_COEF = 5; // how much times to slow animation

export class AnimationEngine {
  private currentAnimations: Set<AnimatedValue> = new Set();
  private lastTime: number = 0;

  addAnimation(val: AnimatedValue) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.tick);

    this.currentAnimations.add(val);
  }

  private tick = (currentTime: number) => {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 1000 / 60;

    this.lastTime = currentTime;

    for (const val of this.currentAnimations) {
      val.tick(deltaTime / ANIMATION_SLOW_COEF);
      if (!val.isAnimating) this.currentAnimations.delete(val);
    }

    if (this.currentAnimations.size !== 0) requestAnimationFrame(this.tick);
    else this.lastTime = 0;

    this.onTick && this.onTick();
  };

  onTick?: () => void;
}

export const engine = new AnimationEngine();
