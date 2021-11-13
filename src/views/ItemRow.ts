import { c, fontSizes, spacings as sp, spacings } from "../designSystem";
import { animateColor, spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import Item from "../itemTree/item";
import * as icons from "./icons";

class ItemRow {
  position: Vector;
  public lastChildY?: number;
  color: string;

  opacity = 1;
  fontSize: number;
  circleR: number;

  constructor(public item: Item, public level: number, y: number) {
    this.color = item.isSelected ? c.selectedItem : c.text;
    this.fontSize = level == 0 ? fontSizes.big : fontSizes.regular;
    this.position = { x: spacings.xBase + level * spacings.xStep, y };
    this.circleR =
      spacings.circleRadius *
      (level === 0 ? fontSizes.big / fontSizes.regular : 1);
  }

  // this is called 60FPS,
  // thus making this code faster will improve animation perfomance
  draw(canvas: Canvas) {
    const { item, position, level, fontSize, color } = this;
    const { lastChildY } = this;

    if (level !== 0)
      canvas.drawLine(
        add(this.position, { x: -spacings.circleRadius, y: 0 }),
        add(this.position, { x: -spacings.xStep + 1, y: 0 }),
        2,
        c.line
      );
    if (lastChildY) {
      canvas.drawLine(
        this.position,
        { x: this.position.x, y: lastChildY },
        2,
        c.line
      );
    }

    this.drawIcon(canvas);
    canvas.drawText(this.getTextPosition(), item.title, fontSize, color);
  }

  drawIcon = (canvas: Canvas) => {
    const { item, position, level, color } = this;
    if (item.type && item.type === "YTvideo") {
      const iconWidth = level === 0 ? 9 : 6;
      const path = item.isPlaying ? icons.pause : icons.play;
      icons.drawAt(canvas, position.x, position.y, iconWidth, path, color);
    } else if (item.children.length > 0)
      canvas.drawCircle(position, this.circleR, color);
    else canvas.drawCirclePath(position, this.circleR, color);
  };

  public merge(old: ItemRow) {
    const row = this;
    if (old.position.y !== row.position.y)
      spring(old.position.y, row.position.y, (val) => {
        row.position.y = val;
      });

    if (old.position.x !== row.position.x)
      spring(old.position.x, row.position.x, (val) => {
        row.position.x = val;
      });

    if (old.fontSize !== row.fontSize)
      spring(old.fontSize, row.fontSize, (val) => {
        row.fontSize = val;
      });

    if (old.lastChildY && row.lastChildY && old.lastChildY !== row.lastChildY)
      spring(old.lastChildY, row.lastChildY, (val) => {
        row.lastChildY = val;
      });
  }

  private getTextPosition = () => {
    const x =
      this.level == 0
        ? sp.zeroLevelCircleToTextDistance
        : sp.circleToTextDistance;
    return add(this.position, { x, y: this.fontSize * 0.32 });
  };
}

export default ItemRow;
