import { c, fontSizes, spacings as sp, spacings } from "../designSystem";
import { animateColor, spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import Item from "../itemTree/item";

class MyItemRow {
  position: Vector;
  public childrenHeight?: number;
  childrenColor: string;
  color: string;

  opacity = 1;
  fontSize: number;
  circleR: number;

  constructor(public item: Item, public level: number, y: number) {
    this.color = item.isSelected ? c.selectedItem : c.text;
    this.fontSize = level == 0 ? fontSizes.big : fontSizes.regular;
    this.childrenColor = c.line;
    this.position = { x: spacings.xBase + level * spacings.xStep, y };
    this.circleR =
      spacings.circleRadius *
      (level === 0 ? fontSizes.big / fontSizes.regular : 1);
  }

  // this is called 60FPS,
  // thus making this code faster will improve animation perfomance
  draw(canvas: Canvas) {
    const { item, position, level, fontSize, color } = this;

    if (item.children.length > 0)
      canvas.drawCircle(position, this.circleR, color);
    else canvas.drawCirclePath(position, this.circleR, color);

    canvas.drawText(this.getTextPosition(), item.title, fontSize, color);

    const { childrenColor, childrenHeight } = this;
    if (childrenHeight) {
      const itemHeight = level === 0 ? sp.zeroLevelItemHeight : sp.itemHeight;
      const start = add(position, { x: 0, y: itemHeight / 2 });
      const end = add(start, { x: 0, y: childrenHeight });
      canvas.drawLine(start, end, 2, childrenColor);
    }
  }

  public merge(old: MyItemRow) {
    const row = this;
    if (old.position.y !== row.position.y)
      spring(old.position.y, row.position.y, (val) => {
        row.position.y = val;
      });

    if (old.position.x !== row.position.x)
      spring(old.position.x, row.position.x, (val) => {
        row.position.x = val;
      });

    if (old.childrenHeight !== row.childrenHeight)
      spring(old.childrenHeight || 0, row.childrenHeight || 0, (val) => {
        row.childrenHeight = val;
      });

    if (old.fontSize !== row.fontSize)
      spring(old.fontSize, row.fontSize, (val) => {
        row.fontSize = val;
      });

    if (old.childrenColor !== row.childrenColor)
      animateColor(old.childrenColor, row.childrenColor, (val) => {
        row.childrenColor = val;
      });
  }

  highlightChildrenBorder = () => {
    this.childrenColor = c.lineSelected;
  };

  private getTextPosition = () => {
    const x =
      this.level == 0
        ? sp.zeroLevelCircleToTextDistance
        : sp.circleToTextDistance;
    return add(this.position, { x, y: this.fontSize * 0.32 });
  };
}

export default MyItemRow;