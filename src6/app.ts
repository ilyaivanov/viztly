import { MyCanvas } from "./canvas";

export class App {
  root?: Item;
  selectedItem?: Item;
  constructor(public canvas: MyCanvas) {}

  setRoot(root: Item) {
    this.root = root;
    this.selectedItem = root.children?.at(0);
  }

  draw() {
    const ctx = this.canvas;
    ctx.clearRect();

    if (this.root?.children) this.drawChildren(this.root?.children, 20, 0);
  }

  private drawChildren = (items: Item[], x: number, level: number) => {
    let height = 0;
    items.forEach((item) => {
      this.drawItem(20 + level * 20, x + height, item);
      height += 20;
      if (item.children)
        height += this.drawChildren(item.children, x + height, level + 1);
    });
    return height;
  };

  private drawItem = (x: number, y: number, item: Item) => {
    const isSelected = this.selectedItem === item;
    const textColor = isSelected ? "green" : "black";
    const circleColor = isSelected ? "green" : "gray";

    this.canvas.fillCircle(x, y, 4, circleColor);

    this.canvas.fillTextAtMiddle(x + 10, y, item.text, textColor);
  };

  handleKey(code: string) {
    if (code === "ArrowDown") {
      this.selectedItem = this.root!.children![1];
    }
  }
}

type Item = {
  text: string;
  children?: Item[];

  parent?: Item;
};

//handle item selection
//handle open\close items
//handle animations
