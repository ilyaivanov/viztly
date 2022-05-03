export class MyCanvas {
  constructor(public context: CanvasRenderingContext2D) {}

  clearRect = () => {
    this.context.clearRect(0, 0, 10000, 10000);
  };

  fillRect = (x: number, y: number, w: number, h: number, color: string) => {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  };

  fillCircle = (x: number, y: number, r: number, color: string) => {
    this.context.fillStyle = color;
    const ctx = this.context;
    ctx.beginPath();
    // const lineWidth = 1.5;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = lineWidth;
    // ctx.stroke();
    // if (filled) {
    //   ctx.fillStyle = color;
    ctx.fill();
    // }
  };

  outlineCircle = (
    x: number,
    y: number,
    r: number,
    lineWidth: number,
    color: string
  ) => {
    this.context.strokeStyle = color;
    const ctx = this.context;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  fillTextAtMiddle = (x: number, y: number, text: string, color: string) => {
    const ctx = this.context;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.font = "16px Roboto, sans-serif";
    ctx.fillText(text, x, y);
  };
}
