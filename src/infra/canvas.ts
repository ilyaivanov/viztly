export class Canvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor() {
    this.el = document.createElement("canvas");
    this.ctx = this.el.getContext("2d")!;
    this.updateHeight();
    window.addEventListener("resize", () => {
      this.updateHeight();
      this.onResize && this.onResize();
    });
  }

  drawCircle = (center: Vector, r: number, color: string) => {
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  drawLine = (p1: Vector, p2: Vector, stroke: number, color: string) => {
    this.ctx.strokeStyle = color;

    this.ctx.lineWidth = stroke;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  };

  clear = () => this.ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);

  drawText = (at: Vector, text: string, fontSize: number, color: string) => {
    this.ctx.font = `${fontSize}px Segoe UI`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, at.x, at.y);
  };

  onResize?: () => void;

  updateHeight = () => {
    this.el.setAttribute("width", window.innerWidth + "");
    this.el.setAttribute("height", window.innerHeight + "");
  };
}
