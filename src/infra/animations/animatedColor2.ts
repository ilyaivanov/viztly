import { lerpColor } from "./lerpColor";
import { Animated } from "./animationEngine";

export class AnimatedColor2 implements Animated {
  private transitionTimeMs = 200;
  private millisecondsEllapsed = 0;
  private targetColor = 0;
  private startingColor = 0;
  isAnimating: boolean = false;

  private currentValue = 0;
  constructor(hexColor: string) {
    this.currentValue = this.parseHex(hexColor);
  }
  onTick?: (val: string) => void;
  tick(deltaTimeMs: number) {
    this.millisecondsEllapsed += deltaTimeMs;
    if (this.millisecondsEllapsed > this.transitionTimeMs) {
      this.stop();
    } else {
      const fraction = this.millisecondsEllapsed / this.transitionTimeMs;
      this.currentValue = lerpColor(
        this.startingColor,
        this.targetColor,
        fraction
      );
    }
    this.onTick && this.onTick(this.getHexColor());
  }

  animateTo(hexColor: string) {
    this.startingColor = this.currentValue;
    this.targetColor = this.parseHex(hexColor);
    this.millisecondsEllapsed = 0;
    this.isAnimating = true;
  }

  stop() {
    this.currentValue = this.targetColor;
    this.isAnimating = false;
    this.millisecondsEllapsed = 0;
  }

  getHexColor() {
    return "#" + this.currentValue.toString(16);
  }

  private parseHex = (s: string): number => parseInt(s.slice(1), 16);
}
