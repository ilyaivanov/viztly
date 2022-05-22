export class MyCanvas {
  constructor(public context: CanvasRenderingContext2D) {}

  clearRect = (backgroundColor?: string | CanvasGradient) => {
    this.context.clearRect(0, 0, 10000, 10000);
    if (backgroundColor) this.fillRect(0, 0, 10000, 10000, backgroundColor);
  };

  fillRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string | CanvasGradient
  ) => {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  };

  outlineCircle = (
    x: number,
    y: number,
    r: number,
    lineWidth: number,
    color: string,
    background?: string
  ) => {
    const ctx = this.context;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;

    if (background) {
      ctx.fillStyle = background;
      ctx.fill();
    }
    ctx.stroke();
  };

  fillTextAtMiddle = (text: string, x: number, y: number, color: string) => {
    const ctx = this.context;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.font = "14px Roboto, sans-serif";
    ctx.fillText(text, x, y);
  };

  getTextWidth = (text: string) => {
    const ctx = this.context;
    ctx.font = "14px Roboto, sans-serif";
    return ctx.measureText(text).width;
  };
}
