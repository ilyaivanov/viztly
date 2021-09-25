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

  clear = () => this.ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);

  drawText = (at: Vector, text: string, fontSize: number) => {
    this.ctx.font = `${fontSize}px Segoe UI`;

    this.ctx.fillText(text, at.x, at.y);
  };

  onResize?: () => void;

  updateHeight = () => {
    this.el.setAttribute("width", window.innerWidth + "");
    this.el.setAttribute("height", window.innerHeight + "");
  };
}
