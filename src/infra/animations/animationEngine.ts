export interface Animated {
  isAnimating: boolean;
  tick: (deltaTime: number) => void;
}

const ANIMATION_SLOW_COEF = 10; // how much times to slow animation

export class AnimationEngine {
  private currentAnimations: Map<{}, Animated> = new Map();
  private lastTime: number = 0;

  addAnimation(val: Animated) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.tick);

    this.currentAnimations.set(Math.random(), val);
  }

  getAnim = (key: {}) => this.currentAnimations.get(key);

  addKeyedAnimation(key: {}, val: Animated) {
    if (this.currentAnimations.size === 0) requestAnimationFrame(this.tick);

    this.currentAnimations.set(key, val);
  }

  private tick = (currentTime: number) => {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 1000 / 60;

    this.lastTime = currentTime;

    const animationsToRemove: {}[] = [];
    Array.from(this.currentAnimations.entries()).forEach(([key, a]) => {
      a.tick(deltaTime / ANIMATION_SLOW_COEF);
      if (!a.isAnimating) animationsToRemove.push(key);
    });
    animationsToRemove.forEach((key) => this.currentAnimations.delete(key));

    if (this.currentAnimations.size !== 0) requestAnimationFrame(this.tick);
    else this.lastTime = 0;

    this.onTick && this.onTick();
  };

  onTick?: () => void;
}
