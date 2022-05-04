import { goDown, goLeft, goRight, goUp, Tree } from "../src/tree";
import { animateTo, setWidth } from "./animatedBox";
import { MyCanvas } from "./canvas";
import theme, { toggleTheme } from "./theme";

export class App {
  constructor(public canvas: MyCanvas, public tree: Tree) {}

  draw() {
    const ctx = this.canvas;
    ctx.clearRect();

    ctx.fillRect(0, 0, 10000, 10000, theme.backgroundColor.getHexColor());
    if (this.tree.root.children)
      this.drawChildren(this.tree.root.children, theme.yStart, 0);
  }

  private drawChildren = (items: Item[], x: number, level: number) => {
    let height = 0;
    const xStart = getLeftOffest();
    items.forEach((item) => {
      this.drawItem(xStart + level * theme.xStep, x + height, item);
      height += theme.yStep;
      if (item.isOpen && item.children)
        height += this.drawChildren(item.children, x + height, level + 1);
    });
    return height;
  };

  private drawItem = (x: number, y: number, item: Item) => {
    const isSelected = this.tree.selectedItem === item;
    const textColor = isSelected
      ? theme.selectedColor.getHexColor()
      : theme.textColor.getHexColor();
    const circleColor = isSelected
      ? theme.selectedColor.getHexColor()
      : theme.circleColor.getHexColor();

    const r = theme.outlineCircleR;
    const lineWidth = theme.outlineCircleLineWidth;

    if (!item.isOpen && item.children.length > 0)
      this.canvas.fillCircle(x, y, r + lineWidth / 2, circleColor);
    else this.canvas.outlineCircle(x, y, r, lineWidth, circleColor);

    this.canvas.fillTextAtMiddle(
      x + theme.textToCircleDistance + theme.outlineCircleR + 1,
      y + 1.5,
      item.title,
      textColor
    );
  };

  handleKey(e: KeyboardEvent) {
    if (e.code === "ArrowDown") {
      goDown();
    } else if (e.code === "ArrowUp") {
      goUp();
    } else if (e.code === "ArrowLeft") {
      goLeft();
    } else if (e.code === "ArrowRight") {
      goRight();
    } else if (e.code.startsWith("Digit")) {
      const k = Number(e.code[e.code.length - 1]);
      const hex = Math.round((1 / (k + 1)) * 255);

      if (e.ctrlKey) setWidth(k * 100);
      else animateTo(`#${hex.toString(16).repeat(3)}`);
    } else if (e.code === "Space") {
      toggleTheme();
    }
  }
}

const getLeftOffest = () =>
  Math.max((window.innerWidth - 800) / 2, theme.xStart);
