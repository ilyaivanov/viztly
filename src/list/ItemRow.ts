import { c, fontSizes, spacings as sp, spacings } from "../designSystem";
import { animateColor, spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import { flattenItemChildren } from "../itemTree";

class MyItemRow {
  position: Vector;
  childrenHeight: number;
  childrenColor: string;
  color: string;

  opacity = 1;
  fontSize: number;

  constructor(public item: Item, public level: number, y: number) {
    this.color = c.text;
    this.fontSize = level == 0 ? fontSizes.big : fontSizes.regular;
    this.childrenColor = c.line;
    this.position = { x: spacings.xBase + level * spacings.xStep, y };
    this.childrenHeight = this.getChildrenHeight(item);
  }

  // this is called 60FPS,
  // thus making this code faster will improve animation perfomance
  draw(canvas: Canvas) {
    const { item, position, level, fontSize, color } = this;

    if (item.children.length > 0)
      canvas.drawCircle(position, sp.circleRadius, color);
    else canvas.drawCirclePath(position, sp.circleRadius, color);

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
      spring(old.childrenHeight, row.childrenHeight, (val) => {
        row.childrenHeight = val;
      });

    if (old.fontSize !== row.fontSize)
      spring(old.fontSize, row.fontSize, (val) => {
        row.fontSize = val;
      });
  }

  public unhighlightChildrenBorder = () =>
    animateColor(this.childrenColor, c.line, (val) => {
      this.childrenColor = val;
    });

  public highlightChildrenBorder = () =>
    animateColor(this.childrenColor, c.lineSelected, (val) => {
      this.childrenColor = val;
    });

  private getTextPosition = () => {
    const x =
      this.level == 0
        ? sp.zeroLevelCircleToTextDistance
        : sp.circleToTextDistance;
    return add(this.position, { x, y: this.fontSize * 0.32 });
  };

  // assumes all children are below level 0
  private getChildrenHeight = (item: Item): number =>
    flattenItemChildren(item, () => spacings.itemHeight).reduce(
      (sum, val) => sum + val,
      0
    );
}

export default MyItemRow;
