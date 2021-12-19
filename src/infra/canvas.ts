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

  clear = () => this.ctx.clearRect(-20000, -20000, 40000, 40000);

  onResize?: () => void;

  updateHeight = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const scaleFactor = window.devicePixelRatio;
    this.el.width = this.width * scaleFactor;
    this.el.height = this.height * scaleFactor;
    this.ctx.scale(scaleFactor, scaleFactor);
  };

  setTranslation = (x: number, y: number) => {
    this.ctx.resetTransform();

    const scaleFactor = window.devicePixelRatio;
    this.ctx.scale(scaleFactor, scaleFactor);
    this.ctx.translate(x, y);
  };

  drawCircle = (x: number, y: number, r: number, color: string) => {
    this.ctx.fillStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  drawText = (
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string
  ) => {
    this.ctx.font = `${fontSize}px Segoe UI, Ubuntu`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  };
}
