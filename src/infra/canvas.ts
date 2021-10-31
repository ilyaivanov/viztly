export class Canvas {
  el: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;

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

  drawCirclePath = (center: Vector, r: number, color: string) => {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.3;

    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
    this.ctx.stroke();
  };

  drawRect = (
    topLeft: Vector,
    width: number,
    height: number,
    color: string
  ) => {
    this.ctx.fillStyle = color;

    this.ctx.fillRect(topLeft.x, topLeft.y, width, height);
  };

  drawLine = (p1: Vector, p2: Vector, stroke: number, color: string) => {
    this.ctx.strokeStyle = color;

    this.ctx.lineWidth = stroke;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  };

  clear = () => this.ctx.clearRect(-20000, -20000, 40000, 40000);

  drawText = (at: Vector, text: string, fontSize: number, color: string) => {
    this.ctx.font = `${fontSize}px Segoe UI`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, at.x, at.y);
  };

  onResize?: () => void;

  updateHeight = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const scaleFactor = window.devicePixelRatio;
    this.el.width = this.width * scaleFactor;
    this.el.height = this.height * scaleFactor;
    this.el.style.width = this.width + "px";
    this.el.style.height = this.height + "px";
    this.ctx.scale(scaleFactor, scaleFactor);
  };

  setTranslation = (x: number, y: number) => {
    this.ctx.resetTransform();

    const scaleFactor = window.devicePixelRatio;
    this.ctx.scale(scaleFactor, scaleFactor);
    this.ctx.translate(x, y);
  };
}
