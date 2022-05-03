import { goDown, goLeft, goRight, goUp, Tree } from "../src/tree";
import { animateTo, setWidth } from "./animatedBox";
import { MyCanvas } from "./canvas";

const c = {
  outlineCircleR: 5.5,
  outlineCircleLineWidth: 3,
  textToCircleDistance: 8,
  yStart: 50,
  xStart: 50,
  yStep: 32,
  xStep: 30,

  //colors
  selectedColor: "#009EF7",
  circleColor: "#636E7D",
  textColor: "#636E7D",
};

export class App {
  constructor(public canvas: MyCanvas, public tree: Tree) {}

  draw() {
    const ctx = this.canvas;
    ctx.clearRect();

    ctx.fillRect(0, 0, 10000, 10000, "#F5F7FA");
    if (this.tree.root.children)
      this.drawChildren(this.tree.root.children, c.yStart, 0);
  }

  private drawChildren = (items: Item[], x: number, level: number) => {
    let height = 0;
    const xStart = getLeftOffest();
    items.forEach((item) => {
      this.drawItem(xStart + level * c.xStep, x + height, item);
      height += c.yStep;
      if (item.isOpen && item.children)
        height += this.drawChildren(item.children, x + height, level + 1);
    });
    return height;
  };

  private drawItem = (x: number, y: number, item: Item) => {
    const isSelected = this.tree.selectedItem === item;
    const textColor = isSelected ? c.selectedColor : c.textColor;
    const circleColor = isSelected ? c.selectedColor : c.circleColor;

    const r = c.outlineCircleR;
    const lineWidth = c.outlineCircleLineWidth;
    if (!item.isOpen && item.children.length > 0)
      this.canvas.fillCircle(x, y, r + lineWidth / 2, circleColor);
    else this.canvas.outlineCircle(x, y, r, lineWidth, circleColor);

    this.canvas.fillTextAtMiddle(
      x + c.textToCircleDistance + c.outlineCircleR + 1,
      y + 1,
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
    }
  }
}

const getLeftOffest = () => Math.max((window.innerWidth - 800) / 2, c.xStart);
// type Item = {
//   text: string;
//   children?: Item[];

//   parent?: Item;
// };

//handle item selection
//handle open\close items
//handle animations
