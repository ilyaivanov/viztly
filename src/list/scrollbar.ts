import { animate } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import { List } from "./list";

class Scrollbar {
  transformY = 0;
  constructor(private canvas: Canvas, private list: List) {}

  translateBy = (delta: number) => {
    this.transformY += delta;
    this.translateCanvas();
  };

  translateCanvas = () => {
    this.clampTransform();
    this.canvas.ctx.resetTransform();
    this.canvas.ctx.translate(0, -this.transformY);
  };

  isYPointOnScreen = (y: number) =>
    y >= this.transformY && y <= this.transformY + this.canvas.height;

  centerScrollOn = (y: number) => {
    animate(this.transformY, y - this.canvas.height / 2, (val) => {
      this.transformY = val;
      this.translateCanvas();
    });
  };

  draw = () => {
    const { canvas, list, transformY } = this;
    const contentHeight = list.getContentHeight();
    if (canvas.height > contentHeight) {
      return;
    }

    const width = 10;
    const coef = canvas.height / contentHeight;
    const scrollbarHeight = (canvas.height * canvas.height) / contentHeight;
    const position = {
      x: canvas.width - width,
      y: transformY + transformY * coef,
    };
    canvas.drawRect(position, width, scrollbarHeight, "rgba(255,255,255,0.2)");
  };

  private clampTransform = () => {
    const { list } = this;
    if (this.transformY <= 0) {
      this.transformY = 0;
      return;
    }

    const contentHeight = list.getContentHeight();
    if (this.transformY + this.canvas.height > contentHeight) {
      this.transformY = contentHeight - this.canvas.height;
    }
  };
}

export default Scrollbar;
