import { spring, animatePosition } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { Point } from "./infra/point";

export class Line {
  start: Point = new Point();
  end: Point = new Point();
  color = "red";

  constructor(private canvas: Canvas) {
    this.end.x = 200;
    this.end.y = 200;
  }

  draw() {
    const { ctx } = this.canvas;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  moveEnd(x: number, y: number) {
    animatePosition(this.end, x, y);
  }

  moveStart(x: number, y: number) {
    animatePosition(this.start, x, y);
  }
}
